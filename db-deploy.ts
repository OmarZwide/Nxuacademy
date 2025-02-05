import { drizzle } from "drizzle-orm/neon-http";
import { neon } from '@neondatabase/serverless';
import * as schema from "../db/schema.js";
import { migrate } from "drizzle-orm/neon-http/migrator";
import path from "path";

async function checkMigrationsTable(sql: any): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = '__drizzle_migrations'
      );
    `;
    return result[0]?.exists || false;
  } catch (error) {
    console.error("Error checking migrations table:", error);
    return false;
  }
}

export async function deployDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    console.log("Starting database deployment...");

    // Create SQL connection for HTTP-based serverless access
    const sql = neon(process.env.DATABASE_URL);

    // Initialize Drizzle with HTTP client
    const db = drizzle(sql, { schema });

    // Check if migrations table exists
    const migrationsExist = await checkMigrationsTable(sql);
    if (migrationsExist) {
      console.log("Migrations table already exists, skipping initial setup");
    }

    // Run migrations
    console.log("Running migrations...");
    const migrationsFolder = path.join(process.cwd(), "migrations");

    try {
      await migrate(db, { migrationsFolder });
      console.log("Migrations completed successfully");
    } catch (error) {
      // Check if the error is just about existing sequences
      if (error instanceof Error && 
          error.message.includes('pg_class_relname_nsp_index') &&
          error.message.includes('already exists')) {
        console.log("Ignoring sequence creation error as they already exist");
      } else {
        throw error;
      }
    }

    console.log("Database deployment completed successfully");
    return true;
  } catch (error) {
    console.error("Database deployment failed:", error);
    throw error;
  }
}

// Only run if this is the main module
if (import.meta.url.endsWith('db-deploy.ts')) {
  deployDatabase().catch(() => process.exit(1));
}