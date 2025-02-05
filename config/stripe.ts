import Stripe from 'stripe';

// Ensure secret key is available
const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY must be set');
}

// Server-side Stripe instance using secret key
export const stripe = new Stripe(secretKey, {
  apiVersion: '2023-10-16', // Using stable version
  appInfo: {
    name: 'NXU Academy',
    version: '1.0.0',
  },
});

// Configure Stripe for South African payments
export async function configureStripePaymentSettings() {
  try {
    // Set up payment method configuration for South Africa
    await stripe.paymentIntents.create({
      amount: 100, // Test amount
      currency: 'zar',
      payment_method_types: ['card'],
      metadata: {
        integration_check: 'zar_payment_test'
      }
    });

    console.log('Successfully configured Stripe for ZAR payments');
  } catch (error) {
    console.error('Failed to configure Stripe payment settings:', error);
    throw error;
  }
}