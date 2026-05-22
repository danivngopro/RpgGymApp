import { describe, expect, it } from "vitest";
import {
  applyRoutineCompletionBonus,
  calculateExerciseExp,
  expRequiredForNextLevel,
  levelFromTotalExp,
  rewardForLevel
} from "@rpg-gym/shared";

describe("progression calculations", () => {
  it("increases level requirements as levels rise", () => {
    expect(expRequiredForNextLevel(2)).toBeGreaterThan(expRequiredForNextLevel(1));
    expect(expRequiredForNextLevel(10)).toBeGreaterThan(expRequiredForNextLevel(5));
  });

  it("calculates target multiplier for completed exercise goals", () => {
    const result = calculateExerciseExp({ sets: 3, reps: 10 }, { sets: 3, reps: 10, weightKg: 60 });

    expect(result.targetMet).toBe(true);
    expect(result.awardedExp).toBe(Math.round(result.baseExp * 1.3));
  });

  it("does not apply target multiplier when target is missed", () => {
    const result = calculateExerciseExp({ sets: 3, reps: 10 }, { sets: 2, reps: 10, weightKg: 60 });

    expect(result.targetMet).toBe(false);
    expect(result.awardedExp).toBe(result.baseExp);
  });

  it("applies routine completion bonus to total exercise exp", () => {
    expect(applyRoutineCompletionBonus(100, true)).toBe(130);
    expect(applyRoutineCompletionBonus(100, false)).toBe(100);
  });

  it("returns level rewards with cosmetic stat points", () => {
    expect(levelFromTotalExp(0).level).toBe(1);
    expect(rewardForLevel(5)).toMatchObject({ title: "Iron Trainee", statPoints: 1 });
  });
});
