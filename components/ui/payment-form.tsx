import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { ZAR } from "@/lib/currency";

interface PaymentFormProps {
  onSuccess?: () => void;
  amount: number;
}

export function PaymentForm({ onSuccess, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe not initialized");
      setError("Payment system is not ready. Please refresh and try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log("Submitting payment form...");
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Element submit error:", submitError);
        throw submitError;
      }

      console.log("Confirming payment...");
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        console.error("Payment confirmation error:", confirmError);
        throw confirmError;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log("Payment successful:", paymentIntent);
        toast({
          title: "Payment successful!",
          description: "Your payment has been processed successfully.",
        });

        if (onSuccess) {
          onSuccess();
        }
      } else if (paymentIntent) {
        console.log("Payment requires additional action:", paymentIntent.status);
        // Payment requires additional action, the redirect will happen automatically
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
      toast({
        title: "Payment failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isReady) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-100 animate-pulse rounded-md" />
        <div className="h-12 bg-gray-100 animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <PaymentElement options={{
        layout: "tabs",
        paymentMethodOrder: ["card"],
      }} />

      <Button 
        disabled={!stripe || !elements || isProcessing} 
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${ZAR.format(amount)}`
        )}
      </Button>
    </form>
  );
}