# GymRPG

RPG-style fitness and gym tracker. Phase 1 contains only the monorepo foundation, API health endpoint, React status page, shared health schema, and local PostgreSQL Compose setup.

## Stack

- Monorepo with npm workspaces
- API: Node.js, TypeScript, Express, Zod, pino, helmet, cors
- Web: React, TypeScript, Vite, React Router, Tailwind
- Shared: DTO/schema constants in `packages/shared`
- Local database: PostgreSQL through Docker Compose only

## Local Defaults

- API: `http://localhost:4001`
- API health: `http://localhost:4001/api/health`
- Web: `http://localhost:5173`
- Web API base: `VITE_API_URL=http://localhost:4001/api`

## Environment Files

Create local env files from the examples when needed:

```powershell
Copy-Item apps\api\.env.example apps\api\.env
Copy-Item apps\web\.env.example apps\web\.env
```

API defaults:

```env
PORT=4001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Web defaults:

```env
VITE_API_URL=http://localhost:4001/api
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

## Verification

```powershell
npm run build
npm run typecheck
npm test
npm run docker:config
```

## Phase Scope

Implemented in Phase 1:

- Monorepo foundation
- Shared health response schema
- `GET /api/health`
- React status page that calls `VITE_API_URL + /health`
- PostgreSQL Compose service
- Basic docs

Not implemented yet:

- Auth
- Routines
- Workouts
- EXP and levels
- Friends or leaderboard
- Google OAuth
- Prisma/database integration
