import { Link } from "react-router-dom";

export function WorkoutSummaryPage() {
  const summary = JSON.parse(sessionStorage.getItem("lastWorkoutSummary") ?? "null") as null | {
    workout: { expAwarded: number; routineCompleted: boolean };
    levelUp: null | { from: number; to: number; rewards: Array<{ title: string; badge?: string }> };
  };

  return (
    <div className="panel max-w-2xl p-6">
      <h2 className="font-display text-5xl font-bold">Workout Summary</h2>
      {summary ? (
        <div className="mt-5 space-y-4">
          <p className="text-2xl font-semibold text-arena-green">+{summary.workout.expAwarded} EXP</p>
          <p className="text-arena-muted">{summary.workout.routineCompleted ? "Full routine bonus applied." : "Partial workout saved."}</p>
          {summary.levelUp && (
            <div className="rounded-md border border-arena-orange bg-arena-orange/10 p-4">
              <p className="font-display text-3xl font-bold">Level up: {summary.levelUp.from} to {summary.levelUp.to}</p>
              <p className="text-arena-muted">New title: {summary.levelUp.rewards.at(-1)?.title}</p>
            </div>
          )}
        </div>
      ) : <p className="mt-4 text-arena-muted">No workout summary available.</p>}
      <Link className="btn-primary mt-6" to="/">Back to dashboard</Link>
    </div>
  );
}
