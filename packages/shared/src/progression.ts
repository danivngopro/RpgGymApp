export const progressionConfig = {
  exerciseTargetMultiplier: 1.3,
  routineCompletionMultiplier: 1.3,
  minimumExerciseExp: 20,
  levelBaseExp: 100,
  levelExponent: 1.35,
  statPointsPerLevel: 1
} as const;

export type ProgressionStat = "strength" | "endurance" | "discipline" | "consistency";

export type LevelReward = {
  level: number;
  title: string;
  badge?: string;
  profileFrame?: string;
  challengeTier?: string;
  statPoints: number;
};

const titleThresholds = [
  { level: 1, title: "Novice" },
  { level: 5, title: "Iron Trainee" },
  { level: 10, title: "Warrior" },
  { level: 20, title: "Elite" },
  { level: 35, title: "Champion" },
  { level: 50, title: "Legend" }
] as const;

export function expRequiredForNextLevel(level: number): number {
  return Math.round(progressionConfig.levelBaseExp * Math.pow(level, progressionConfig.levelExponent));
}

export function levelFromTotalExp(totalExp: number): { level: number; expIntoLevel: number; expForNextLevel: number } {
  let level = 1;
  let remaining = Math.max(0, totalExp);

  while (remaining >= expRequiredForNextLevel(level)) {
    remaining -= expRequiredForNextLevel(level);
    level += 1;
  }

  return {
    level,
    expIntoLevel: remaining,
    expForNextLevel: expRequiredForNextLevel(level)
  };
}

export function titleForLevel(level: number): string {
  return [...titleThresholds].reverse().find((entry) => level >= entry.level)?.title ?? "Novice";
}

export function rewardForLevel(level: number): LevelReward {
  return {
    level,
    title: titleForLevel(level),
    badge: level === 1 ? "First Steps" : level % 5 === 0 ? `Level ${level}` : undefined,
    profileFrame: [5, 10, 20, 35, 50].includes(level) ? `${titleForLevel(level)} Frame` : undefined,
    challengeTier: level >= 10 && level % 10 === 0 ? `${titleForLevel(level)} Challenges` : undefined,
    statPoints: progressionConfig.statPointsPerLevel
  };
}

export type ExerciseEffort = {
  sets: number;
  reps?: number | null;
  weightKg?: number | null;
  durationSeconds?: number | null;
};

export function calculateExerciseExp(target: ExerciseEffort, completed: ExerciseEffort): {
  baseExp: number;
  targetMet: boolean;
  awardedExp: number;
} {
  const sets = Math.max(0, completed.sets);
  const reps = Math.max(0, completed.reps ?? 0);
  const durationSeconds = Math.max(0, completed.durationSeconds ?? 0);
  const weightKg = Math.max(0, completed.weightKg ?? 0);

  const repExp = sets * reps * 4;
  const durationExp = Math.ceil(durationSeconds / 15) * sets * 3;
  const weightBonus = Math.ceil(weightKg / 10) * sets;
  const baseExp = Math.max(progressionConfig.minimumExerciseExp, repExp + durationExp + weightBonus);

  const targetSetsMet = sets >= target.sets;
  const targetRepsMet = target.reps ? reps >= target.reps : true;
  const targetDurationMet = target.durationSeconds ? durationSeconds >= target.durationSeconds : true;
  const targetMet = targetSetsMet && targetRepsMet && targetDurationMet;

  return {
    baseExp,
    targetMet,
    awardedExp: Math.round(baseExp * (targetMet ? progressionConfig.exerciseTargetMultiplier : 1))
  };
}

export function applyRoutineCompletionBonus(exerciseExp: number, routineCompleted: boolean): number {
  return Math.round(exerciseExp * (routineCompleted ? progressionConfig.routineCompletionMultiplier : 1));
}
