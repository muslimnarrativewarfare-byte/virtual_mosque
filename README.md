# Virtual Mosque

Mobile-first web experience for discovering mosques, viewing announcements, and managing directory operations.

## User-facing flows

- Home page (`/`) with quick navigation cards.
- Mosque directory (`/mosques`) with search and city filtering.
- Mosque details (`/mosques/[id]`) with services and announcements.
- Map explorer (`/map`) powered by Leaflet with client-only dynamic import.
- Add mosque form (`/add`) posting to API.
- Mosque dashboard (`/dashboard`) for operational stats.
- Admin panel (`/admin`) with auth-guarded management view.

## Reusable components

- `MosqueCard`
- `SearchFilters`
- `MapView` + `MapViewClient` (Leaflet)
- `AnnouncementList`
- Form controls (`LabeledInput`, `LabeledTextarea`)

## API baseline

- `GET /api/mosques`
- `POST /api/mosques` (admin token required)
- `PATCH /api/mosques/:id` (admin token required)
- `DELETE /api/mosques/:id` (admin token required)

Header used for privileged routes: `x-admin-token: <ADMIN_TOKEN>`.

## Testing baseline

- API route tests for CRUD/auth failure behaviors.
- Prisma interaction tests for repository calls.
- UI auth-guard test coverage for admin page behavior.

Run tests:

```bash
npm test
```

## Production readiness

### Vercel environment variables

Set these in Vercel project settings:

- `DATABASE_URL` (Postgres connection string)
- `ADMIN_TOKEN` (shared secret for API/admin access)
- `NEXT_PUBLIC_APP_URL` (optional, canonical URL)

### Postgres provisioning checklist

1. Create a managed Postgres instance (Neon, Supabase, RDS, or equivalent).
2. Enable TLS and enforce strong password policy.
3. Create app database/user with least privileges.
4. Add the final connection string to `DATABASE_URL`.

### Prisma migration/deploy commands

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed   # optional if seed script is configured
```

For local development:

```bash
npx prisma migrate dev
```

### Build/start commands

```bash
npm install
npm run build
npm run start
```

### Rollout checklist

1. Confirm Vercel env vars are set for preview + production.
2. Run `prisma migrate deploy` against production database.
3. Verify health by calling `GET /api/mosques`.
4. Smoke test key flows on mobile viewport:
   - directory search/filter
   - map explorer
   - add mosque form
   - admin auth guard
5. Monitor Vercel logs and DB metrics for first 24 hours.
