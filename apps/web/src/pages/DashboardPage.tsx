import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl, fetchHealth } from '../lib/api';
import { useAuth } from '../auth/AuthContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, authStatus } = useAuth();
  const [apiStatus, setApiStatus] = useState<'idle' | 'checking' | 'connected' | 'disconnected'>('idle');

  const checkApi = async () => {
    setApiStatus('checking');

    try {
      await fetchHealth();
      setApiStatus('connected');
    } catch {
      setApiStatus('disconnected');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-300">Authenticated dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              {user?.displayName || user?.username || 'GymRPG athlete'}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-fit rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-orange-300 hover:text-orange-200"
          >
            Logout
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Level</p>
            <p className="mt-2 text-4xl font-bold text-emerald-300">{user?.level ?? 1}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total EXP</p>
            <p className="mt-2 text-4xl font-bold text-orange-300">{user?.totalExp ?? 0}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Current streak</p>
            <p className="mt-2 text-4xl font-bold text-sky-300">{user?.currentStreak ?? 0}</p>
          </div>
        </div>

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">API/auth status</h2>
              <p className="mt-1 break-all text-sm text-slate-400">{apiBaseUrl}</p>
            </div>
            <span className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-200">
              {authStatus}
            </span>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => void checkApi()}
              disabled={apiStatus === 'checking'}
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-70"
            >
              {apiStatus === 'checking' ? 'Checking...' : 'Check API'}
            </button>
            <p className="text-sm text-slate-300">
              {apiStatus === 'idle' ? 'Ready to verify the health endpoint.' : `API is ${apiStatus}.`}
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
