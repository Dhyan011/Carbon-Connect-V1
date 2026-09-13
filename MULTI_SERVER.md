# Multi-user and multi-server deployment

Carbon-Connect is compatible with separate buyer and seller sessions and horizontally scaled backend instances when the Prisma/PostgreSQL API is used.

## Required production topology

```text
Figma Make or hosted React frontend
              │
              │ HTTPS + VITE_API_BASE_URL
              ▼
       Load balancer / reverse proxy
          │        │        │
          ▼        ▼        ▼
      API 1     API 2     API 3
          │        │        │
          └────────┼────────┘
                   ▼
            Shared PostgreSQL
                   │
       Redis / object storage / queues
```

The API instances are stateless. They do not store login sessions in process memory. Access tokens are signed and verified on every request, so a buyer can log in through one instance and submit an RFQ through another instance without session affinity.

Set the same secret on every API instance:

```env
JWT_ACCESS_SECRET=the-same-long-random-value-on-every-instance
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
CORS_ORIGINS=https://your-frontend.example,https://preview.example
```

Never use the development fallback secret in production.

## Separate users and organizations

Every user is associated with an organization membership. Buyer and seller permissions are checked against the organization on the server. A buyer can only create and award its own RFQs. A seller can only submit bids using its own organization and published listings. The frontend role value is never trusted as authorization.

Use separate browser sessions, API tokens, or accounts when testing buyer and seller flows. The demo accounts are:

| Role | Email | Password |
|---|---|---|
| Buyer | `buyer@carbon-connect.demo` | `demo-password` |
| Seller | `seller@carbon-connect.demo` | `demo-password` |

Production passwords must be Argon2id or bcrypt hashes. The seed’s plaintext value is only for local demo bootstrapping.

## Concurrent bidding

The Prisma API uses PostgreSQL as the source of truth. Bid submission is protected by an active-bid uniqueness rule. Awarding runs in a database transaction and:

1. Confirms the buyer owns the RFQ.
2. Confirms the selected bid belongs to the RFQ and is still active.
3. Declines competing bids.
4. Marks the selected bid as awarded.
5. Marks the RFQ as awarded.
6. Creates one unique award record.
7. Returns the existing award when concurrent requests race on the unique RFQ award constraint.

This prevents two buyer requests, arriving at different API servers at the same time, from creating two awards for the same RFQ.

## Start the PostgreSQL API

```bash
docker compose up -d postgres redis minio
cp .env.example .env
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run api:prisma
```

Set the frontend environment to the API’s public HTTPS URL:

```env
VITE_API_BASE_URL=https://api.your-domain.example
```

The API server listens on `API_PORT`, defaults to `4000`, binds to `0.0.0.0`, and responds to CORS requests from `CORS_ORIGINS`.

## Demo versus production API

`npm run api` starts the JSON-persistence demo server. It is useful for local preview and smoke tests but cannot coordinate writes across multiple machines because its JSON file is local to one host.

`npm run api:prisma` starts the shared PostgreSQL implementation. Use this for multiple buyers, sellers, API instances, and concurrent trading. Do not place the JSON demo server behind a load balancer.
