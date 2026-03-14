# Hooks Directory

React hooks shared across routes and features should be placed here.

## Ownership boundaries
- Hooks should encapsulate UI state orchestration and side effects.
- Keep data/domain helpers in `lib/` and import them into hooks when needed.
- Prefer naming hooks with the `use` prefix.
