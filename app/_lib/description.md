# `app/_lib`

This folder contains reusable application code that is not itself routable. The `@/` TypeScript alias points here.

Major areas are `api/` for backend access, `auth/` for session state, `components/` for shared UI, `hooks/` for TanStack Query and browser hooks, `types/` for API contracts, and `utils/` for small helpers.

Keep dependencies flowing from routes and components into these shared modules. Avoid placing route files or Next.js special files in `_lib/`.
