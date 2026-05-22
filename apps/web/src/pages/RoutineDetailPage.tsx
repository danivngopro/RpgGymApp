import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

type Routine = {
  id: string;
  name: string;
  description?: string;
  weeklySchedule: string[];
  exercises: Array<{ id: string; sets: number; reps?: number; weightKg?: number; durationSeconds?: number; restSeconds: number; exercise: { name: string; muscleGroups: string[] } }>;
};

export function RoutineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    if (id) void api<{ routine: Routine }>(`/routines/${id}`).then((data) => setRoutine(data.routine));
  }, [id]);

  async function startWorkout() {
    const data = await api<{ workout: { id: string } }>("/workouts/start", {
      method: "POST",
      body: JSON.stringify({ routineId: id })
    });
    sessionStorage.setItem("lastStartedWorkout", JSON.stringify(data.workout));
    navigate(`/workout/${data.workout.id}`);
  }

  if (!routine) return <p className="text-arena-muted">Loading routine...</p>;

  return (
    <div className="space-y-5">
      <section className="panel flex flex-wrap items-start justify-between gap-4 p-6">
        <div>
          <h2 className="font-display text-5xl font-bold">{routine.name}</h2>
          <p className="mt-2 max-w-2xl text-arena-muted">{routine.description || "No description yet."}</p>
          <p className="mt-3 text-sm uppercase text-arena-amber">{routine.weeklySchedule.join(" · ")}</p>
        </div>
        <button className="btn-primary" onClick={() => void startWorkout()}><Play className="h-4 w-4" />Start workout</button>
      </section>
      <section className="grid gap-3">
        {routine.exercises.map((item, index) => (
          <div className="panel p-5" key={item.id}>
            <p className="text-sm text-arena-muted">Exercise {index + 1}</p>
            <h3 className="font-display text-3xl font-bold">{item.exercise.name}</h3>
            <p className="mt-2 text-arena-muted">{item.sets} sets · {item.reps ?? "-"} reps · {item.durationSeconds ?? "-"} sec · {item.restSeconds}s rest</p>
          </div>
        ))}
      </section>
    </div>
  );
}
