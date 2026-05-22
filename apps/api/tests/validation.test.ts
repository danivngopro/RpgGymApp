import { describe, expect, it } from "vitest";
import { completeWorkoutSchema, registerSchema, routineSchema } from "@rpg-gym/shared";

describe("request validation", () => {
  it("normalizes registration email and rejects short passwords", () => {
    expect(registerSchema.parse({ email: "USER@EXAMPLE.COM", username: "Hero_1", password: "password1" }).email).toBe("user@example.com");
    expect(() => registerSchema.parse({ email: "bad", username: "x", password: "short" })).toThrow();
  });

  it("requires at least one exercise in a routine", () => {
    expect(() =>
      routineSchema.parse({
        name: "Push Day",
        estimatedDurationMinutes: 45,
        targetMuscleGroups: ["chest"],
        weeklySchedule: ["mon"],
        exercises: []
      })
    ).toThrow();
  });

  it("validates workout completion payloads", () => {
    const parsed = completeWorkoutSchema.parse({
      exercises: [{ routineExerciseId: "clx0000000000000000000000", sets: 3, reps: 10 }]
    });

    expect(parsed.exercises[0].sets).toBe(3);
  });
});
