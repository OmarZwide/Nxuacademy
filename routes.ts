import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { waitlist, students, enrollments, paymentPlans, payments } from "@db/schema.js";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { PaymentService } from "./services/payments.js";
import { stripe } from "./config/stripe.js";
import type Stripe from "stripe";

// Extend Express Request type to include rawBody
declare global {
  namespace Express {
    interface Request {
      rawBody?: string;
    }
  }
}

export function registerRoutes(app: Express): Server {
  // Add test endpoint at the top
  app.get("/api/test", (req, res) => {
    return res.json({
      success: true,
      message: "API is working",
      timestamp: new Date().toISOString()
    });
  });

  app.use((req, res, next) => {
    if (req.url === '/api/webhook/stripe') {
      let data = '';
      req.setEncoding('utf8');
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => {
        req.rawBody = data;
        next();
      });
    } else {
      next();
    }
  });

  // Test endpoint to verify Stripe configuration
  app.get("/api/payments/test-config", async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({
          success: false,
          message: "Stripe configuration missing",
          details: {
            hasSecretKey: false,
            hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
            currency: 'gbp'
          }
        });
      }

      // Test Stripe API connection with proper GBP amount
      const testAmount = 10000; // £100.00 (in pence)
      console.log("Creating test charge with amount:", testAmount);

      // Create a test payment method first
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '314',
        },
      });

      // Create a test customer
      const customer = await stripe.customers.create({
        email: 'test@example.com',
        payment_method: paymentMethod.id,
      });

      // Create a payment intent instead of a direct charge
      const paymentIntent = await stripe.paymentIntents.create({
        amount: testAmount,
        currency: 'gbp',
        customer: customer.id,
        payment_method: paymentMethod.id,
        confirm: true,
        description: 'Test payment - Configuration verification (GBP)',
        metadata: {
          test: 'true',
          integration_check: 'true'
        }
      });

      // If payment succeeds, create a refund
      if (paymentIntent.status === 'succeeded') {
        await stripe.refunds.create({
          payment_intent: paymentIntent.id,
          metadata: {
            test: 'true',
            integration_check: 'true'
          }
        });
      }

      return res.json({
        success: true,
        message: "Stripe configuration is valid",
        details: {
          apiConnected: true,
          hasSecretKey: true,
          hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
          paymentIntentId: paymentIntent.id,
          currency: 'gbp'
        }
      });
    } catch (error) {
      console.error("Stripe configuration test failed:", error);
      return res.status(500).json({
        success: false,
        message: "Stripe configuration test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        details: {
          apiConnected: false,
          hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
          hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
          currency: 'gbp'
        }
      });
    }
  });

  app.get("/api/healthz", async (req, res) => {
    try {
      // Check database connection with error logging
      console.log("Testing database connection...");
      const dbResult = await db.query.students.findFirst();
      console.log("Database connection test result:", !!dbResult);

      // Test Stripe configuration
      let stripeStatus = false;
      if (process.env.STRIPE_SECRET_KEY) {
        try {
          await stripe.paymentIntents.list({ limit: 1 });
          stripeStatus = true;
        } catch (error) {
          console.error('Stripe check failed:', error);
        }
      }

      // Test email configuration
      const emailStatus = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

      return res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        deployment: {
          vercel: Boolean(process.env.VERCEL),
          environment: process.env.NODE_ENV,
          region: process.env.VERCEL_REGION || 'local'
        },
        integrations: {
          database: true, // Set explicitly to true if we reach this point
          stripe: stripeStatus,
          email: emailStatus
        }
      });
    } catch (error) {
      console.error('Health check failed:', error);
      return res.status(500).json({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown database error',
        timestamp: new Date().toISOString()
      });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      const { fullName, email, referralCode } = req.body;

      const existing = await db.query.waitlist.findFirst({
        where: eq(waitlist.email, email),
      });

      if (existing) {
        return res.status(400).json({
          message: "This email is already registered"
        });
      }

      let referredById = null;
      if (referralCode) {
        const referrer = await db.query.waitlist.findFirst({
          where: eq(waitlist.referralCode, referralCode),
        });

        if (!referrer) {
          return res.status(400).json({
            message: "Invalid referral code"
          });
        }

        referredById = referrer.id;
      }

      const newReferralCode = nanoid(8);

      const result = await db.insert(waitlist).values({
        fullName,
        email,
        referralCode: newReferralCode,
        referredById,
      }).returning();

      return res.status(201).json({
        message: "Successfully joined the waitlist!",
        referralCode: newReferralCode
      });
    } catch (error) {
      console.error("Waitlist registration error:", error);
      return res.status(500).json({
        message: "Failed to register. Please try again."
      });
    }
  });

  app.get("/api/waitlist/referrals/:code", async (req, res) => {
    try {
      const { code } = req.params;

      const user = await db.query.waitlist.findFirst({
        where: eq(waitlist.referralCode, code),
        with: {
          referrals: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "Referral code not found"
        });
      }

      return res.status(200).json({
        referralCount: user.referrals.length
      });
    } catch (error) {
      console.error("Referral stats error:", error);
      return res.status(500).json({
        message: "Failed to get referral stats"
      });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const { fullName, email, phone, courseId } = req.body;

      const userId = nanoid();
      const studentResult = await db.insert(students).values({
        userId,
        fullName,
        email,
        phone,
        stripeCustomerId: null,
        isActive: true,
      }).returning();

      const student = studentResult[0];
      if (!student) throw new Error("Failed to create student record");

      console.log("Creating Stripe customer...");
      const stripeCustomerId = await PaymentService.createCustomer(email, fullName);
      console.log("Stripe customer created:", stripeCustomerId);

      await db.update(students)
        .set({ stripeCustomerId })
        .where(eq(students.id, student.id));

      const enrollmentResult = await db.insert(enrollments).values({
        studentId: student.id,
        courseId,
        status: 'pending',
      }).returning();

      const enrollment = enrollmentResult[0];
      if (!enrollment) throw new Error("Failed to create enrollment record");

      const courseAmount = 360000; // £3,600.00 in pence
      console.log("Creating payment plan...");
      const paymentPlan = await PaymentService.createPaymentPlan({
        studentId: student.id,
        enrollmentId: enrollment.id,
        courseAmount,
      });

      if (!paymentPlan) throw new Error("Failed to create payment plan");

      console.log("Creating payment intent...");
      const paymentIntent = await PaymentService.createPaymentIntent({
        amount: Number(paymentPlan.depositAmount),
        customerId: stripeCustomerId,
        paymentPlanId: paymentPlan.id,
        studentId: student.id,
        isDeposit: true,
      });
      console.log("Payment intent created:", paymentIntent.id);

      return res.status(201).json({
        enrollment,
        paymentPlan,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Enrollment error:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to process enrollment. Please try again.",
      });
    }
  });

  app.post("/api/webhook/stripe", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      console.error('Webhook Error: Missing signature or secret');
      return res.status(400).send("Webhook Error: Missing signature or secret");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody!,
        sig,
        endpointSecret
      );

      console.log('Received Stripe webhook event:', event.type);

      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const { paymentPlanId, type, studentId } = paymentIntent.metadata || {};

          if (!paymentPlanId || !type || !studentId) {
            throw new Error("Missing required metadata");
          }

          await PaymentService.processPayment({
            paymentPlanId: parseInt(paymentPlanId),
            studentId: parseInt(studentId),
            amount: paymentIntent.amount / 100, // Convert from cents to ZAR
            paymentIntentId: paymentIntent.id,
            type: type as 'deposit' | 'monthly',
          });

          console.log('Successfully processed payment:', paymentIntent.id);
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
          break;
        }

        case 'charge.succeeded': {
          const charge = event.data.object as Stripe.Charge;
          console.log('Charge succeeded:', charge.id);
          break;
        }

        case 'charge.failed': {
          const charge = event.data.object as Stripe.Charge;
          console.error('Charge failed:', charge.id, charge.failure_message);
          break;
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  });

  app.post("/api/payments/monthly/:planId", async (req, res) => {
    try {
      const { planId } = req.params;

      const plan = await db.query.paymentPlans.findFirst({
        where: eq(paymentPlans.id, parseInt(planId)),
        with: {
          student: true,
        },
      });

      if (!plan) {
        return res.status(404).json({
          message: "Payment plan not found",
        });
      }

      if (!plan.depositPaid) {
        return res.status(400).json({
          message: "Deposit must be paid first",
        });
      }

      if (plan.remainingPayments === 0) {
        return res.status(400).json({
          message: "All payments have been completed",
        });
      }

      const student = await db.query.students.findFirst({
        where: eq(students.id, plan.studentId),
      });

      if (!student?.stripeCustomerId) {
        return res.status(400).json({
          message: "Invalid student payment information",
        });
      }

      const paymentIntent = await PaymentService.createPaymentIntent({
        amount: Number(plan.monthlyAmount),
        customerId: student.stripeCustomerId,
        paymentPlanId: plan.id,
        studentId: plan.studentId,
        isDeposit: false,
      });

      return res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Monthly payment error:", error);
      return res.status(500).json({
        message: "Failed to process monthly payment. Please try again.",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}