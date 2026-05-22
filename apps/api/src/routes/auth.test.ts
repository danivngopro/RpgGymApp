import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { AuthResponseSchema, SafeUserSchema } from '@gymrpg/shared';
import { createApp } from '../app.js';
import { prisma } from '../db/prisma.js';

const app = createApp();

const registerPayload = {
  email: 'hero@example.com',
  username: 'hero_lifter',
  password: 'password123',
  displayName: 'Hero Lifter'
};

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('email/password auth', () => {
  it('registers a user and returns a safe user DTO with a token', async () => {
    const response = await request(app).post('/api/auth/register').send(registerPayload).expect(201);
    const parsed = AuthResponseSchema.parse(response.body);

    expect(parsed.token).toBeTruthy();
    expect(parsed.user.email).toBe(registerPayload.email);
    expect(parsed.user.username).toBe(registerPayload.username);
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it('rejects duplicate email and duplicate username', async () => {
    await request(app).post('/api/auth/register').send(registerPayload).expect(201);

    await request(app)
      .post('/api/auth/register')
      .send({ ...registerPayload, username: 'other_name' })
      .expect(409);

    await request(app)
      .post('/api/auth/register')
      .send({ ...registerPayload, email: 'other@example.com' })
      .expect(409);
  });

  it('logs in with email or username', async () => {
    await request(app).post('/api/auth/register').send(registerPayload).expect(201);

    const emailLogin = await request(app)
      .post('/api/auth/login')
      .send({ emailOrUsername: registerPayload.email, password: registerPayload.password })
      .expect(200);
    expect(AuthResponseSchema.parse(emailLogin.body).user.username).toBe(registerPayload.username);

    const usernameLogin = await request(app)
      .post('/api/auth/login')
      .send({ emailOrUsername: registerPayload.username, password: registerPayload.password })
      .expect(200);
    expect(AuthResponseSchema.parse(usernameLogin.body).user.email).toBe(registerPayload.email);
  });

  it('rejects invalid login passwords', async () => {
    await request(app).post('/api/auth/register').send(registerPayload).expect(201);

    await request(app)
      .post('/api/auth/login')
      .send({ emailOrUsername: registerPayload.email, password: 'wrong-password' })
      .expect(401);
  });

  it('requires a bearer token for /api/users/me', async () => {
    await request(app).get('/api/users/me').expect(401);
  });

  it('returns the current safe user for a valid token', async () => {
    const register = await request(app).post('/api/auth/register').send(registerPayload).expect(201);
    const token = AuthResponseSchema.parse(register.body).token;

    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const user = SafeUserSchema.parse(response.body);
    expect(user.email).toBe(registerPayload.email);
    expect(response.body.passwordHash).toBeUndefined();
  });
});
