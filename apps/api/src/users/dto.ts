import type { User } from '@prisma/client';
import type { SafeUser } from '@gymrpg/shared';

export const toSafeUser = (user: User): SafeUser => ({
  id: user.id,
  email: user.email,
  username: user.username,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
  level: user.level,
  totalExp: user.totalExp,
  currentStreak: user.currentStreak,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});
