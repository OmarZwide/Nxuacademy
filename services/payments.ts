import { stripe } from "../config/stripe";
import { db } from "@db";
import { students, paymentPlans, payments, enrollments } from "@db/schema";
import { eq } from "drizzle-orm";
import type { InsertPaymentPlan, InsertPayment } from "@db/schema";
import type Stripe from "stripe";

export class PaymentService {
  static async createCustomer(email: string, name: string): Promise<string> {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer.id;
  }

  static async calculatePaymentPlan(courseAmount: number) {
    const depositPercentage = 0.3; // 30% deposit
    const depositAmount = courseAmount * depositPercentage;
    const remainingAmount = courseAmount - depositAmount;
    const monthlyAmount = remainingAmount / 12; // 12 monthly payments

    return {
      totalAmount: courseAmount,
      depositAmount,
      monthlyAmount,
      remainingPayments: 12,
    };
  }

  static async createPaymentPlan({
    studentId,
    enrollmentId,
    courseAmount,
  }: {
    studentId: number;
    enrollmentId: number;
    courseAmount: number;
  }) {
    const plan = await this.calculatePaymentPlan(courseAmount);

    const [paymentPlan] = await db.insert(paymentPlans).values({
      studentId,
      enrollmentId,
      totalAmount: plan.totalAmount.toString(),
      depositAmount: plan.depositAmount.toString(),
      monthlyAmount: plan.monthlyAmount.toString(),
      remainingPayments: plan.remainingPayments,
      status: 'pending',
      depositPaid: false,
    }).returning();

    return paymentPlan;
  }

  static async createPaymentIntent({
    amount,
    customerId,
    paymentPlanId,
    studentId,
    isDeposit = false,
  }: {
    amount: number;
    customerId: string;
    paymentPlanId: number;
    studentId: number;
    isDeposit?: boolean;
  }): Promise<Stripe.PaymentIntent> {
    // Using stripe from server-side config which uses STRIPE_SECRET_KEY
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'zar',
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always'
      },
      metadata: {
        paymentPlanId: paymentPlanId.toString(),
        studentId: studentId.toString(),
        type: isDeposit ? 'deposit' : 'monthly',
      },
    });

    return paymentIntent;
  }

  static async processPayment({
    paymentPlanId,
    studentId,
    amount,
    paymentIntentId,
    type,
  }: {
    paymentPlanId: number;
    studentId: number;
    amount: number;
    paymentIntentId: string;
    type: 'deposit' | 'monthly';
  }) {
    const payment = await db.insert(payments).values({
      payment_plan_id: paymentPlanId,
      student_id: studentId,
      amount: amount.toString(),
      stripe_payment_intent_id: paymentIntentId,
      status: 'completed',
      type,
      payment_date: new Date(),
    }).returning();

    if (!payment) {
      throw new Error("Failed to record payment");
    }

    // Update payment plan status
    if (type === 'deposit') {
      await db
        .update(paymentPlans)
        .set({ 
          depositPaid: true,
          status: 'active',
        })
        .where(eq(paymentPlans.id, paymentPlanId));

      // Activate enrollment
      const plan = await db.query.paymentPlans.findFirst({
        where: eq(paymentPlans.id, paymentPlanId),
        with: {
          enrollment: true,
        },
      });

      if (plan?.enrollment?.id) {
        await db
          .update(enrollments)
          .set({ status: 'active' })
          .where(eq(enrollments.id, plan.enrollment.id));
      }
    } else {
      const plan = await db.query.paymentPlans.findFirst({
        where: eq(paymentPlans.id, paymentPlanId),
      });

      if (!plan) {
        throw new Error("Payment plan not found");
      }

      if (plan.remainingPayments > 0) {
        await db
          .update(paymentPlans)
          .set({ 
            remainingPayments: plan.remainingPayments - 1,
            status: plan.remainingPayments === 1 ? 'completed' : 'active',
          })
          .where(eq(paymentPlans.id, paymentPlanId));
      }
    }

    return payment[0];
  }
}