import type { RequestHandler } from 'express';
import { ApiError } from '../http/api-error.js';
import { verifyAuthToken } from './jwt.js';

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header('authorization');

  if (!header?.startsWith('Bearer ')) {
    next(new ApiError(401, 'Missing bearer token'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAuthToken(token);
    res.locals.userId = payload.sub;
    next();
  } catch {
    next(new ApiError(401, 'Invalid bearer token'));
  }
};
