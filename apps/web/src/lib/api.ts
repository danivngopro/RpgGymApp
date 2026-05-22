import { HealthResponseSchema, type HealthResponse } from '@gymrpg/shared';

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4001/api';

export const buildHealthUrl = (baseUrl: string) => `${baseUrl.replace(/\/$/, '')}/health`;

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
