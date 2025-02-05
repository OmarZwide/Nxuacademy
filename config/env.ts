import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.string(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PORT: z.coerce.number().default(5000),
  HOST: z.string().default("0.0.0.0"),
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  VERCEL_REGION: z.string().optional(),
  ALLOWED_DOMAINS: z
    .string()
    .transform((str) => {
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Default domains including both www and non-www versions
        const domains = [
          "nxuacademy.co.uk",
          "www.nxuacademy.co.uk",
          "localhost",
          "0.0.0.0"
        ];

        // Add Vercel preview domains
        if (process.env.VERCEL_URL) {
          domains.push(process.env.VERCEL_URL);
        }

        // Add Vercel deployment domains
        domains.push(
          ".vercel.app",
          ".vercel.dev",
          ".now.sh"
        );

        return domains;
      }
    })
    .default("[]"),
});

const validateEnv = () => {
  try {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      console.error("❌ Invalid environment variables:", parsed.error.format());
      process.exit(1);
    }

    return parsed.data;
  } catch (error) {
    console.error("❌ Failed to validate environment variables:", error);
    process.exit(1);
  }
};

export const env = validateEnv();

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}