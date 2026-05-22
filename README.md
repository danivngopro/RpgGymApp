# RPG Gym App

Professional MVP for an RPG-style fitness tracker: routines, workout execution, EXP, levels, rewards, friends, and leaderboards.

## Stack

- Monorepo with npm workspaces
- API: TypeScript, Express, Prisma, PostgreSQL, Zod, pino
- Web: React, React Router, Tailwind, Vite
- Local infra: Docker Compose with PostgreSQL, API, web, Nginx

## Local Development on Windows PowerShell

Start PostgreSQL with Docker Compose:

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
```

Install dependencies, migrate the database, and seed exercises from the repo root:

```powershell
npm install
npm run db:migrate
npm run db:seed
```

Run the API and web app in two separate PowerShell terminals:

```powershell
npm run dev -w @rpg-gym/api
```

```powershell
npm run dev -w @rpg-gym/web
```

Open:

- API health: `http://localhost:4000/api/health`
- Web app: `http://localhost:5173`

If Vite chooses another port, copy that URL into `FRONTEND_URL` and `CORS_ORIGIN` in `.env`, then restart the API.

## Environment

Root `.env` is the source used by root scripts such as `npm run db:migrate` and `npm run db:seed`.

Local defaults:

```dotenv
DATABASE_URL=postgresql://rpg_gym:rpg_gym@localhost:5432/rpg_gym?schema=public
VITE_API_URL=http://localhost:4000/api
FRONTEND_URL=http://localhost:5173
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

Google OAuth redirect URI in Google Cloud Console:

```text
http://localhost:4000/api/auth/google/callback
```

Package-level examples also exist at `apps/api/.env.example` and `apps/web/.env.example`.

## Docker Compose

This stability pass uses Docker Compose for PostgreSQL only during local development. Full production Docker polish is intentionally deferred.

## Verification

```bash
npm test
npm run build
```

## API Docs

See [docs/api.md](docs/api.md).

## Architecture

See [docs/architecture.md](docs/architecture.md) and [docs/progression-system.md](docs/progression-system.md).
