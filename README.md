# Virtual Mosque

Virtual Mosque is a Next.js web app for discovering mosques, viewing announcements, and managing mosque data through protected API routes.

## Features

- Browse mosques with search/filter support.
- View mosque details and announcements.
- Explore mosque locations on an interactive Leaflet map.
- Submit mosque entries via form flow.
- Admin-protected API routes for create/update/delete and moderation.

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Prisma ORM
- Tailwind CSS
- Vitest + Testing Library

## Run locally

### 1) Prerequisites

- Node.js 18.17+ (Node.js 20+ recommended)
- npm 9+
- A PostgreSQL database

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and set at least:

- `DATABASE_URL` — PostgreSQL connection string
- `ADMIN_TOKEN` — secret token used by protected API routes

If you connect **Vercel Upstash KV** with custom prefix `STORAGE`:

- In the connect modal field shown as `STORAGE` + `_URL`, use your Upstash Redis connection string:
  - `redis://default:<password>@<region>-<id>.upstash.io:6379`
- Vercel then exposes these env vars (as shown in Upstash quickstart):
  - `STORAGE_KV_REST_API_READ_ONLY_TOKEN`
  - `STORAGE_KV_REST_API_TOKEN`
  - `STORAGE_KV_REST_API_URL`
  - `STORAGE_KV_URL`
  - `STORAGE_REDIS_URL`
- If your app expects `STORAGE_URL`, set it to the same value as `STORAGE_REDIS_URL`.

> Note: `.env.example` currently includes `NEXTAUTH_*` variables; this app’s auth guard uses `ADMIN_TOKEN` for API/admin authorization.

### 4) Apply Prisma migrations

```bash
npx prisma migrate dev
```

(Optional) generate Prisma client explicitly:

```bash
npx prisma generate
```

### 5) Start the development server

```bash
npm run dev
```

Open http://localhost:3000

## Useful scripts

- `npm run dev` — start local development server
- `npm run build` — create production build
- `npm run start` — run production build
- `npm run lint` — run lint checks
- `npm test` — run test suite

## Production notes

Set these environment variables in your hosting provider:

- `DATABASE_URL`
- `ADMIN_TOKEN`
- `NEXT_PUBLIC_APP_URL` (optional)
- `STORAGE_REDIS_URL` (or `STORAGE_URL` alias with the same Redis value)
- `STORAGE_KV_REST_API_URL`, `STORAGE_KV_REST_API_TOKEN`

Deployment checklist:

1. Run `npx prisma migrate deploy` on production DB.
2. Deploy app.
3. Verify `GET /api/mosques` and admin-protected endpoints.
