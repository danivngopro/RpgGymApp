# Architecture

## Current Shape

GymRPG is planned as a modular monolith, not microservices.

The backend starts as one API service in `apps/api`. Feature areas should be organized internally by module as the product grows, but they should still deploy as one service until there is a concrete operational reason to split them.

This keeps Phase 1 simple:

- one Express API
- one React web client
- one shared package for constants, DTOs, schemas, and types where useful
- one local PostgreSQL service through Docker Compose

## Why Not Microservices Yet

The early product needs fast iteration and reliable local development more than service boundaries. Auth, workouts, progression, and friends can all live in one backend process with clear module boundaries. Splitting into microservices now would add deployment, networking, observability, and data-consistency work before the domain has proven where boundaries should exist.

## Packages

- `apps/api`: Node.js TypeScript Express API.
- `apps/web`: React TypeScript Vite web app.
- `packages/shared`: shared constants, schemas, DTOs, and types.
- `docs`: architecture and project documentation.

## Environment Routing

The frontend must not assume the Vite dev server is the API server. API calls use `VITE_API_URL`, which defaults to `http://localhost:4001/api`.

The backend CORS origin defaults to `http://localhost:5173`. Later redirect-based flows should use `FRONTEND_URL`, but Phase 1 does not implement auth or redirects.

## Future Mobile Path

Mobile can be added later as:

```text
apps/mobile
```

The expected stack is React Native with Expo. Mobile should use the same backend API and can reuse shared types and schemas from `packages/shared` where practical.

## UI Tooling

The uipro-style `ui-ux-pro-max` Codex skill is available in this workspace. The 21st.dev MCP server is also available. Both are intentionally reserved for later UI polish phases, especially Phase 5, after the foundation, auth, API routing, and core workflows are verified.
