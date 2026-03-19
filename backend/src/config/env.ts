import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  DATABASE_URL: z.string().min(1),
  ADMIN_TOKEN: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
