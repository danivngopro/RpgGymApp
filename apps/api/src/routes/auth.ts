import argon2 from 'argon2';
import { Router } from 'express';
import { LoginRequestSchema, RegisterRequestSchema } from '@gymrpg/shared';
import { prisma } from '../db/prisma.js';
import { ApiError } from '../http/api-error.js';
import { signAuthToken } from '../auth/jwt.js';
import { toSafeUser } from '../users/dto.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const input = RegisterRequestSchema.parse(req.body);
    const email = input.email.toLowerCase();
    const username = input.username;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      },
      select: {
        email: true,
        username: true
      }
    });

    if (existingUser?.email === email) {
      throw new ApiError(409, 'Email is already registered');
    }

    if (existingUser?.username === username) {
      throw new ApiError(409, 'Username is already taken');
    }

    const passwordHash = await argon2.hash(input.password);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        displayName: input.displayName
      }
    });

    res.status(201).json({
      token: signAuthToken(user.id),
      user: toSafeUser(user)
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const input = LoginRequestSchema.parse(req.body);
    const identifier = input.emailOrUsername.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: input.emailOrUsername }]
      }
    });

    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, input.password);

    if (!passwordMatches) {
      throw new ApiError(401, 'Invalid credentials');
    }

    res.json({
      token: signAuthToken(user.id),
      user: toSafeUser(user)
    });
  } catch (error) {
    next(error);
  }
});
