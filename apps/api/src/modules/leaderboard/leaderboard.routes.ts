import { Router } from "express";
import { leaderboardQuerySchema } from "@rpg-gym/shared";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateQuery } from "../../middleware/validate.js";
import { publicUser } from "../users/users.presenter.js";

export const leaderboardRouter = Router();
leaderboardRouter.use(requireAuth);

leaderboardRouter.get("/friends", validateQuery(leaderboardQuerySchema), async (req, res, next) => {
  try {
    const rankBy = (req.query.rankBy as string | undefined) ?? "weeklyExp";
    const accepted = await prisma.friendRequest.findMany({
      where: { status: "accepted", OR: [{ senderId: req.authUser!.id }, { receiverId: req.authUser!.id }] }
    });
    const friendIds = accepted.map((request) => request.senderId === req.authUser!.id ? request.receiverId : request.senderId);
    const userIds = [req.authUser!.id, ...friendIds];

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
    const weekly = await prisma.workoutSession.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds }, status: "completed", completedAt: { gte: weekStart } },
      _sum: { expAwarded: true }
    });
    const weeklyByUser = new Map(weekly.map((entry) => [entry.userId, entry._sum.expAwarded ?? 0]));

    const entries = users
      .map((user) => ({
        user: publicUser(user),
        weeklyExp: weeklyByUser.get(user.id) ?? 0,
        totalExp: user.totalExp,
        level: user.level,
        streak: user.currentStreak
      }))
      .sort((a, b) => Number(b[rankBy as keyof typeof b]) - Number(a[rankBy as keyof typeof a]));

    res.json({ entries });
  } catch (error) {
    next(error);
  }
});
