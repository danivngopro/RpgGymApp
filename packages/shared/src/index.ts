import { z } from 'zod';

export const APP_NAME = 'GymRPG';
export const API_VERSION = 'v1';

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  appName: z.literal(APP_NAME),
  environment: z.string().min(1),
  timestamp: z.string().datetime(),
  version: z.literal(API_VERSION)
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
