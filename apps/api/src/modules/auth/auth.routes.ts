import { Router } from "express";
import passport from "passport";
import argon2 from "argon2";
import { loginSchema, registerSchema } from "@rpg-gym/shared";
import { prisma } from "../../lib/prisma.js";
import { signAuthToken } from "../../lib/jwt.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { AppError } from "../../middleware/errors.js";
import { publicUser } from "../users/users.presenter.js";
import { config } from "../../config.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: req.body.email }, { username: req.body.username }] }
    });
    if (existing) throw new AppError(409, "Email or username is already registered");

    const passwordHash = await argon2.hash(req.body.password);
    const user = await prisma.user.create({
      data: { email: req.body.email, username: req.body.username, passwordHash }
    });

    res.status(201).json({ token: signAuthToken({ sub: user.id, email: user.email }), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, req.body.password))) {
      throw new AppError(401, "Invalid email or password");
    }

    res.json({ token: signAuthToken({ sub: user.id, email: user.email }), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.authUser!.id } });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  const user = req.user as { id: string; email: string };
  const token = signAuthToken({ sub: user.id, email: user.email });
  res.redirect(`${config.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}`);
});
