# `app/_lib/types`

This folder defines shared TypeScript contracts for backend requests, responses, domain entities, roles, pagination, and the generic response envelope. `index.ts` re-exports the public type surface used through `@/types`.

Keep these definitions aligned with backend contracts and prefer precise types over `any` or suppressions. Changes here can affect routes, API clients, hooks, and components across the application.
