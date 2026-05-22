import { useCallback, useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { APP_NAME, type HealthResponse } from '@gymrpg/shared';
import { apiBaseUrl, fetchHealth } from './lib/api';

type ConnectionState = 'checking' | 'connected' | 'disconnected';

function HomePage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('checking');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setConnectionState('checking');
    setErrorMessage(null);

    try {
      const result = await fetchHealth();
      setHealth(result);
      setConnectionState('connected');
    } catch (error) {
      setHealth(null);
      setConnectionState('disconnected');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to reach API');
    }
  }, []);

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  const isConnected = connectionState === 'connected';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1 text-sm text-orange-100">
              Phase 1 foundation
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold tracking-normal text-white sm:text-5xl">
                {APP_NAME}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                RPG fitness app foundation with a React web client connected to a TypeScript Express API.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2">React + Vite</span>
              <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2">Express API</span>
              <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2">Shared schemas</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">API status</h2>
                <p className="mt-1 text-sm text-slate-400">Connectivity check for Phase 1.</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  isConnected
                    ? 'bg-emerald-400/15 text-emerald-200'
                    : connectionState === 'checking'
                      ? 'bg-amber-400/15 text-amber-200'
                      : 'bg-rose-400/15 text-rose-200'
                }`}
              >
                {connectionState}
              </span>
            </div>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-slate-500">API URL</dt>
                <dd className="mt-1 break-all rounded-md bg-slate-950 px-3 py-2 font-mono text-slate-200">
                  {apiBaseUrl}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Health response</dt>
                <dd className="mt-1 rounded-md bg-slate-950 px-3 py-2 text-slate-200">
                  {health ? `${health.status} from ${health.appName} ${health.version}` : 'No response yet'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Environment</dt>
                <dd className="mt-1 text-slate-200">{health?.environment ?? 'unknown'}</dd>
              </div>
              {errorMessage ? (
                <div>
                  <dt className="text-slate-500">Error</dt>
                  <dd className="mt-1 text-rose-200">{errorMessage}</dd>
                </div>
              ) : null}
            </dl>

            <button
              type="button"
              onClick={() => void checkHealth()}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-wait disabled:opacity-70"
              disabled={connectionState === 'checking'}
            >
              {connectionState === 'checking' ? 'Checking...' : 'Retry health check'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="*"
        element={
          <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold">Page not found</h1>
              <Link className="text-orange-300 underline-offset-4 hover:underline" to="/">
                Return to status page
              </Link>
            </div>
          </main>
        }
      />
    </Routes>
  );
}
