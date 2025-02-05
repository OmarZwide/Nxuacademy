import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { PaymentForm } from "./payment-form";
import { Skeleton } from "./skeleton";
import { AlertCircle } from "lucide-react";
import type { Appearance } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!publishableKey) {
  console.error("Missing Stripe publishable key");
}

// Initialize Stripe with error handling
let stripePromise;
try {
  stripePromise = publishableKey ? loadStripe(publishableKey) : null;
} catch (error) {
  console.error("Failed to initialize Stripe:", error);
  stripePromise = null;
}

interface StripePaymentProviderProps {
  clientSecret: string;
  amount: number;
  onSuccess?: () => void;
}

export function StripePaymentProvider({ 
  clientSecret, 
  amount,
  onSuccess 
}: StripePaymentProviderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initStripe = async () => {
      try {
        if (!stripePromise) {
          throw new Error("Stripe could not be initialized - missing publishable key");
        }
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Failed to initialize Stripe");
        }
        setLoading(false);
      } catch (err) {
        console.error("Stripe initialization error:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize payment system");
        setLoading(false);
      }
    };

    initStripe();
  }, []);

  if (!publishableKey || !stripePromise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment System Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>Payment system is not properly configured. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Elements 
            stripe={stripePromise} 
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#7c3aed',
                },
              },
            }}
          >
            <PaymentForm amount={amount} onSuccess={onSuccess} />
          </Elements>
        )}
      </CardContent>
    </Card>
  );
}