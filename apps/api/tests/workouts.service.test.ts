import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../src/middleware/errors.js";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  tx: {
    workoutSession: {
      findFirst: vi.fn(),
      updateMany: vi.fn()
    }
  }
}));

vi.mock("../src/lib/prisma.js", () => ({
  prisma: {
    $transaction: mocks.transaction
  }
}));

describe("completeWorkout duplicate prevention", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.transaction.mockImplementation((callback) => callback(mocks.tx));
  });

  it("returns 409 when the workout is already completed", async () => {
    const { completeWorkout } = await import("../src/modules/workouts/workouts.service.js");
    mocks.tx.workoutSession.findFirst.mockResolvedValue({
      id: "workout-1",
      userId: "user-1",
      status: "completed",
      routine: { exercises: [] }
    });

    await expect(completeWorkout("user-1", "workout-1", { exercises: [{ routineExerciseId: "clx0000000000000000000000", sets: 1 }] }))
      .rejects.toMatchObject(new AppError(409, "Workout already completed"));
    expect(mocks.tx.workoutSession.updateMany).not.toHaveBeenCalled();
  });

  it("returns 409 when another request already claimed the active workout", async () => {
    const { completeWorkout } = await import("../src/modules/workouts/workouts.service.js");
    mocks.tx.workoutSession.findFirst.mockResolvedValue({
      id: "workout-1",
      userId: "user-1",
      status: "active",
      routine: {
        exercises: [{ id: "clx0000000000000000000000", sets: 1, reps: 1, durationSeconds: null }]
      }
    });
    mocks.tx.workoutSession.updateMany.mockResolvedValue({ count: 0 });

    await expect(completeWorkout("user-1", "workout-1", { exercises: [{ routineExerciseId: "clx0000000000000000000000", sets: 1, reps: 1 }] }))
      .rejects.toMatchObject(new AppError(409, "Workout already completed"));
  });
});
