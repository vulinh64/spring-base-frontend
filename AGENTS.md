# Contributor and Agent Guide

## Project Overview

This repository is the Next.js frontend for the broader `spring-base` service ecosystem. It presents a personal technical blog and a small collection of tools backed primarily by Spring services.

The visible product areas are:

- Public blog posts, categories, search, comments, and subscriptions
- Authenticated post creation, editing, revision management, and user profile display
- Administrative category creation and deletion
- A standalone Vietnamese personal income tax calculator

The application uses Next.js App Router, React, TypeScript, Tailwind CSS, TanStack Query, and Axios. Public content routes use Server Components and request-time backend fetching for SEO-sensitive content. Interactive and authentication-heavy features use Client Components, which can still contribute to the initial server-generated HTML before hydrating in the browser.

## Important Commands

```sh
npm install          # Install dependencies
npm run dev          # Start the development server at http://localhost:3000
npm run build        # Production build and TypeScript validation
npm run start        # Run a previously built production app
npm run lint         # Run the configured flat ESLint setup
docker build -t spring-base-frontend .
```

There is no automated test suite in the repository, and adding one is not part of the current project scope. Treat `npm run build` and `npm run lint` as the primary validation commands and manually exercise affected UI states.

## Backend and Environment

Browser requests use `/api` paths and are forwarded by rewrites in `next.config.js`:

- Authentication and account paths go to `AUTH_URL`, defaulting to `http://localhost:8080`.
- Other API paths go to `BACKEND_URL`, defaulting to `http://localhost:8088`.

The browser login client currently sends the fixed default client ID `spring-base`; its `process.env.CLIENT_ID` lookup is not exposed through Next.js client configuration. The start scripts download unpinned orchestration files from the external `spring-base-squad` repository's `main` branch. Those runners clone fresh repositories into `build/`, stop related Compose stacks, force-remove related images, and delete `build/` afterward. `Start-Everything` builds the fresh frontend clone rather than the current checkout. Review those remote artifacts before relying on or changing the scripts.

Next.js rewrite destinations are resolved during the production build. For standalone Docker images, pass `AUTH_URL` and `BACKEND_URL` as build arguments when browser proxy destinations differ from the defaults. Runtime `BACKEND_URL` still controls direct Server Component requests through `serverFetch`.

## Project Structure

- `app/`: Next.js routes, layouts, providers, and global styles.
- `app/_lib/api/`: Browser and server-side API clients grouped by domain.
- `app/_lib/auth/`: Authentication API functions and React authentication state.
- `app/_lib/components/`: Shared UI grouped by feature or responsibility.
- `app/_lib/hooks/`: TanStack Query hooks and reusable browser hooks.
- `app/_lib/types/`: Shared API request, response, pagination, and domain types.
- `app/_lib/utils/`: Small reusable utilities.
- `public/`: Static assets, fonts, icons, and favicon.
- `important/`: Durable project context intended for future contributors.
- `next.config.js`: Standalone output and backend proxy rewrites.
- `Dockerfile`: Multi-stage production image using Next.js standalone output.

Generated directories such as `.next/`, `dist/`, `build/`, and `node_modules/` are not source and must not be edited.

## Architecture and Conventions

- Preserve the hybrid component model. Public, SEO-sensitive post and category pages fetch and compose content with Server Components and `app/_lib/api/server`; mutations and browser APIs use Client Components. Server Component and Client Component describe execution and bundling boundaries, not a simple SSR-versus-CSR distinction.
- Add `"use client"` only where client behavior is required. Do not move an entire public route to the client for a small interactive section.
- Browser API calls go through `app/_lib/api/client.ts`, which unwraps the backend response envelope, converts non-`401` backend error bodies to `ApiError`, and retries one token refresh after a `401`.
- Public post and category routes currently render dynamically on every request because their server helpers fetch with `cache: "no-store"`. Each request depends on content-backend latency and availability, and the responses do not use Next.js data or full-route caching.
- Request-time Server Component API calls use `serverFetch` without forwarding browser cookies because the public content APIs are anonymous and do not vary by authenticated user.
- The category-post route uses its slug for metadata to avoid a second backend request. The content backend has no dedicated category-by-slug details endpoint, its category search slug filter performs partial matching, and its post-by-category endpoint returns an empty page rather than `404` for an unknown category.
- The root `Providers` Client Component receives route content through its `children` slot. This preserves Server Component route children; it does not convert the entire application subtree into Client Components.
- The root `loading.tsx` shows the shared spinner while route segments wait, and the root `error.tsx` shows a simple server-error state for uncaught route failures without exposing technical details or a retry action.
- TanStack Query owns browser-side server state. Mutations generally invalidate relevant query keys and use the shared toast and confirmation components, although comment editing currently only invalidates its comment query.
- Authentication is cookie-based. Local storage contains only a `sessionHint`; do not store credentials or tokens there. `AuthGuard` and role checks are UI behavior, not an authorization boundary.
- Shared imports use the `@/` alias, which maps to `app/_lib/`.
- Domain request and response types belong in `app/_lib/types/`; API functions belong in `app/_lib/api/`.
- Styling uses Tailwind utility classes and a dark visual theme. Global Markdown and tax-calculator styles live in `app/globals.css`.
- Markdown rendering supports GFM, raw HTML, syntax highlighting, alert blocks, heading anchors, and custom YouTube elements. Post table-of-contents extraction parses Markdown headings and shares deterministic ID generation with the renderer. Treat renderer and heading-extraction changes as compatibility-sensitive.
- Post editor and new-comment draft state is kept in memory while editing and persisted to session storage when `session-expired` is dispatched by either the shared browser API client or `AuthProvider` background refresh. Session storage records one shared draft-owner ID, and draft restoration enforces that ownership.

## Safe Modification Guidance

1. Read the route, shared component, API module, and domain types involved before editing.
2. Preserve server/client boundaries, response-envelope handling, anonymous public server fetches, and the one-refresh browser authentication flow.
3. Reuse existing components, hooks, query keys, and API helpers before introducing duplicates.
4. Keep changes focused and do not discard unrelated working-tree changes.
5. Validate with `npm run build` and `npm run lint`; distinguish existing lint issues from newly introduced ones.
6. Manually verify loading, empty, error, authenticated, and unauthorized states for affected UI or API-backed flows.
7. Do not introduce a unit-test framework unless the project testing policy changes.
8. For every code or configuration change, review the nearest relevant `description.md` files and update them in the same change whenever behavior, responsibilities, dependencies, constraints, or important edge cases change. Also update `AGENTS.md` or `README.md` when repository-wide architecture, contributor guidance, setup, validation, or operational behavior changes. Do not leave known stale documentation, and do not edit documentation merely to create churn when it remains accurate.

The repository was migrated from a Vite SPA to Next.js App Router. Verify current behavior from the code rather than trusting stale migration-era assumptions.
