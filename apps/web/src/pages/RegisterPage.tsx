import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { AuthLayout } from './AuthLayout';

export function RegisterPage() {
  const navigate = useNavigate();
  const { authStatus, registerUser } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authStatus === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await registerUser({
        email,
        username,
        password,
        displayName: displayName || undefined
      });
      navigate('/dashboard', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start with a secure profile. Workouts and progression arrive in the next phases."
      footer={
        <>
          Already have an account?{' '}
          <Link className="font-medium text-orange-300 hover:text-orange-200" to="/login">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Email</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Username</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            minLength={3}
            pattern="[A-Za-z0-9_]+"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Display name</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Password</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="new-password"
            minLength={8}
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
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
