import { describe, expect, it } from 'vitest';
import {
  APP_NAME,
  API_VERSION,
  AuthResponseSchema,
  HealthResponseSchema,
  RegisterRequestSchema
} from './index.js';

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

describe('auth schemas', () => {
  it('validates register requests and safe auth responses', () => {
    const register = RegisterRequestSchema.parse({
      email: 'lifter@example.com',
      username: 'lifter_1',
      password: 'strong-password',
      displayName: 'Iron Lifter'
    });

    expect(register.username).toBe('lifter_1');

    const auth = AuthResponseSchema.parse({
      token: 'jwt-token',
      user: {
        id: 'user-id',
        email: 'lifter@example.com',
        username: 'lifter_1',
        displayName: 'Iron Lifter',
        avatarUrl: null,
        level: 1,
        totalExp: 0,
        currentStreak: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });

    expect(auth.user.level).toBe(1);
  });
});
