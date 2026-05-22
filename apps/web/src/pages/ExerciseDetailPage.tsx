import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";

type Exercise = { name: string; muscleGroups: string[]; equipment: string; difficulty: string; instructions: string; mediaUrl?: string | null };

export function ExerciseDetailPage() {
  const { id } = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (id) void api<{ exercise: Exercise }>(`/exercises/${id}`).then((data) => setExercise(data.exercise));
  }, [id]);

  if (!exercise) return <p className="text-arena-muted">Loading exercise...</p>;

  return (
    <div className="max-w-4xl space-y-5">
      <Link className="btn-secondary" to="/exercises"><ArrowLeft className="h-4 w-4" />Back</Link>
      <section className="panel p-6">
        <h2 className="font-display text-6xl font-bold">{exercise.name}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[exercise.difficulty, exercise.equipment, ...exercise.muscleGroups].map((item) => <span className="rounded-md bg-arena-bg px-3 py-1 text-sm text-arena-muted" key={item}>{item}</span>)}
        </div>
        {exercise.mediaUrl && <img className="mt-6 aspect-video w-full rounded-md object-cover" src={exercise.mediaUrl} alt={exercise.name} />}
        <h3 className="mt-8 font-display text-3xl font-bold">How to perform</h3>
        <p className="mt-2 leading-7 text-arena-text">{exercise.instructions}</p>
      </section>
    </div>
  );
}
