import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute() {
  const { authStatus } = useAuth();
  const location = useLocation();

  if (authStatus === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-4 text-sm text-slate-300">
          Checking session...
        </div>
      </main>
    );
  }

  if (authStatus === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
