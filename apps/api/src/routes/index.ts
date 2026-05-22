import { Router } from 'express';
import { authRouter } from './auth.js';
import { healthRouter } from './health.js';
import { usersRouter } from './users.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/health', healthRouter);
apiRouter.use('/users', usersRouter);
