import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const expiresIn = '7d';

export type AuthTokenPayload = {
  sub: string;
};

export const signAuthToken = (userId: string) =>
  jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn
  });

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === 'string' || !decoded.sub) {
    throw new Error('Invalid token payload');
  }

  return {
    sub: decoded.sub
  };
};
