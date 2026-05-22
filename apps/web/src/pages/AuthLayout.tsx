import { Link } from 'react-router-dom';
import { APP_NAME } from '@gymrpg/shared';

export function AuthLayout({
  title,
  subtitle,
  children,
  footer
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-7">
          <Link to="/" className="inline-flex text-2xl font-bold text-white">
            {APP_NAME}
          </Link>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-bold tracking-normal text-white sm:text-5xl">
              Train like a hero. Track like an athlete.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-slate-300">
              Phase 2 adds secure email/password access while keeping the app foundation small and testable.
            </p>
          </div>
          <div className="grid max-w-lg grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="text-2xl font-bold text-emerald-300">1</div>
              <div className="mt-1 text-slate-400">Starter level</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="text-2xl font-bold text-orange-300">0</div>
              <div className="mt-1 text-slate-400">EXP today</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="text-2xl font-bold text-sky-300">API</div>
              <div className="mt-1 text-slate-400">Connected</div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/50">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
          </div>
          {children}
          <div className="mt-6 border-t border-slate-800 pt-5 text-center text-sm text-slate-400">
            {footer}
          </div>
        </div>
      </section>
    </main>
  );
}
