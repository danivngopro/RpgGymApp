import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

type Exercise = { id: string; name: string; muscleGroups: string[]; equipment: string; difficulty: string; instructions: string };

export function ExerciseCatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const params = new URLSearchParams();
    if (deferredSearch) params.set("search", deferredSearch);
    if (difficulty) params.set("difficulty", difficulty);
    void api<{ exercises: Exercise[] }>(`/exercises?${params}`).then((data) => setExercises(data.exercises));
  }, [deferredSearch, difficulty]);

  const muscles = useMemo(() => Array.from(new Set(exercises.flatMap((exercise) => exercise.muscleGroups))).slice(0, 8), [exercises]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-5xl font-bold">Exercise Catalog</h2>
          <p className="text-arena-muted">Seeded movements with equipment, muscles, difficulty, and instructions.</p>
        </div>
        <div className="flex w-full gap-3 md:w-auto">
          <label className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-arena-muted" />
            <input className="input pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search exercises" />
          </label>
          <select className="input w-44" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">{muscles.map((muscle) => <span className="rounded-md bg-arena-panel px-3 py-1 text-sm text-arena-muted" key={muscle}>{muscle}</span>)}</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exercises.map((exercise) => (
          <Link className="panel p-5 transition-colors hover:border-arena-orange" to={`/exercises/${exercise.id}`} key={exercise.id}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <h3 className="font-display text-3xl font-bold">{exercise.name}</h3>
              <span className="rounded-md bg-arena-bg px-2 py-1 text-xs uppercase text-arena-amber">{exercise.difficulty}</span>
            </div>
            <p className="text-sm text-arena-muted">{exercise.equipment}</p>
            <p className="mt-3 line-clamp-3 text-sm text-arena-text">{exercise.instructions}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
