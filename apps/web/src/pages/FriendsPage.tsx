import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Friend = { username: string; level: number; title: string; currentStreak: number };
type Entry = { user: Friend; weeklyExp: number; totalExp: number; level: number; streak: number };

export function FriendsPage() {
  const [identifier, setIdentifier] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [rankBy, setRankBy] = useState("weeklyExp");

  async function load() {
    const [friendData, leaderboardData] = await Promise.all([
      api<{ friends: Friend[] }>("/friends"),
      api<{ entries: Entry[] }>(`/leaderboard/friends?rankBy=${rankBy}`)
    ]);
    setFriends(friendData.friends);
    setEntries(leaderboardData.entries);
  }

  useEffect(() => {
    void load();
  }, [rankBy]);

  async function sendRequest(event: React.FormEvent) {
    event.preventDefault();
    await api("/friends/requests", { method: "POST", body: JSON.stringify({ identifier }) });
    setIdentifier("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="panel p-5">
        <h2 className="font-display text-4xl font-bold">Friends</h2>
        <form className="mt-5 flex gap-2" onSubmit={sendRequest}>
          <input className="input" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Username or email" />
          <button className="btn-primary" type="submit" aria-label="Send friend request"><Send className="h-4 w-4" /></button>
        </form>
        <div className="mt-5 space-y-2">
          {friends.map((friend) => <p className="rounded-md bg-arena-panel2 p-3" key={friend.username}>{friend.username} · Level {friend.level}</p>)}
          {friends.length === 0 && <p className="text-arena-muted">No friends yet.</p>}
        </div>
      </section>
      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-4xl font-bold">Leaderboard</h2>
          <select className="input w-48" value={rankBy} onChange={(event) => setRankBy(event.target.value)}>
            <option value="weeklyExp">Weekly EXP</option>
            <option value="totalExp">Total EXP</option>
            <option value="level">Level</option>
            <option value="streak">Streak</option>
          </select>
        </div>
        <div className="mt-5 space-y-2">
          {entries.map((entry, index) => (
            <div className="grid grid-cols-[3rem_1fr_auto] items-center rounded-md bg-arena-panel2 p-3" key={entry.user.username}>
              <span className="font-display text-2xl font-bold text-arena-orange">#{index + 1}</span>
              <span>{entry.user.username}<span className="ml-2 text-sm text-arena-muted">{entry.user.title}</span></span>
              <span className="font-semibold">{entry[rankBy as keyof Entry] as number}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
