# GymRPG

RPG-style fitness and gym tracker. Phase 2 contains the monorepo foundation plus email/password authentication.

## Stack

- Monorepo with npm workspaces
- API: Node.js, TypeScript, Express, Zod, Prisma, PostgreSQL, Argon2, JWT, pino, helmet, cors
- Web: React, TypeScript, Vite, React Router, Tailwind
- Shared: DTO/schema constants in `packages/shared`
- Local database: PostgreSQL through Docker Compose

## Local Defaults

- API: `http://localhost:4001`
- API health: `http://localhost:4001/api/health`
- Web: `http://localhost:5173`
- Web API base: `VITE_API_URL=http://localhost:4001/api`

## Environment Files

Create local env files from the examples:

```powershell
Copy-Item apps\api\.env.example apps\api\.env
Copy-Item apps\web\.env.example apps\web\.env
```

## Windows PowerShell Commands

Install dependencies:

```powershell
npm install
```

Start PostgreSQL:

```powershell
npm run docker:up
```

Run Prisma migration:

```powershell
npm run prisma:migrate
```

Start the API in one terminal:

```powershell
npm run dev:api
```

Start the web app in another terminal:

```powershell
npm run dev:web
```

Open:

```powershell
Start-Process http://localhost:4001/api/health
Start-Process http://localhost:5173
```

Register/login test flow:

1. Open `http://localhost:5173`.
2. Click `Register`.
3. Create a user with an email, username, optional display name, and password of at least 8 characters.
4. Confirm the app redirects to `/dashboard`.
5. Click `Logout`.
6. Log back in at `/login` using either the email or username.

## Verification

```powershell
npm install
npm run docker:up
npm run prisma:validate
npm run prisma:migrate
npm run build
npm test
npm run docker:config
```

If you used the Phase 1 database volume before the database username changed, Postgres may still contain the old local role. For a throwaway local dev database, reset it with:

```powershell
docker compose down -v
npm run docker:up
npm run prisma:migrate
```

## Phase Scope

Implemented through Phase 2:

- Monorepo foundation
- Shared health and auth schemas
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- protected `GET /api/users/me`
- Argon2 password hashing
- JWT auth middleware
- Prisma `User` model and initial migration
- React status page, login page, register page, and protected dashboard
- PostgreSQL Compose service
- Basic docs

Not implemented yet:

- Routines
- Workouts
- EXP progression logic beyond default user fields
- Friends or leaderboard
- Google OAuth
- Production Docker
