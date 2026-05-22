# API Documentation

Base path: `/api`

Authenticated routes require `Authorization: Bearer <token>`.

## Auth

- `POST /auth/register` `{ email, username, password }`
- `POST /auth/login` `{ email, password }`
- `GET /auth/me`
- `GET /auth/google`
- `GET /auth/google/callback`

## Exercises

- `GET /exercises?search=&muscle=&equipment=&difficulty=`
- `GET /exercises/:id`

## Routines

- `GET /routines`
- `POST /routines`
- `GET /routines/:id`
- `PUT /routines/:id`
- `DELETE /routines/:id`

Routine exercise payload fields include `exerciseId`, `order`, `sets`, `reps`, `weightKg`, `durationSeconds`, `restSeconds`, and `notes`.

## Workouts

- `POST /workouts/start` `{ routineId }`
- `POST /workouts/:id/complete` `{ exercises: [...] }`
- `GET /workouts/history`

Workout completion returns awarded EXP, level-up data, and completed exercise results.

## Friends

- `POST /friends/requests` `{ identifier }`
- `POST /friends/requests/:id/accept`
- `POST /friends/requests/:id/reject`
- `GET /friends`

## Leaderboard

- `GET /leaderboard/friends?rankBy=weeklyExp|totalExp|level|streak`
