import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { publicUser } from "./users.presenter.js";

export const userRouter = Router();

userRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.authUser!.id } });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:username", async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { username: req.params.username } });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});
