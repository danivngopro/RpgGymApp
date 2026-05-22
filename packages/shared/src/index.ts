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

export const UsernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(32, 'Username must be at most 32 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const PasswordSchema = z.string().min(8, 'Password must be at least 8 characters');

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  username: UsernameSchema,
  password: PasswordSchema,
  displayName: z.string().min(1).max(80).optional()
});

export const LoginRequestSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: PasswordSchema
});

export const SafeUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: UsernameSchema,
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  level: z.number().int().positive(),
  totalExp: z.number().int().nonnegative(),
  currentStreak: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const AuthResponseSchema = z.object({
  token: z.string().min(1),
  user: SafeUserSchema
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type SafeUser = z.infer<typeof SafeUserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
