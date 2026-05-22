# Architecture

## Current Shape

GymRPG is planned as a modular monolith, not microservices.

The backend starts as one API service in `apps/api`. Feature areas should be organized internally by module as the product grows, but they should still deploy as one service until there is a concrete operational reason to split them.

This keeps the current implementation simple:

- one Express API
- one React web client
- one shared package for constants, DTOs, schemas, and types where useful
- one local PostgreSQL service through Docker Compose

## Why Not Microservices Yet

The early product needs fast iteration and reliable local development more than service boundaries. Auth, workouts, progression, and friends can all live in one backend process with clear module boundaries. Splitting into microservices now would add deployment, networking, observability, and data-consistency work before the domain has proven where boundaries should exist.

## Auth

Authentication is part of the modular monolith API in `apps/api`. Phase 2 uses email/password registration and login only:

- Argon2 stores password hashes.
- JWTs authenticate API requests.
- `GET /api/users/me` returns the current safe user DTO.
- Password hashes are never returned from the API.

Google OAuth is intentionally deferred until the email/password flow and API routing are stable.

## Packages

- `apps/api`: Node.js TypeScript Express API.
- `apps/web`: React TypeScript Vite web app.
- `packages/shared`: shared constants, schemas, DTOs, and types.
- `docs`: architecture and project documentation.

## Environment Routing

The frontend must not assume the Vite dev server is the API server. API calls use `VITE_API_URL`, which defaults to `http://localhost:4001/api`.

The backend CORS origin defaults to `http://localhost:5173`. Later redirect-based flows should use `FRONTEND_URL`, but Phase 2 does not implement OAuth redirects.

## Future Mobile Path

Mobile can be added later as:

```text
apps/mobile
```

The expected stack is React Native with Expo. Mobile should use the same backend API and can reuse shared types and schemas from `packages/shared` where practical.

Token storage is abstracted in the web app. The current web implementation uses `localStorage`; a future `apps/mobile` client can swap that abstraction for Expo SecureStore or AsyncStorage without changing the API DTOs.

## UI Tooling

The uipro-style `ui-ux-pro-max` Codex skill is available in this workspace and was used for Phase 2 auth layout guidance. The 21st.dev MCP server is present, but its inspiration calls returned malformed MCP results during Phase 2, so no 21st.dev snippets were integrated.
