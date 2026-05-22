import { z } from "zod";

export const emailSchema = z.string().email().max(255).transform((value) => value.toLowerCase());
export const usernameSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/);
export const passwordSchema = z.string().min(8).max(128);

export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

export const exerciseQuerySchema = z.object({
  search: z.string().optional(),
  muscle: z.string().optional(),
  equipment: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional()
});

export const routineExerciseSchema = z.object({
  exerciseId: z.string().cuid(),
  order: z.number().int().min(0),
  sets: z.number().int().min(1).max(20),
  reps: z.number().int().min(0).max(200).nullable().optional(),
  weightKg: z.number().min(0).max(1000).nullable().optional(),
  durationSeconds: z.number().int().min(0).max(7200).nullable().optional(),
  restSeconds: z.number().int().min(0).max(1800).default(90),
  notes: z.string().max(1000).nullable().optional()
});

export const routineSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(1000).optional().nullable(),
  targetMuscleGroups: z.array(z.string().min(1)).default([]),
  estimatedDurationMinutes: z.number().int().min(1).max(360),
  weeklySchedule: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])).default([]),
  exercises: z.array(routineExerciseSchema).min(1)
});

export const completedExerciseSchema = z.object({
  routineExerciseId: z.string().cuid(),
  sets: z.number().int().min(0).max(30),
  reps: z.number().int().min(0).max(300).nullable().optional(),
  weightKg: z.number().min(0).max(1000).nullable().optional(),
  durationSeconds: z.number().int().min(0).max(7200).nullable().optional(),
  notes: z.string().max(1000).nullable().optional()
});

export const completeWorkoutSchema = z.object({
  exercises: z.array(completedExerciseSchema).min(1)
});

export const friendRequestSchema = z.object({
  identifier: z.string().min(3).max(255)
});

export const leaderboardQuerySchema = z.object({
  rankBy: z.enum(["weeklyExp", "totalExp", "level", "streak"]).default("weeklyExp")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RoutineInput = z.infer<typeof routineSchema>;
export type CompleteWorkoutInput = z.infer<typeof completeWorkoutSchema>;
