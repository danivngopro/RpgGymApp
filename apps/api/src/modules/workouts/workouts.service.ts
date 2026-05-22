import { calculateExerciseExp, applyRoutineCompletionBonus, levelFromTotalExp, rewardForLevel, titleForLevel } from "@rpg-gym/shared";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/errors.js";
import type { CompleteWorkoutInput } from "@rpg-gym/shared";

export async function completeWorkout(userId: string, workoutId: string, input: CompleteWorkoutInput) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.workoutSession.findFirst({
      where: { id: workoutId, userId },
      include: {
        routine: { include: { exercises: true } }
      }
    });
    if (!session) throw new AppError(404, "Workout session not found");
    if (session.status === "completed") throw new AppError(409, "Workout already completed");

    const claimed = await tx.workoutSession.updateMany({
      where: { id: workoutId, userId, status: "active" },
      data: { status: "completed", completedAt: new Date() }
    });
    if (claimed.count !== 1) throw new AppError(409, "Workout already completed");

    const targetsById = new Map(session.routine.exercises.map((exercise) => [exercise.id, exercise]));
    const completedIds = new Set(input.exercises.map((exercise) => exercise.routineExerciseId));
    const routineCompleted = session.routine.exercises.every((exercise) => completedIds.has(exercise.id));

    const results = input.exercises.map((completed) => {
      const target = targetsById.get(completed.routineExerciseId);
      if (!target) throw new AppError(400, "Completed exercise does not belong to this routine");
      return {
        completed,
        exp: calculateExerciseExp(
          { sets: target.sets, reps: target.reps, durationSeconds: target.durationSeconds },
          completed
        )
      };
    });

    const exerciseExp = results.reduce((sum, result) => sum + result.exp.awardedExp, 0);
    const totalAwardedExp = applyRoutineCompletionBonus(exerciseExp, routineCompleted);
    const userBefore = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const beforeLevel = userBefore.level;
    const nextTotalExp = userBefore.totalExp + totalAwardedExp;
    const progression = levelFromTotalExp(nextTotalExp);
    const levelsGained = Math.max(0, progression.level - beforeLevel);
    const rewards = Array.from({ length: levelsGained }, (_, index) => rewardForLevel(beforeLevel + index + 1));

    await tx.completedExercise.createMany({
      data: results.map((result) => ({
        workoutSessionId: session.id,
        routineExerciseId: result.completed.routineExerciseId,
        sets: result.completed.sets,
        reps: result.completed.reps,
        weightKg: result.completed.weightKg,
        durationSeconds: result.completed.durationSeconds,
        notes: result.completed.notes,
        baseExp: result.exp.baseExp,
        targetMet: result.exp.targetMet,
        awardedExp: result.exp.awardedExp
      }))
    });

    await tx.workoutSession.update({
      where: { id: session.id },
      data: { expAwarded: totalAwardedExp }
    });

    const user = await tx.user.update({
      where: { id: userId },
      data: {
        totalExp: nextTotalExp,
        level: progression.level,
        title: titleForLevel(progression.level),
        currentStreak: { increment: 1 }
      }
    });

    return {
      workout: {
        id: session.id,
        routineId: session.routineId,
        routineCompleted,
        exerciseExp,
        expAwarded: totalAwardedExp
      },
      exercises: results.map((result) => ({
        routineExerciseId: result.completed.routineExerciseId,
        ...result.exp
      })),
      user: {
        id: user.id,
        level: user.level,
        totalExp: user.totalExp,
        title: user.title,
        progression
      },
      levelUp: levelsGained > 0 ? { from: beforeLevel, to: progression.level, rewards } : null
    };
  });
}
