# Carbon-Connect Backend

Carbon-Connect now has two backend modes:

1. **Demo mode**, which runs the existing lightweight Node API with JSON persistence and is suitable for immediate local testing.
2. **Production mode**, which uses the included Prisma schema with PostgreSQL, Redis, and S3-compatible object storage. This backend must run locally or on a separate server because Figma Make hosts the frontend preview separately.

The frontend remains in `src/`. Backend code is in `server/`, the production schema is in `prisma/`, and local infrastructure is defined in `docker-compose.yml`.

## Figma Make architecture

Figma Make serves the Vite frontend on port 8443. It does not host the backend process. For preview/demo mode, the frontend can use seed data and the current API fallback. For live mode, deploy the backend independently and set:

```env
VITE_API_BASE_URL=https://api.your-domain.example
```

Never put database credentials, JWT secrets, object-storage secrets, or payment secrets in the frontend environment.

## Demo API mode

Run the lightweight persistent API:

```bash
npm install
npm run api
```

The API listens on `http://localhost:4000`. In a second terminal:

```bash
npm run dev
```

The Vite development server proxies `/api/*` and `/health` to port 4000. To run both processes together:

```bash
npm run dev:full
```

The demo API persists its working data in `server/data.json`. It implements authentication, RFQs, bid submission, bid listing, bid-award idempotency, competing-bid decline, and audit records.

## Production PostgreSQL mode

Start local infrastructure:

```bash
docker compose up -d postgres redis minio
cp .env.example .env
```

Generate and validate Prisma:

```bash
npm run db:generate
npm run db:validate
```

Create a development migration and seed the database:

```bash
npm run db:migrate -- --name init
npm run db:seed
```

Open Prisma Studio when needed:

```bash
npm run db:studio
```

The production schema covers users, organizations, organization memberships, facilities, listings, RFQs, RFQ requirements, bid revisions, bids, awards, contracts, payment milestones, shipments, shipment events, documents, quality records, digital passports, MRV records, CCTS context records, notifications, and append-only audit logs.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Buyer | `buyer@carbon-connect.demo` | `demo-password` |
| Seller | `seller@carbon-connect.demo` | `demo-password` |
| Admin | `admin@carbon-connect.demo` | `demo-password` |

## API routes currently implemented

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/v1/auth/login` | Demo authentication and bearer token |
| GET | `/api/v1/auth/me` | Current authenticated user |
| GET | `/api/v1/rfqs` | List RFQs |
| POST | `/api/v1/rfqs` | Create an RFQ as a buyer |
| GET | `/api/v1/rfqs/:rfqId` | Read one RFQ |
| GET | `/api/v1/rfqs/:rfqId/bids` | List bids for an RFQ |
| POST | `/api/v1/rfqs/:rfqId/bids` | Submit a seller bid |
| POST | `/api/v1/rfqs/:rfqId/award` | Award one bid with idempotency and competing-bid decline |

The Prisma schema is the production source of truth for the relational model. The demo API remains intentionally dependency-light so the website can be tested without requiring PostgreSQL.

## Physical CO₂ and CCTS safeguards

The backend treats physical CO₂ as the marketplace instrument. It does not issue carbon credits, offsets, or Carbon Credit Certificates. It does not claim permanent storage. CCTS records use explicit statuses such as `NOT_ASSESSED`, `IN_REVIEW`, `ACKNOWLEDGED`, `VERIFIED_FOR_RECORD`, `EXPIRED`, and `REQUIRES_OFFICIAL_REVIEW`.

The `prisma/seed.mjs` example deliberately creates a CCTS context record with `REQUIRES_OFFICIAL_REVIEW`. This is educational product context and not a compliance determination.

## Verification

Run the following before deployment:

```bash
DATABASE_URL='postgresql://carbon:carbon_dev_password@localhost:5432/carbon_connect' npx prisma validate
DATABASE_URL='postgresql://carbon:carbon_dev_password@localhost:5432/carbon_connect' npx prisma generate
npm run test:api
npm run build
```

The API smoke test covers authentication, RFQ listing, bid listing, and award behavior. The frontend build validates the React integration and route imports.

## Production hardening still required before public launch

The current demo API uses JSON persistence and demo passwords. Before production launch, replace it with the Prisma repository and PostgreSQL migrations, hash passwords with Argon2id, use rotating refresh tokens or secure HTTP-only sessions, add a real queue and notification provider, configure signed object-storage URLs, implement real payment webhooks, add rate limiting, add OpenAPI generation, and deploy the backend behind TLS with managed secrets.
