# `app/_lib/api`

This folder defines frontend access to backend services. Domain modules expose typed browser API functions for posts, categories, comments, and subscriptions.

`client.ts` is the shared Axios client. It uses `/api`, sends cookies, unwraps the backend's generic response envelope, converts non-`401` backend responses with error bodies to `ApiError`, and attempts one authentication refresh after a `401`. Concurrent `401` responses share the same in-flight refresh request. Exhausted `401` responses and failures without backend response bodies remain Axios or native errors. `server-client.ts` is the Server Component equivalent and calls public content endpoints at `BACKEND_URL` without forwarding browser cookies.

Add endpoint-specific calls to the appropriate domain module and reuse shared types from `@/types`. Preserve response unwrapping and authentication retry behavior.
