import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const DEFAULT_LOCAL_DATABASE_URL =
  "postgresql://war_clock:war_clock@localhost:5432/war_clock";
const DEFAULT_PRODUCTION_DATABASE_URL =
  "postgresql://postgres:dbgfpDSadkCiAYceFTQgwKHRUFhrLhff@postgres.railway.internal:5432/railway";
const DEFAULT_PRODUCTION_CORS_ORIGIN = "https://war-clock-production.up.railway.app";
const DEFAULT_ADMIN_TOKEN = "warwhatisgoodfor";

const isProduction = process.env.NODE_ENV === "production";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  DATABASE_URL: z.string().min(1).default(
    isProduction ? DEFAULT_PRODUCTION_DATABASE_URL : DEFAULT_LOCAL_DATABASE_URL,
  ),
  ADMIN_TOKEN: z.string().min(1).default(DEFAULT_ADMIN_TOKEN),
  CORS_ORIGIN: z.string().min(1).default(DEFAULT_PRODUCTION_CORS_ORIGIN),
});

export const env = envSchema.parse(process.env);

process.env.DATABASE_URL = env.DATABASE_URL;
process.env.ADMIN_TOKEN = env.ADMIN_TOKEN;
process.env.CORS_ORIGIN = env.CORS_ORIGIN;
process.env.PORT = String(env.PORT);
process.env.NODE_ENV = env.NODE_ENV;
