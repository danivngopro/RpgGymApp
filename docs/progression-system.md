# Progression System

## EXP Awards

Base exercise EXP is calculated from prescribed and completed effort:

- Reps-based sets: `sets * reps * 4`
- Duration-based sets: `ceil(durationSeconds / 15) * sets * 3`
- Weight bonus: `ceil(weightKg / 10) * sets`
- Minimum completed exercise award: `20 EXP`

If the completed exercise meets or exceeds its target sets and reps/duration, the exercise receives a `1.3x` target multiplier.

If the full routine is completed, the workout session total receives a `30%` completion bonus.

All multipliers are configured in `packages/shared/src/progression.ts`.

## Level Formula

Level is derived from lifetime EXP. The EXP required to move from level `n` to `n + 1` is:

`100 * n^1.35`, rounded to the nearest integer.

This gives fast early wins while making later levels meaningful.

## Rewards

Rewards are intentionally motivational and cosmetic:

- Titles: Novice, Iron Trainee, Warrior, Elite, Champion, Legend.
- Badges: first workout, streak milestones, level milestones.
- Profile frames: unlocked at levels 5, 10, 20, 35, and 50.
- Challenges: harder challenges unlock at level thresholds.
- Stat points: each level grants 1 cosmetic point assignable to Strength, Endurance, Discipline, or Consistency.

The backend returns a level-up result after workout completion when a user crosses one or more levels.

## Ranking Logic

Friend leaderboards support ranking by weekly EXP, total EXP, level, and streak. Weekly EXP is calculated from workout sessions completed since the start of the current week. Only public profile fields are returned.
