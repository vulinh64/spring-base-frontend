# `app/_lib/api/server`

This folder contains API helpers intended for Server Components. `posts.ts` and `categories.ts` call `serverFetch` to load anonymous SEO-sensitive public content without forwarding browser cookies.

The current helpers disable caching with `cache: "no-store"`, so their routes render dynamically and call the content backend on every request. They do not use Next.js data or full-route caching, making route latency and availability directly dependent on the content backend. The helpers manually serialize pagination parameters, and `serverFetch` throws a status-bearing `BackendError` for non-success responses so routes can distinguish missing content from backend failures. Keep browser-only behavior and TanStack Query out of this folder.
