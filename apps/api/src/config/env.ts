import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4001),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://rpg_gym:rpg_gym@localhost:5432/rpg_gym?schema=public'),
  JWT_SECRET: z.string().min(20).default('replace-with-a-long-local-secret'),
  CORS_ORIGIN: z.string().url().default('http://localhost:5173')
});

export const env = EnvSchema.parse(process.env);
