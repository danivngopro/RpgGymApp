import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

for (const envPath of [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "apps/api/.env")
]) {
  dotenv.config({ path: envPath });
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  CORS_ORIGIN: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional()
});

const parsed = envSchema.parse(process.env);

export const config = {
  ...parsed,
  CORS_ORIGIN: parsed.CORS_ORIGIN ?? parsed.FRONTEND_URL
};
