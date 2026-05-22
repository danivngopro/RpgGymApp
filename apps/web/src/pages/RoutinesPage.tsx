import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

type Exercise = { id: string; name: string };
type Routine = { id: string; name: string; description?: string; estimatedDurationMinutes: number; exercises: unknown[] };

export function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [form, setForm] = useState({ name: "", description: "", exerciseId: "", sets: 3, reps: 10, duration: 45 });

  async function load() {
    const [routineData, exerciseData] = await Promise.all([
      api<{ routines: Routine[] }>("/routines"),
      api<{ exercises: Exercise[] }>("/exercises")
    ]);
    setRoutines(routineData.routines);
    setExercises(exerciseData.exercises);
    setForm((current) => ({ ...current, exerciseId: current.exerciseId || exerciseData.exercises[0]?.id || "" }));
  }

  useEffect(() => {
    void load();
  }, []);

  async function createRoutine(event: React.FormEvent) {
    event.preventDefault();
    await api("/routines", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        targetMuscleGroups: [],
        estimatedDurationMinutes: 45,
        weeklySchedule: ["mon", "wed", "fri"],
        exercises: [{ exerciseId: form.exerciseId, order: 0, sets: form.sets, reps: form.reps, durationSeconds: form.duration, restSeconds: 90 }]
      })
    });
    setForm((current) => ({ ...current, name: "", description: "" }));
    await load();
  }

  async function deleteRoutine(id: string) {
    await api(`/routines/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <form className="panel p-5" onSubmit={createRoutine}>
        <h2 className="font-display text-4xl font-bold">Routine Builder</h2>
        <div className="mt-5 space-y-4">
          <label className="block"><span className="label">Name</span><input className="input mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block"><span className="label">Description</span><textarea className="input mt-1 min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label className="block"><span className="label">First exercise</span><select className="input mt-1" value={form.exerciseId} onChange={(e) => setForm({ ...form, exerciseId: e.target.value })}>{exercises.map((exercise) => <option value={exercise.id} key={exercise.id}>{exercise.name}</option>)}</select></label>
          <div className="grid grid-cols-3 gap-3">
            <label><span className="label">Sets</span><input className="input mt-1" type="number" value={form.sets} onChange={(e) => setForm({ ...form, sets: Number(e.target.value) })} /></label>
            <label><span className="label">Reps</span><input className="input mt-1" type="number" value={form.reps} onChange={(e) => setForm({ ...form, reps: Number(e.target.value) })} /></label>
            <label><span className="label">Seconds</span><input className="input mt-1" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} /></label>
          </div>
        </div>
        <button className="btn-primary mt-5" type="submit"><Plus className="h-4 w-4" />Create routine</button>
      </form>
      <section className="space-y-3">
        {routines.map((routine) => (
          <div className="panel flex items-center justify-between gap-4 p-5" key={routine.id}>
            <Link to={`/routines/${routine.id}`}>
              <h3 className="font-display text-3xl font-bold">{routine.name}</h3>
              <p className="text-sm text-arena-muted">{routine.exercises.length} exercises · {routine.estimatedDurationMinutes} min</p>
            </Link>
            <button className="btn-secondary" onClick={() => void deleteRoutine(routine.id)} aria-label={`Delete ${routine.name}`}><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </section>
    </div>
  );
}
