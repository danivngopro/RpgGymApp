import { Dumbbell, LayoutDashboard, ListChecks, LogOut, Medal, Trophy, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/exercises", label: "Exercises", icon: Dumbbell },
  { to: "/routines", label: "Routines", icon: ListChecks },
  { to: "/profile", label: "Progression", icon: Medal },
  { to: "/friends", label: "Friends", icon: Users }
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-arena-bg">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-arena-line bg-arena-panel px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-arena-orange">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold leading-none">RPG Gym</p>
            <p className="text-xs uppercase tracking-wide text-arena-muted">Level through training</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "bg-arena-orange text-white" : "text-arena-muted hover:bg-arena-panel2 hover:text-white"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-arena-line bg-arena-bg/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-arena-muted">Current rank</p>
              <h1 className="font-display text-3xl font-bold">{user?.title ?? "Novice"} · Level {user?.level ?? 1}</h1>
            </div>
            <button className="btn-secondary" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="btn-secondary whitespace-nowrap px-3 py-1.5">
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
