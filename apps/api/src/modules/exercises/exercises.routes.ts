import { Router } from "express";
import { exerciseQuerySchema } from "@rpg-gym/shared";
import { prisma } from "../../lib/prisma.js";
import { validateQuery } from "../../middleware/validate.js";

export const exerciseRouter = Router();

exerciseRouter.get("/", validateQuery(exerciseQuerySchema), async (req, res, next) => {
  try {
    const { search, muscle, equipment, difficulty } = req.query as Record<string, string | undefined>;
    const exercises = await prisma.exercise.findMany({
      where: {
        difficulty: difficulty as never,
        equipment: equipment ? { contains: equipment, mode: "insensitive" } : undefined,
        muscleGroups: muscle ? { has: muscle } : undefined,
        OR: search
          ? [
              { name: { contains: search, mode: "insensitive" } },
              { instructions: { contains: search, mode: "insensitive" } }
            ]
          : undefined
      },
      orderBy: { name: "asc" }
    });
    res.json({ exercises });
  } catch (error) {
    next(error);
  }
});

exerciseRouter.get("/:id", async (req, res, next) => {
  try {
    const exercise = await prisma.exercise.findUniqueOrThrow({ where: { id: req.params.id } });
    res.json({ exercise });
  } catch (error) {
    next(error);
  }
});
