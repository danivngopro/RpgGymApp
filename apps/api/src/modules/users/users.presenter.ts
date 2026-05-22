import type { User } from "@prisma/client";
import { levelFromTotalExp } from "@rpg-gym/shared";

export function publicUser(user: Pick<User, "id" | "username" | "avatarUrl" | "level" | "totalExp" | "currentStreak" | "title" | "createdAt">) {
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    level: user.level,
    totalExp: user.totalExp,
    currentStreak: user.currentStreak,
    title: user.title,
    createdAt: user.createdAt,
    progression: levelFromTotalExp(user.totalExp)
  };
}
