# Copilot Instructions

## Architecture

- The root npm project is a workspace wrapper for the `server` package. The only application code is a TypeScript Express API in `server/src`.
- `server/src/index.ts` configures CORS and JSON parsing, mounts `apiRouter` at `/api`, and starts listening on `API_PORT`. Route handlers live in `server/src/routes`; request handlers live in `server/src/controllers`. The health endpoint is `GET /api/health`.
- Runtime environment loading is centralized in `server/src/config/env.ts`, which reads `server/.env`. Prisma CLI configuration is separate in `server/prisma7.config.ts`; its datasource URL comes from `DATABASE_URL`, while the schema is in `server/prisma/schema.prisma` and generated client output is under `server/generated/prisma`.
- `docker-compose.yml` provides PostgreSQL and Temporal plus the Temporal UI. `docker/postgres/init.sql` creates the Temporal databases and user; the app database is configured separately by `DATABASE_URL`.

## Build, test, and lint

- Install dependencies from the repository root: `npm install`.
- Start the API in watch mode: `npm run dev` (or from `server/`, `npm run dev`).
- Run the API directly: `npm start --workspace server`.
- Type-check the server: `npx tsc --noEmit -p server/tsconfig.json`.
- Start and stop local services: `npm run docker:up` and `npm run docker:down`; follow logs with `npm run docker:logs`.
- Database scripts from the root: `npm run db:generate`, `npm run db:migrate`, `npm run db:push`, and `npm run db:studio`.
- There is no configured build or lint script. The server's `test` script is a placeholder that exits with an error; no single-test command is currently available.

## Conventions

- Server TypeScript is strict, targets ES2022, and compiles as CommonJS. Keep application changes within the existing `routes` → `controllers` split.
- Add API routes to `server/src/routes/api.ts` so they remain under the `/api` mount; put their handlers in the corresponding controller.
- Keep runtime settings in `server/src/config/env.ts` and the checked-in variable template in `server/.env.example`. `DATABASE_URL` is consumed by Prisma CLI configuration as well as available through the runtime environment config.
- Prisma's datasource URL is supplied by `server/prisma7.config.ts`, not declared in `server/prisma/schema.prisma`. Keep schema and migration work aligned with that Prisma 7 configuration.
