import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyAuthToken } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        email: string;
      };
    }
  }
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    res.status(401).json({ error: "Missing auth token" });
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true } });
    if (!user) {
      res.status(401).json({ error: "Invalid auth token" });
      return;
    }
    req.authUser = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid auth token" });
  }
};
