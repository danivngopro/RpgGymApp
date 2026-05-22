import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { HealthResponseSchema } from '@gymrpg/shared';
import { createApp } from '../app.js';

describe('GET /api/health', () => {
  it('returns a valid health payload', async () => {
    const app = createApp();

    const response = await request(app).get('/api/health').expect(200);
    const parsed = HealthResponseSchema.parse(response.body);

    expect(parsed.status).toBe('ok');
    expect(parsed.environment).toBeDefined();
  });
});
