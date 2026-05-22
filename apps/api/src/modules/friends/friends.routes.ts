import { Router } from "express";
import { friendRequestSchema } from "@rpg-gym/shared";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { AppError } from "../../middleware/errors.js";
import { publicUser } from "../users/users.presenter.js";

export const friendsRouter = Router();
friendsRouter.use(requireAuth);

friendsRouter.post("/requests", validateBody(friendRequestSchema), async (req, res, next) => {
  try {
    const receiver = await prisma.user.findFirst({
      where: {
        OR: [{ email: req.body.identifier.toLowerCase() }, { username: req.body.identifier }]
      }
    });
    if (!receiver || receiver.id === req.authUser!.id) throw new AppError(404, "User not found");

    const request = await prisma.friendRequest.create({
      data: { senderId: req.authUser!.id, receiverId: receiver.id },
      include: { receiver: true }
    });
    res.status(201).json({ request: { id: request.id, status: request.status, receiver: publicUser(request.receiver) } });
  } catch (error) {
    next(error);
  }
});

friendsRouter.post("/requests/:id/accept", async (req, res, next) => {
  try {
    const request = await prisma.friendRequest.update({
      where: { id: req.params.id, receiverId: req.authUser!.id },
      data: { status: "accepted" }
    });
    res.json({ request });
  } catch (error) {
    next(error);
  }
});

friendsRouter.post("/requests/:id/reject", async (req, res, next) => {
  try {
    const request = await prisma.friendRequest.update({
      where: { id: req.params.id, receiverId: req.authUser!.id },
      data: { status: "rejected" }
    });
    res.json({ request });
  } catch (error) {
    next(error);
  }
});

friendsRouter.get("/", async (req, res, next) => {
  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        status: "accepted",
        OR: [{ senderId: req.authUser!.id }, { receiverId: req.authUser!.id }]
      },
      include: { sender: true, receiver: true }
    });
    const friends = requests.map((request) => publicUser(request.senderId === req.authUser!.id ? request.receiver : request.sender));
    res.json({ friends });
  } catch (error) {
    next(error);
  }
});
