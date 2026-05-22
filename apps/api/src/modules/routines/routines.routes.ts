import { Router } from "express";
import { routineSchema } from "@rpg-gym/shared";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { AppError } from "../../middleware/errors.js";

export const routineRouter = Router();
routineRouter.use(requireAuth);

const includeRoutine = {
  exercises: {
    orderBy: { order: "asc" as const },
    include: { exercise: true }
  }
};

routineRouter.get("/", async (req, res, next) => {
  try {
    const routines = await prisma.routine.findMany({
      where: { userId: req.authUser!.id },
      include: includeRoutine,
      orderBy: { updatedAt: "desc" }
    });
    res.json({ routines });
  } catch (error) {
    next(error);
  }
});

routineRouter.post("/", validateBody(routineSchema), async (req, res, next) => {
  try {
    const routine = await prisma.routine.create({
      data: {
        userId: req.authUser!.id,
        name: req.body.name,
        description: req.body.description,
        targetMuscleGroups: req.body.targetMuscleGroups,
        estimatedDurationMinutes: req.body.estimatedDurationMinutes,
        weeklySchedule: req.body.weeklySchedule,
        exercises: { create: req.body.exercises }
      },
      include: includeRoutine
    });
    res.status(201).json({ routine });
  } catch (error) {
    next(error);
  }
});

routineRouter.get("/:id", async (req, res, next) => {
  try {
    const routine = await prisma.routine.findFirstOrThrow({
      where: { id: req.params.id, userId: req.authUser!.id },
      include: includeRoutine
    });
    res.json({ routine });
  } catch (error) {
    next(error);
  }
});

routineRouter.put("/:id", validateBody(routineSchema), async (req, res, next) => {
  try {
    const existing = await prisma.routine.findFirst({ where: { id: req.params.id, userId: req.authUser!.id } });
    if (!existing) throw new AppError(404, "Routine not found");

    const routine = await prisma.$transaction(async (tx) => {
      await tx.routineExercise.deleteMany({ where: { routineId: req.params.id } });
      return tx.routine.update({
        where: { id: req.params.id },
        data: {
          name: req.body.name,
          description: req.body.description,
          targetMuscleGroups: req.body.targetMuscleGroups,
          estimatedDurationMinutes: req.body.estimatedDurationMinutes,
          weeklySchedule: req.body.weeklySchedule,
          exercises: { create: req.body.exercises }
        },
        include: includeRoutine
      });
    });
    res.json({ routine });
  } catch (error) {
    next(error);
  }
});

routineRouter.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.routine.findFirst({ where: { id: req.params.id, userId: req.authUser!.id } });
    if (!existing) throw new AppError(404, "Routine not found");
    await prisma.routine.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
