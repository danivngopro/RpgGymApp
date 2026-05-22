import { zodResolver } from "@hookform/resolvers/zod";
import { Dumbbell } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { loginSchema, registerSchema } from "@rpg-gym/shared";
import { useAuth } from "../lib/AuthContext";
import { API_URL } from "../lib/api";

export function AuthPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const schema = mode === "login" ? loginSchema : registerSchema;
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", username: "", password: "" } });

  if (user) return <Navigate to="/" replace />;

  async function submit(values: { email: string; username?: string; password: string }) {
    setError("");
    try {
      if (mode === "login") await login(values.email, values.password);
      else await register(values.email, values.username ?? "", values.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  return (
    <main className="grid min-h-screen bg-arena-bg lg:grid-cols-[1.1fr_0.9fr]">
      <section className="flex flex-col justify-between border-r border-arena-line p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-arena-orange">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="font-display text-3xl font-bold">RPG Gym</span>
        </div>
        <div className="max-w-2xl py-16">
          <h1 className="font-display text-6xl font-bold leading-none md:text-7xl">Track the workout. Level the character.</h1>
          <p className="mt-5 max-w-xl text-lg text-arena-muted">
            Build routines, execute sets, earn EXP, unlock ranks, and compete with friends through a focused training dashboard.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-arena-muted md:grid-cols-3">
          <span>EXP multipliers</span>
          <span>Friend rankings</span>
          <span>Progression rewards</span>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <form className="panel w-full max-w-md p-6" onSubmit={form.handleSubmit(submit)}>
          <h2 className="font-display text-4xl font-bold">{mode === "login" ? "Enter Arena" : "Create Hero"}</h2>
          <p className="mb-6 text-arena-muted">Email/password works now. Google OAuth activates when credentials are configured.</p>
          <div className="space-y-4">
            <label className="block">
              <span className="label">Email</span>
              <input className="input mt-1" type="email" {...form.register("email")} />
            </label>
            {mode === "register" && (
              <label className="block">
                <span className="label">Username</span>
                <input className="input mt-1" {...form.register("username")} />
              </label>
            )}
            <label className="block">
              <span className="label">Password</span>
              <input className="input mt-1" type="password" {...form.register("password")} />
            </label>
          </div>
          {error && <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <button className="btn-primary mt-6 w-full" type="submit">{mode === "login" ? "Login" : "Register"}</button>
          <a className="btn-secondary mt-3 w-full" href={`${API_URL}/auth/google`}>Continue with Google</a>
          <button className="mt-4 text-sm font-semibold text-arena-amber" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Need an account?" : "Already have an account?"}
          </button>
        </form>
      </section>
    </main>
  );
}
