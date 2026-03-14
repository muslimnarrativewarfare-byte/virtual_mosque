# Types Directory

This folder stores shared TypeScript types and interfaces used across the app.

## Ownership boundaries
- Keep domain models and cross-cutting DTO types here.
- Co-locate strictly local component prop types with the component itself.
- Avoid runtime logic in this folder.
