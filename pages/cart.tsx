import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { ZAR } from "../lib/currency";

interface CartItem {
  id: number;
  courseId: string;
  price: number;
  courseName: string;
}

interface PaymentPlan {
  totalAmount: number;
  depositAmount: number;
  monthlyAmount: number;
  remainingPayments: number;
}

export default function Cart() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartItems, isLoading } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
  });

  const { data: paymentPlan } = useQuery<PaymentPlan>({
    queryKey: ['/api/cart/payment-plan'],
    enabled: !!cartItems?.length,
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/cart/checkout');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.clientSecret) {
        // Redirect to Stripe checkout
        window.location.href = `/checkout?payment_intent=${data.clientSecret}`;
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process checkout",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">Loading cart...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600">Browse our courses to get started</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <Card key={item.id} className="mb-4">
              <CardHeader>
                <CardTitle>{item.courseName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ZAR.format(item.price)}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentPlan && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Course Fee</span>
                    <span className="font-bold">{ZAR.format(paymentPlan.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Initial Deposit (30%)</span>
                    <span className="font-bold">{ZAR.format(paymentPlan.depositAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>12 Monthly Payments</span>
                    <span className="font-bold">{ZAR.format(paymentPlan.monthlyAmount)}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => checkoutMutation.mutate()}
                disabled={isProcessing || checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? "Processing..." : "Proceed to Payment"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}