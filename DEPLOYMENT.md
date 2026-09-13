# Carbon-Connect Deployment Guide

Carbon-Connect is deployed as a static React frontend plus a Node.js/Prisma API backed by PostgreSQL. The frontend and API are intentionally independent services.

## Deployment matrix

| Component | Vercel | Render | Self-hosted Docker |
|---|---|---|---|
| Frontend | Supported | Supported as a static site | Supported with `Dockerfile.frontend` |
| Prisma API | Not deployed by this repository configuration | Supported as a Node web service | Supported with `Dockerfile.api` |
| PostgreSQL | Use an external managed provider | Use the database in `render.yaml` | Included in `docker-compose.production.yml` |

## Option A: Render Blueprint

1. Push this repository to a Git provider.
2. In Render, create a new Blueprint and select the repository.
3. Render reads `render.yaml` and creates `carbon-connect-api`, `carbon-connect-web`, and `carbon-connect-db`.
4. Confirm the generated service URLs. If the names were changed, update `CORS_ORIGINS` on the API and `VITE_API_BASE_URL` on the frontend.
5. Wait for the API health check at `/health` to return HTTP 200.
6. For a non-production demo database only, run `npm run db:seed` from a one-off job or shell after migrations complete.

The API build runs:

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
```

The API start command is:

```bash
npm run api
```

Render supplies the public process port through `PORT`; the API also accepts `API_PORT` for local and Docker compatibility.

## Option B: Vercel frontend plus hosted API

Vercel hosts the Vite frontend only. Create a Vercel project rooted at the repository root with:

```text
Build command: npm run build
Output directory: dist
Install command: npm ci
```

Set this Vercel environment variable for Preview and Production:

```env
VITE_API_BASE_URL=https://<your-api-host>
```

`vercel.json` supplies the SPA fallback so direct navigation to frontend routes serves `index.html`. Deploy the API separately on Render, Railway, Fly.io, or a VPS, and set its `CORS_ORIGINS` to the exact Vercel origin, for example `https://your-project.vercel.app`.

## Option C: Docker Compose

Copy `.env.example` to `.env`, replace all production secrets, and start the stack:

```bash
docker compose --env-file .env -f docker-compose.production.yml up -d --build
```

Apply migrations after PostgreSQL is healthy:

```bash
docker compose -f docker-compose.production.yml run --rm api npx prisma migrate deploy
```

The frontend is exposed on port `80` and the API on port `4000`. Put TLS and a domain-aware reverse proxy in front of both before exposing them publicly.

## Required production variables

The Prisma API requires:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=<long-random-secret>
CORS_ORIGINS=https://your-frontend-origin.example
```

The frontend requires `VITE_API_BASE_URL` at build time. It is compiled into the browser bundle; changing it requires a frontend rebuild.

Optional integration variables such as Redis, S3, email, and payment providers are documented in `.env.example` but are not currently used by the implemented routes. Do not configure them as health dependencies until their adapters are enabled.

## Verification checklist

```bash
npm ci
DATABASE_URL='postgresql://user:password@localhost:5432/carbon_connect' npm run db:validate
npm run build
npm run test:api
```

For a deployed API:

```bash
curl -fsS https://<your-api-host>/health
```

The response should report `carbon-connect-prisma-api` and a PostgreSQL-backed health check. Do not run `npm run db:seed` against a production database containing real users or transactions.

## Security checklist

Use a unique high-entropy `JWT_ACCESS_SECRET`, restrict `CORS_ORIGINS` to known HTTPS origins, enable database backups, and avoid demo credentials in production. Replace the current demo password storage with a password hash adapter before accepting real users. Review organization-level authorization and payment/document workflows before launch.
