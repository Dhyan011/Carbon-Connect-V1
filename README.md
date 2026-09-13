# Carbon-Connect

Carbon-Connect is a carbon capture-to-product marketplace for the circular carbon ecosystem. It connects industrial CO₂ emitters with companies that can use captured carbon in concrete, fuels, chemicals, greenhouses, algae cultivation, and other productive pathways.

## Product workflow

The application demonstrates the full marketplace lifecycle:

1. Emitters publish captured CO₂ supply with volume, purity, location, physical state, availability, and pricing.
2. Buyers discover supply through marketplace filters and create requirements or RFQs.
3. Suppliers respond with bids containing delivered pricing, quantity, lead time, and evidence.
4. Buyers compare bids and award supply.
5. The workflow continues through contract, payment, logistics, quality verification, digital passport, and impact/MRV views.

## Architecture

The project is a Vite + React + TypeScript frontend backed by a Node.js API and Prisma PostgreSQL database.

| Layer | Implementation |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| API | Node.js HTTP server in `server/prisma-api.mjs` |
| Database | PostgreSQL through Prisma |
| Authentication | Signed Carbon-Connect sessions plus Google OAuth ID-token verification |
| Hosting | Vercel or Render frontend, Render API and PostgreSQL |

The API is the source of truth for RFQs, bids, and awards. The frontend additionally stores user-scoped profile, document, and fallback demo state under keys containing the authenticated user ID so different users do not share browser-local changes.

## Google authentication

Google sign-in is available for buyer and seller accounts. The API verifies Google credentials server-side, creates or reuses the user, creates a workspace membership for first-time users, and issues the normal Carbon-Connect session token.

Set these variables in the API and frontend environments:

```env
GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

Create a Google OAuth 2.0 Web application client and add every deployed frontend origin to Authorized JavaScript origins. The Google client ID is public; never add a Google client secret to the frontend or repository. See [`GOOGLE_AUTH.md`](./GOOGLE_AUTH.md) for the complete setup guide.

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

The frontend uses `VITE_API_BASE_URL` to locate the API. Demo password login remains available when Google OAuth variables are not configured.

## Validation

```bash
DATABASE_URL='postgresql://user:password@localhost:5432/carbon_connect' npm run db:validate
npm run build
npx tsc --noEmit
npm run test:api
```

## Deployment

The repository includes `render.yaml`, `vercel.json`, Dockerfiles, and the deployment guide. Render can provision the Prisma API and PostgreSQL database from the Blueprint. Vercel can host the static frontend with:

```text
Install command: npm ci
Build command: npm run build
Output directory: dist
```

Set `VITE_API_BASE_URL` to the deployed API URL and restrict API `CORS_ORIGINS` to the deployed frontend origin. Set both Google OAuth variables before building the frontend and starting the API.

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) and [`ARCHITECTURE.md`](./ARCHITECTURE.md) for operational details.

## Production considerations

The current application is designed for a hackathon demonstration and should receive a security review before handling real commercial data. Production hardening should include password hashing for legacy password accounts, organization-level authorization review, document storage and malware scanning, payment-provider integration, audit-log retention, database backups, rate limiting, and approved legal/privacy policies.
