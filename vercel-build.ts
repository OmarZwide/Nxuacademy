import { exec } from "child_process";
import { promisify } from "util";
import { db } from "@db";

const execAsync = promisify(exec);

async function buildForVercel() {
  console.log("Starting Vercel build process...");

  try {
    // Ensure DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    // Test database connection
    console.log("Testing database connection...");
    try {
      await db.query.students.findFirst();
      console.log("✓ Database connection verified");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }

    // Run database migrations
    console.log("Running database migrations...");
    await execAsync("npx drizzle-kit push");

    // Build the frontend
    console.log("Building frontend...");
    await execAsync("npx vite build");

    console.log("Build process completed successfully");
    return true;
  } catch (error) {
    console.error("Build failed:", error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
}

// Only run if this is the main module
if (import.meta.url.endsWith(process.argv[1])) {
  buildForVercel().catch((error) => {
    console.error("Fatal build error:", error);
    process.exit(1);
  });
}

export { buildForVercel };