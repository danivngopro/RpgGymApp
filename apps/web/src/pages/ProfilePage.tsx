import { ProgressBar } from "../components/ProgressBar";
import { useAuth } from "../lib/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();
  const stats = [
    ["Strength", "Earned by resistance training"],
    ["Endurance", "Earned by longer sessions"],
    ["Discipline", "Earned by completing planned work"],
    ["Consistency", "Earned by streaks"]
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="panel p-6">
        <div className="grid h-24 w-24 place-items-center rounded-lg bg-arena-orange font-display text-5xl font-bold">{user?.username.slice(0, 1).toUpperCase()}</div>
        <h2 className="mt-5 font-display text-5xl font-bold">{user?.username}</h2>
        <p className="text-arena-muted">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</p>
        <div className="mt-6">
          <p className="mb-2 text-sm text-arena-muted">Level {user?.level} progress</p>
          <ProgressBar value={user?.progression.expIntoLevel ?? 0} max={user?.progression.expForNextLevel ?? 1} />
        </div>
      </section>
      <section className="panel p-6">
        <h3 className="font-display text-4xl font-bold">Cosmetic Stats</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {stats.map(([name, detail]) => (
            <div className="rounded-md bg-arena-panel2 p-4" key={name}>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-arena-muted">{detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
