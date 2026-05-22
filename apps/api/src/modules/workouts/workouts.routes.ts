import { Router } from "express";
import { z } from "zod";
import { completeWorkoutSchema } from "@rpg-gym/shared";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { AppError } from "../../middleware/errors.js";
import { completeWorkout } from "./workouts.service.js";

export const workoutRouter = Router();
workoutRouter.use(requireAuth);

workoutRouter.post("/start", validateBody(z.object({ routineId: z.string().cuid() })), async (req, res, next) => {
  try {
    const routine = await prisma.routine.findFirst({ where: { id: req.body.routineId, userId: req.authUser!.id } });
    if (!routine) throw new AppError(404, "Routine not found");

    const workout = await prisma.workoutSession.create({
      data: { userId: req.authUser!.id, routineId: routine.id },
      include: { routine: { include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } } } }
    });
    res.status(201).json({ workout });
  } catch (error) {
    next(error);
  }
});

workoutRouter.post("/:id/complete", validateBody(completeWorkoutSchema), async (req, res, next) => {
  try {
    res.json(await completeWorkout(req.authUser!.id, req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

workoutRouter.get("/history", async (req, res, next) => {
  try {
    const workouts = await prisma.workoutSession.findMany({
      where: { userId: req.authUser!.id, status: "completed" },
      include: { routine: true, completedExercises: true },
      orderBy: { completedAt: "desc" },
      take: 20
    });
    res.json({ workouts });
  } catch (error) {
    next(error);
  }
});

workoutRouter.get("/:id", async (req, res, next) => {
  try {
    const workout = await prisma.workoutSession.findFirstOrThrow({
      where: { id: req.params.id, userId: req.authUser!.id },
      include: {
        routine: {
          include: {
            exercises: {
              include: { exercise: true },
              orderBy: { order: "asc" }
            }
          }
        }
      }
    });
    res.json({ workout });
  } catch (error) {
    next(error);
  }
});
