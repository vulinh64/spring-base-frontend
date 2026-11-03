# `app/_lib/types`

This folder defines shared TypeScript contracts for backend requests, responses, domain entities, roles, pagination, and the generic response envelope. `index.ts` re-exports the public type surface used through `@/types`.

Keep these definitions aligned with backend contracts and prefer precise types over `any` or suppressions. Changes here can affect routes, API clients, hooks, and components across the application.

`SinglePostResponse.version` and required `PostEditRequest.version` are backend-managed nonnegative JSON integers, separate from revisionNumber. The editor rejects missing or unsafe integer tokens rather than risking rounded Java Long values. Backend agent confirmed M1005 for stale versions and M1006 (400) for missing/null/negative versions, plus atomic version enforcement including category and tags; backend implementation and integration validation are tracked separately.
