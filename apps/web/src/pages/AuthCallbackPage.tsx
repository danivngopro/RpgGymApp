import { useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../lib/api";
import { useAuth } from "../lib/AuthContext";

export function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const token = params.get("token");

  useEffect(() => {
    if (!token) return;
    async function completeLogin() {
      setToken(token!);
      await refresh();
      navigate("/", { replace: true });
    }
    void completeLogin();
  }, [navigate, refresh, token]);

  if (!token) return <Navigate to="/auth" replace />;

  return <div className="p-8 text-arena-muted">Completing Google login...</div>;
}
