# App Directory

This folder contains route segments for the application using the App Router.

## Ownership boundaries
- Keep route-level concerns here: `page.tsx`, `layout.tsx`, and route-specific loading/error states.
- Prefer moving reusable UI into `components/`.
- Prefer moving business logic and data helpers into `lib/`.
