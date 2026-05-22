import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { AuthLayout } from './AuthLayout';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authStatus, loginUser } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  if (authStatus === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await loginUser({ emailOrUsername, password });
      navigate(from, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Use your email or username to return to your training profile."
      footer={
        <>
          New to GymRPG?{' '}
          <Link className="font-medium text-orange-300 hover:text-orange-200" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Email or username</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20"
            value={emailOrUsername}
            onChange={(event) => setEmailOrUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Password</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? (
          <div className="rounded-md border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
}
