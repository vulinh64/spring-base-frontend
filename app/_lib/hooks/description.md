# `app/_lib/hooks`

This folder contains reusable Client Component hooks. Most hooks wrap domain API functions with TanStack Query and define the query keys used for caching and invalidation.

`useSessionDraft.ts` keeps the latest supplied draft in memory and writes it to session storage when a `session-expired` browser event is dispatched and an authenticated user ID is available. Restoration verifies the stored draft-owner ID. It does not persist drafts on ordinary navigation or logout. When adding mutations or changing keys, update all related invalidation sites so cached pages do not become stale.
