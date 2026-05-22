import { Router } from 'express';
import { requireAuth } from '../auth/middleware.js';
import { prisma } from '../db/prisma.js';
import { ApiError } from '../http/api-error.js';
import { toSafeUser } from '../users/dto.js';

export const usersRouter = Router();

usersRouter.get('/me', requireAuth, async (_req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: res.locals.userId
      }
    });

    if (!user) {
      throw new ApiError(401, 'Invalid bearer token');
    }

    res.json(toSafeUser(user));
  } catch (error) {
    next(error);
  }
});
