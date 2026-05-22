import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";
import passport from "passport";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middleware/errors.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { exerciseRouter } from "./modules/exercises/exercises.routes.js";
import { routineRouter } from "./modules/routines/routines.routes.js";
import { workoutRouter } from "./modules/workouts/workouts.routes.js";
import { friendsRouter } from "./modules/friends/friends.routes.js";
import { leaderboardRouter } from "./modules/leaderboard/leaderboard.routes.js";
import { userRouter } from "./modules/users/users.routes.js";
import "./modules/auth/google.strategy.js";

export function createApp() {
  const app = express();
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });

  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(pinoHttp({ logger }));
  app.use(passport.initialize());

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/exercises", exerciseRouter);
  app.use("/api/routines", routineRouter);
  app.use("/api/workouts", workoutRouter);
  app.use("/api/friends", friendsRouter);
  app.use("/api/leaderboard", leaderboardRouter);
  app.use(errorHandler);

  return app;
}
