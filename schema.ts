import { pgTable, text, serial, timestamp, integer, jsonb, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, type InferModel } from "drizzle-orm";
import { courseInterestEnum } from "@/lib/validations";

export const waitlistTable = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  referralCode: text("referral_code").unique(),
  referredById: integer("referred_by_id"),
  courseInterests: jsonb("course_interests").notNull().default(['AWS_CLOUD_PRACTITIONER']),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waitlistRelations = relations(waitlistTable, ({ one, many }) => ({
  referredBy: one(waitlistTable, {
    relationName: "waitlist_referred_by",
    fields: [waitlistTable.referredById],
    references: [waitlistTable.id],
  }),
  referrals: many(waitlistTable, {
    relationName: "waitlist_referrals",
    fields: [waitlistTable.referredById],
    references: [waitlistTable.id],
  }),
}));

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  courseId: text("course_id").notNull(),
  status: text("status").notNull().default('pending'),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentPlans = pgTable("payment_plans", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  enrollmentId: integer("enrollment_id").references(() => enrollments.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  monthlyAmount: decimal("monthly_amount", { precision: 10, scale: 2 }).notNull(),
  depositPaid: boolean("deposit_paid").default(false).notNull(),
  remainingPayments: integer("remaining_payments").notNull(),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  paymentPlanId: integer("payment_plan_id").references(() => paymentPlans.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").references(() => cart.id),
  courseId: text("course_id").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const studentsRelations = relations(students, ({ many }) => ({
  enrollments: many(enrollments),
  paymentPlans: many(paymentPlans),
  payments: many(payments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
}));

export const paymentPlansRelations = relations(paymentPlans, ({ one, many }) => ({
  student: one(students, {
    fields: [paymentPlans.studentId],
    references: [students.id],
  }),
  enrollment: one(enrollments, {
    fields: [paymentPlans.enrollmentId],
    references: [enrollments.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  paymentPlan: one(paymentPlans, {
    fields: [payments.paymentPlanId],
    references: [paymentPlans.id],
  }),
  student: one(students, {
    fields: [payments.studentId],
    references: [students.id],
  }),
}));

export const cartRelations = relations(cart, ({ one, many }) => ({
  student: one(students, {
    fields: [cart.studentId],
    references: [students.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
}));

export type Waitlist = InferModel<typeof waitlistTable>;
export type NewWaitlist = InferModel<typeof waitlistTable, "insert">;

export const insertWaitlistSchema = createInsertSchema(waitlistTable);
export const selectWaitlistSchema = createSelectSchema(waitlistTable);
export const insertStudentSchema = createInsertSchema(students);
export const selectStudentSchema = createSelectSchema(students);
export const insertEnrollmentSchema = createInsertSchema(enrollments);
export const selectEnrollmentSchema = createSelectSchema(enrollments);
export const insertPaymentPlanSchema = createInsertSchema(paymentPlans);
export const selectPaymentPlanSchema = createSelectSchema(paymentPlans);
export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);

export const waitlist = waitlistTable;
export type InsertStudent = typeof students.$inferInsert;
export type SelectStudent = typeof students.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;
export type SelectEnrollment = typeof enrollments.$inferSelect;
export type InsertPaymentPlan = typeof paymentPlans.$inferInsert;
export type SelectPaymentPlan = typeof paymentPlans.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type SelectPayment = typeof payments.$inferSelect;