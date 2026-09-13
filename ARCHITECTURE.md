# Carbon-Connect Architecture

## Runtime boundaries

The repository is intentionally split into two independently deployable runtimes:

| Area | Location | Runtime | Responsibility |
|---|---|---|---|
| Frontend | `src/`, `public/`, `index.html` | Vite + React | Browser UI and client-side routing |
| Production API | `server/prisma-api.mjs` | Node.js + Prisma | Authentication, RFQs, bids, awards, and PostgreSQL access |
| Demo API | `server/index.mjs` | Node.js + JSON file | Local-only fixture server for the API smoke test |
| Database | `prisma/schema.prisma`, `prisma/migrations/` | PostgreSQL | Durable production persistence |
| Deployment | `vercel.json`, `render.yaml`, Docker files | Vercel/Render/Docker | Provider-specific infrastructure configuration |

The browser talks to `/api/v1/*`. In local development Vite proxies those requests to port `4000`. In hosted deployments `VITE_API_BASE_URL` is compiled into the frontend and points to the public API origin.

## Backend conventions

`server/config.mjs` is the single source of truth for runtime configuration. It accepts Render's `PORT` first and falls back to `API_PORT` for local and Docker usage. Authentication uses the shared `JWT_ACCESS_SECRET` through `server/auth.mjs`. The Prisma API owns production data access; the JSON API is explicitly named `api:demo` and is not the production start command.

The API is stateless at the process layer. PostgreSQL stores business data, and every API instance must use the same database and JWT secret. `/health` performs a database query in the Prisma runtime so Render does not mark an unhealthy database-backed service as ready.

## Data lifecycle

The first migration is checked into `prisma/migrations/0001_init/migration.sql`. Hosted environments run `npx prisma migrate deploy` during the API build. Demo records are created only by the explicit `npm run db:seed` command and must not be seeded into a production database without review.

## Deployment choices

- **Vercel:** deploys the frontend only. Set `VITE_API_BASE_URL` to the deployed API URL and keep `vercel.json` enabled for SPA fallback.
- **Render:** import `render.yaml` as a Blueprint to create the static frontend, Node API, and PostgreSQL database. Override the generated service URLs if the services are renamed.
- **Docker:** use `docker-compose.production.yml` for a complete self-hosted stack. The API image runs `npm run api` and the frontend image receives `VITE_API_BASE_URL` at build time.

Redis, object storage, email, and payment provider variables remain reserved for the next production integrations. They are not required by the currently implemented API routes and should not be represented as fake runtime dependencies.
