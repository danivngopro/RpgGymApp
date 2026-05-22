export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");
const TOKEN_KEY = "rpg_gym_token";

export type ApiUser = {
  id: string;
  username: string;
  avatarUrl?: string | null;
  level: number;
  totalExp: number;
  currentStreak: number;
  title: string;
  createdAt: string;
  progression: { level: number; expIntoLevel: number; expForNextLevel: number };
};

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error(`API unavailable at ${API_URL}. Start the API dev server on http://localhost:4000 and verify VITE_API_URL.`);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(body.error ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
