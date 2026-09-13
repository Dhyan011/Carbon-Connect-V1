# Carbon-Connect

Carbon-Connect is a capture-to-product marketplace for the circular carbon ecosystem. It connects industrial CO₂ emitters with companies that can use captured carbon in concrete, fuels, chemicals, greenhouses, algae cultivation, and other productive pathways.

## Product workflow

1. Emitters publish captured CO₂ supply with volume, purity, location, physical state, availability, and pricing.
2. Buyers discover supply through marketplace filters and create requirements or RFQs.
3. Suppliers respond with bids containing delivered pricing, quantity, lead time, and evidence.
4. Buyers compare bids and award supply.
5. The workflow continues through contract, payment, logistics, quality verification, digital passport, and impact/MRV views.

## Architecture

The application is a Vite + React + TypeScript frontend backed by a Node.js API and Prisma PostgreSQL database.

```mermaid
flowchart LR
    U[Buyer / Seller / Admin] --> V[Vercel React Frontend]
    V -->|HTTPS JSON API| A[Render Node.js API]
    A --> P[(Render PostgreSQL)]
    A --> T[Signed session token]
    V --> L[User-scoped browser persistence]
    A --> M[RFQs, bids, awards, organizations]
    A --> H[/health]
```

| Layer | Implementation |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| API | Node.js HTTP server in `server/prisma-api.mjs` |
| Database | PostgreSQL through Prisma |
| Authentication | Existing signed Carbon-Connect sessions and demo/password accounts |
| Hosting | Vercel frontend, Render API, Render PostgreSQL |

The API is the source of truth for RFQs, bids, and awards. The frontend stores user-scoped profile, document, RFQ, and bid fallback state under keys containing the authenticated user ID so different browser users do not share local changes.

## Local development

```bash
npm ci
cp .env.example .env
npx prisma generate
npm run build
npm run dev
```

For the Prisma API, configure a PostgreSQL `DATABASE_URL`, apply migrations, and run:

```bash
npm run db:migrate:deploy
npm run api
```

The frontend uses `VITE_API_BASE_URL` to locate the API. Demo password login remains available for local and hackathon testing.

## Validation

```bash
DATABASE_URL='postgresql://user:password@localhost:5432/carbon_connect' npm run db:validate
npm run build
npx tsc --noEmit
npm run test:api
```

## Deployment

### Live deployments

| Component | URL |
|---|---|
| Vercel frontend | https://carbon-connect-v1-omcrqobzu-dhyan011s-projects.vercel.app |
| Render site | https://carbon-connect-web.onrender.com |

The Vercel URL is currently protected by Vercel access control and returns a redirect to Vercel SSO when accessed without an authenticated session. The Render URL is publicly reachable and is the static-site deployment. A separate public Render Node API URL must be configured before the frontend can use PostgreSQL-backed RFQs, bids, and awards in production.

### Render API and database

Use the repository’s `render.yaml` Blueprint, or create a Node web service with:

```text
Build command: npm ci && npx prisma generate && npx prisma migrate deploy
Start command: npm run api
Health check: /health
```

Set `NODE_ENV=production`, `DATABASE_URL`, `JWT_ACCESS_SECRET`, and `CORS_ORIGINS`. Configure `CORS_ORIGINS` with the exact Vercel production origin.

### Vercel frontend

Create a Vercel project from this repository with:

```text
Install command: npm ci
Build command: npm run build
Output directory: dist
```

Set `VITE_API_BASE_URL` to the public Render API URL and set Render `CORS_ORIGINS` to the Vercel frontend origin. `vercel.json` provides the SPA fallback for direct navigation.

## Production considerations

The application is designed for a hackathon demonstration and should receive a security review before handling real commercial data. Production hardening should include password hashing for legacy password accounts, organization-level authorization review, document storage and malware scanning, payment-provider integration, audit-log retention, database backups, rate limiting, and approved legal/privacy policies.
