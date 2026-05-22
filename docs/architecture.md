# RPG Gym Architecture

## Decision Summary

The MVP uses a modular monolith in a monorepo:

- `apps/api`: TypeScript, Node.js, Express, Prisma, PostgreSQL.
- `apps/web`: React, React Router, Tailwind, Vite.
- `packages/shared`: Zod schemas, progression constants, shared TypeScript types.
- `nginx`: local reverse proxy routing `/api` to the backend and all other paths to the frontend.

This is a modular monolith, not a microservices system. That is the correct MVP choice because auth, routines, workouts, progression, friends, and leaderboards all share one relational data model and need fast transactional consistency. Splitting now would add deployment, network, observability, and data-consistency costs before the product has proven scale pressure.

The code is still microservices-ready in structure: each backend domain is isolated under `src/modules/*` with route, service, and validation boundaries. If the product grows, modules like workouts, leaderboard, or friends can be extracted later behind the same HTTP contracts.

## ORM Choice

Prisma is used over Drizzle for the MVP because it gives fast schema iteration, readable relations, generated types, mature migrations, and straightforward seed scripts. Drizzle is excellent for SQL-first control, but Prisma is the better fit here because the app has many relational CRUD flows and needs fast MVP delivery.

## Authentication

Email/password auth uses Argon2 hashing and JWT bearer tokens. Google OAuth is scaffolded with Passport and can be enabled by providing Google credentials. Passwords are never returned from APIs.

## API Modules

- `auth`: register, login, Google OAuth, current session.
- `users`: public profile and private current profile.
- `exercises`: searchable seeded catalog.
- `routines`: routine builder and routine exercise prescriptions.
- `workouts`: active workout completion and history.
- `progression`: level, EXP, rewards, stat points.
- `friends`: request, accept, reject, list.
- `leaderboard`: privacy-friendly friend leaderboard.

## Security

The API uses Helmet, CORS allow-listing, pino structured logging, auth rate limiting, Zod input validation, centralized error handling, and environment-based secrets. `.env` is ignored and `.env.example` documents required values.

## Frontend

The app uses a direct product UI rather than a marketing landing page. The visual direction is a professional dark fitness dashboard using athletic typography, orange energy accents, and green success actions. Components are split into shell, cards, forms, and feature pages so React Native can be added later with shared business contracts rather than shared DOM components.

## Deployment Notes

For production, build `apps/web` to static assets and serve through Nginx or a frontend host, run `apps/api` as a Node service, use managed PostgreSQL, set strong secrets, configure HTTPS, and set `CORS_ORIGIN` to the deployed web origin.
