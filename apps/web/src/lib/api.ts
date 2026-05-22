import {
  AuthResponseSchema,
  HealthResponseSchema,
  SafeUserSchema,
  type AuthResponse,
  type HealthResponse,
  type LoginRequest,
  type RegisterRequest,
  type SafeUser
} from '@gymrpg/shared';

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4001/api';

const buildApiUrl = (baseUrl: string, path: string) => `${baseUrl.replace(/\/$/, '')}${path}`;

export const buildHealthUrl = (baseUrl: string) => buildApiUrl(baseUrl, '/health');

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

const parseApiError = async (response: Response) => {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.error?.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const requestJson = async <T>(
  path: string,
  schema: { parse: (value: unknown) => T },
  options: RequestInit = {}
) => {
  const response = await fetch(buildApiUrl(apiBaseUrl, path), {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return schema.parse(await response.json());
};

export const fetchHealth = async (baseUrl = apiBaseUrl): Promise<HealthResponse> => {
  const response = await fetch(buildHealthUrl(baseUrl), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return HealthResponseSchema.parse(await response.json());
};

export const register = (input: RegisterRequest): Promise<AuthResponse> =>
  requestJson('/auth/register', AuthResponseSchema, {
    method: 'POST',
    body: JSON.stringify(input)
  });

export const login = (input: LoginRequest): Promise<AuthResponse> =>
  requestJson('/auth/login', AuthResponseSchema, {
    method: 'POST',
    body: JSON.stringify(input)
  });

export const fetchCurrentUser = (token: string): Promise<SafeUser> =>
  requestJson('/users/me', SafeUserSchema, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
