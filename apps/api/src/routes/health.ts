import { Router } from 'express';
import { API_VERSION, APP_NAME, type HealthResponse } from '@gymrpg/shared';
import { env } from '../config/env.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    appName: APP_NAME,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: API_VERSION
  };

  res.json(response);
});
