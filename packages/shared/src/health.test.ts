import { describe, expect, it } from 'vitest';
import { APP_NAME, API_VERSION, HealthResponseSchema } from './index.js';

describe('HealthResponseSchema', () => {
  it('accepts the Phase 1 API health response shape', () => {
    const response = HealthResponseSchema.parse({
      status: 'ok',
      appName: APP_NAME,
      environment: 'test',
      timestamp: new Date().toISOString(),
      version: API_VERSION
    });

    expect(response.status).toBe('ok');
    expect(response.appName).toBe('GymRPG');
  });
});
