import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

type Workout = {
  id: string;
  routine: {
    name: string;
    exercises: Array<{ id: string; sets: number; reps?: number; weightKg?: number; durationSeconds?: number; exercise: { name: string } }>;
  };
};

type CompletionResult = {
  workout: { expAwarded: number; routineCompleted: boolean };
  levelUp: null | { from: number; to: number; rewards: Array<{ title: string; badge?: string }> };
};

export function ActiveWorkoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setError("");
    void api<{ workout: Workout }>(`/workouts/${id}`)
      .then((data) => setWorkout(data.workout))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load workout");
        const cached = sessionStorage.getItem("lastStartedWorkout");
        if (cached) setWorkout(JSON.parse(cached));
      });
  }, [id]);

  async function finishWorkout() {
    if (!workout || !id) return;
    const exercises = workout.routine.exercises
      .filter((exercise) => completed[exercise.id])
      .map((exercise) => ({
        routineExerciseId: exercise.id,
        sets: exercise.sets,
        reps: exercise.reps,
        weightKg: exercise.weightKg,
        durationSeconds: exercise.durationSeconds
      }));
    try {
      const result = await api<CompletionResult>(`/workouts/${id}/complete`, { method: "POST", body: JSON.stringify({ exercises }) });
      sessionStorage.setItem("lastWorkoutSummary", JSON.stringify(result));
      navigate("/workout-summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete workout");
    }
  }

  if (!workout) {
    return (
      <div className="panel max-w-xl p-6">
        <h2 className="font-display text-4xl font-bold">Workout session opened</h2>
        <p className="mt-2 text-arena-muted">Unable to load this workout from the API. Verify the API is running and that this workout belongs to your logged-in user.</p>
        {error && <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      </div>
    );
  }

  const doneCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <h2 className="font-display text-5xl font-bold">{workout.routine.name}</h2>
        <p className="text-arena-muted">{doneCount} / {workout.routine.exercises.length} exercises completed</p>
        {error && <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      </section>
      {workout.routine.exercises.map((exercise) => (
        <button
          className={`panel flex w-full items-center justify-between p-5 text-left transition-colors ${completed[exercise.id] ? "border-arena-green" : "hover:border-arena-orange"}`}
          key={exercise.id}
          onClick={() => setCompleted((current) => ({ ...current, [exercise.id]: !current[exercise.id] }))}
        >
          <div>
            <h3 className="font-display text-3xl font-bold">{exercise.exercise.name}</h3>
            <p className="text-arena-muted">{exercise.sets} sets · {exercise.reps ?? "-"} reps · {exercise.durationSeconds ?? "-"} sec</p>
          </div>
          {completed[exercise.id] && <CheckCircle2 className="h-6 w-6 text-arena-green" />}
        </button>
      ))}
      <button className="btn-primary" disabled={doneCount === 0} onClick={() => void finishWorkout()}>Complete workout</button>
    </div>
  );
}
