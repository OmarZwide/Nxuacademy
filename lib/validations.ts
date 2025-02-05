import * as z from "zod";

export const courseInterestEnum = [
  // Foundational
  'AWS_CLOUD_PRACTITIONER',
  // Associate Level
  'AWS_SOLUTIONS_ARCHITECT_ASSOCIATE',
  'AWS_DEVELOPER_ASSOCIATE',
  'AWS_SYSOPS_ADMINISTRATOR_ASSOCIATE',
  // Professional Level
  'AWS_SOLUTIONS_ARCHITECT_PROFESSIONAL',
  'AWS_DEVOPS_ENGINEER_PROFESSIONAL',
  // Specialty
  'AWS_ADVANCED_NETWORKING_SPECIALTY',
  'AWS_DATA_ANALYTICS_SPECIALTY',
  'AWS_DATABASE_SPECIALTY',
  'AWS_MACHINE_LEARNING_SPECIALTY',
  'AWS_SECURITY_SPECIALTY',
  // Labs and Operations
  'AWS_CLOUD_QUEST',
  'AWS_INDUSTRY_QUEST',
  'AWS_TECHNICAL_ESSENTIALS',
] as const;

export const waitlistSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  referralCode: z
    .string()
    .max(50, "Invalid referral code")
    .optional()
    .nullable(),
  courseInterests: z
    .array(z.enum(courseInterestEnum))
    .min(1, "Please select at least one course")
    .max(4, "You can select up to 4 courses"),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;