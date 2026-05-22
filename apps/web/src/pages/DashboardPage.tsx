import { CalendarDays, Dumbbell, Flame, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/api";
import { useAuth } from "../lib/AuthContext";

type Routine = { id: string; name: string; estimatedDurationMinutes: number; weeklySchedule: string[]; exercises: unknown[] };
type Workout = { id: string; expAwarded: number; completedAt: string; routine: { name: string } };
type Leader = { user: { username: string; level: number; title: string }; weeklyExp: number };

export function DashboardPage() {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    void Promise.all([
      api<{ routines: Routine[] }>("/routines").then((data) => setRoutines(data.routines)),
      api<{ workouts: Workout[] }>("/workouts/history").then((data) => setWorkouts(data.workouts)),
      api<{ entries: Leader[] }>("/leaderboard/friends").then((data) => setLeaders(data.entries.slice(0, 5)))
    ]);
  }, []);

  const progress = user?.progression;
  const nextRoutine = routines.find((routine) => routine.weeklySchedule.length) ?? routines[0];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-arena-muted">Welcome back, {user?.username}</p>
              <h2 className="font-display text-5xl font-bold">Level {user?.level} {user?.title}</h2>
            </div>
            <Trophy className="h-10 w-10 text-arena-orange" />
          </div>
          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm text-arena-muted">
              <span>{progress?.expIntoLevel ?? 0} EXP</span>
              <span>{progress?.expForNextLevel ?? 0} to next level</span>
            </div>
            <ProgressBar value={progress?.expIntoLevel ?? 0} max={progress?.expForNextLevel ?? 1} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <Metric icon={Flame} label="Total EXP" value={user?.totalExp ?? 0} />
          <Metric icon={CalendarDays} label="Streak" value={`${user?.currentStreak ?? 0} days`} />
          <Metric icon={Dumbbell} label="Routines" value={routines.length} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-3xl font-bold">Routines</h3>
            <Link className="btn-secondary" to="/routines">Manage</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {routines.slice(0, 4).map((routine) => (
              <Link className="rounded-md border border-arena-line bg-arena-panel2 p-4 transition-colors hover:border-arena-orange" to={`/routines/${routine.id}`} key={routine.id}>
                <h4 className="font-semibold">{routine.name}</h4>
                <p className="text-sm text-arena-muted">{routine.exercises.length} exercises · {routine.estimatedDurationMinutes} min</p>
              </Link>
            ))}
            {routines.length === 0 && <p className="text-arena-muted">Create your first routine to start gaining EXP.</p>}
          </div>
        </div>
        <div className="panel p-5">
          <h3 className="font-display text-3xl font-bold">Next Session</h3>
          {nextRoutine ? (
            <div className="mt-4">
              <p className="text-xl font-semibold">{nextRoutine.name}</p>
              <p className="text-arena-muted">{nextRoutine.estimatedDurationMinutes} min planned</p>
              <Link className="btn-primary mt-5" to={`/routines/${nextRoutine.id}`}>Start Workout</Link>
            </div>
          ) : <p className="mt-3 text-arena-muted">No scheduled routines yet.</p>}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <PanelList title="Recent Workouts" items={workouts.map((workout) => `${workout.routine.name} · ${workout.expAwarded} EXP`)} empty="No completed workouts yet." />
        <PanelList title="Leaderboard Preview" items={leaders.map((entry, index) => `#${index + 1} ${entry.user.username} · ${entry.weeklyExp} weekly EXP`)} empty="Add friends to compare progress." />
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string | number }) {
  return (
    <div className="panel p-4">
      <Icon className="mb-4 h-6 w-6 text-arena-green" />
      <p className="text-sm text-arena-muted">{label}</p>
      <p className="font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function PanelList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="panel p-5">
      <h3 className="font-display text-3xl font-bold">{title}</h3>
      <div className="mt-4 space-y-2">
        {items.map((item) => <p className="rounded-md bg-arena-panel2 p-3" key={item}>{item}</p>)}
        {items.length === 0 && <p className="text-arena-muted">{empty}</p>}
      </div>
    </div>
  );
}
