# Virtual Mosque (V1)

A simple Next.js App Router project for discovering and submitting mosques.

## V1 scope

- Public mosque directory (no authentication yet)
- Mosque details page
- Submit mosque form
- Google Maps links + embedded map view
- Data persisted in Upstash KV via REST API

## Required environment variables

Set either the generic KV names or the Vercel `STORAGE_*` names:

- `KV_REST_API_URL` or `STORAGE_KV_REST_API_URL`
- `KV_REST_API_TOKEN` or `STORAGE_KV_REST_API_TOKEN`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

- `GET /api/mosques` — list all mosques
- `POST /api/mosques` — create a mosque
- `GET /api/mosques/:id` — fetch mosque details
- `DELETE /api/mosques/:id` — delete a mosque
