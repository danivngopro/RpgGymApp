# RPG Gym App

Professional MVP for an RPG-style fitness tracker: routines, workout execution, EXP, levels, rewards, friends, and leaderboards.

## Stack

- Monorepo with npm workspaces
- API: TypeScript, Express, Prisma, PostgreSQL, Zod, pino
- Web: React, React Router, Tailwind, Vite
- Local infra: Docker Compose with PostgreSQL, API, web, Nginx

## Setup

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev -w @rpg-gym/api
npm run dev -w @rpg-gym/web
```

With Docker:

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost:8080`.

## Verification

```bash
npm test
npm run build
```

## API Docs

See [docs/api.md](docs/api.md).

## Architecture

See [docs/architecture.md](docs/architecture.md) and [docs/progression-system.md](docs/progression-system.md).
