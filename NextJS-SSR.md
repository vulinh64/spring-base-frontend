# Next.js SSR Migration

## Overview

Migrated the React 19 + Vite SPA **in-place** to Next.js App Router with server-side rendering for SEO-critical pages (posts, categories) while keeping interactive/auth-heavy pages client-rendered.

**Previous stack**: React 19, Vite 8, React Router v7, TanStack Query v5, Axios, Tailwind CSS 4, Keycloak auth
**Current stack**: Next.js 16 (App Router), React Server Components, TanStack Query v5, Axios, Tailwind CSS 4, Keycloak auth

### Key Decisions
- **In-place migration** — replaced Vite in this repo, not a new project
- **Backend CORS** — relaxed, accepts any origin (no CORS issues for server-side fetches)
- **Auth** — HTTP-only cookie access token; preserves current session "remember" behavior (sessionHint in localStorage + cookie); cookies forwarded from request to backend on SSR
- **Server-side rendering** — SEO-critical pages are Server Components with server-side data fetching (`cache: "no-store"` for fresh data on every request)
- **Deployment** — Docker standalone container; can run independently or in a compose stack alongside backend
- **Tax calculator** — pure client-side, no SSR
- **Search** — pure client-side, fetch directly from backend, no SSR

---

## Migration Progress

### Completed

- [x] **Phase 0**: Next.js setup, Tailwind CSS 4 via `@tailwindcss/postcss`, env config, `next.config.js` with standalone output and API proxy rewrites
- [x] **Phase 1**: Root layout, providers, header — all ported from Vite/React Router
- [x] **Phase 2**: Server-side fetch client (`app/_lib/api/server-client.ts`) with cookie forwarding; server fetch functions for posts and categories
- [x] **Phase 3**: All routes created under `app/` with file-based routing; SEO pages converted to Server Components with server-side data fetching
- [x] **Phase 4**: Auth adaptation — AuthProvider SSR guard for localStorage, AuthGuard with `useRouter().replace()`, cookie forwarding in server-side fetches
- [x] **Phase 5**: Component refactoring — all `react-router-dom` usage replaced with `next/link` + `next/navigation`, Suspense boundaries for `useSearchParams()`, client islands for interactive parts of SSR pages
- [x] **Phase 6**: `generateMetadata` for dynamic SEO metadata on post and category pages
- [x] **Phase 7**: Docker standalone Dockerfile, docker-compose.yml, updated README
- [x] **Cleanup**: Removed Vite, react-router-dom, index.html, src/main.tsx, src/App.tsx, PageLayout, old page files, tsconfig split files; moved source to `app/_lib/`

### Remaining

- [ ] **`generateStaticParams`** for optionally pre-building known post/category slugs at build time

---

## Phase 0: Pre-Migration Setup [DONE]

### 0.1 Initialize Next.js In-Place
- Removed Vite dependencies (`vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`)
- Installed Next.js and its dependencies (`next`, `@next/env`)
- Created `app/` directory at project root; moved source code to `app/_lib/`
- Configured TypeScript with existing settings (target ES2023, strict mode)
- Set up the `@/` path alias to map to `app/_lib/`
- Retained all current dependencies (react, react-dom, tanstack-query, axios, etc.)

### 0.2 Tailwind CSS 4
- Migrate Tailwind config to Next.js (use `@tailwindcss/postcss` or built-in support)
- Port `src/index.css` — custom font faces (Noto Sans, JetBrains Mono), prose overrides, GitHub alert styles, code block styles, tax calculator animations
- Verify `@tailwindcss/typography` plugin works with prose/prose-invert classes

### 0.3 Environment Configuration
- Create `.env.local` for development:
  ```
  BACKEND_URL=http://localhost:8088    # Server-side fetches (absolute URL)
  REVALIDATE_SECRET=<random-token>     # Secret for on-demand revalidation endpoint
  ```
- Configure `next.config.js` rewrites to proxy `/api` → backend (replaces Vite dev proxy and Nginx proxy)

```js
// next.config.js
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${process.env.BACKEND_URL || "http://localhost:8088"}/api/:path*` },
    ];
  },
};
export default nextConfig;
```

---

## Phase 1: App Shell & Layout [DONE]

### 1.1 Root Layout (`app/layout.tsx`) — Server Component
- Replace `PageLayout` wrapper
- Render `<Header />` and global providers
- Set global metadata (default title, description, charset, viewport)
- Import global CSS (`index.css`)

### 1.2 Providers (`app/providers.tsx`) — Client Component (`"use client"`)
- Wrap children with:
  - `QueryClientProvider` (TanStack Query) — configure staleTime: 30s, retry: 1
  - `AuthProvider` (existing context, needs `"use client"`)
  - `ToastProvider` (existing context)
- This replaces the provider nesting currently in `App.tsx`

### 1.3 Header Component — Client Component (`"use client"`)
- Port existing `Header.tsx` as-is (uses state for mobile menu, category dropdown)
- Replace `<Link>` from react-router-dom with `next/link`
- Replace `useNavigate()` with `useRouter()` from `next/navigation`
- Replace `useLocation()` with `usePathname()` from `next/navigation`
- Keep lazy category loading via `categoryApi.all()`

### 1.4 Common Components — Minimal Changes
These port directly with only import changes (`next/link`, `next/navigation`):
- `SearchBar` — replace `useNavigate` → `useRouter().push`, wrapped in `<Suspense>` for `useSearchParams()`
- `Pagination` — no routing dependency, ports as-is
- `LoadingSpinner` — ports as-is
- `ErrorBanner` — ports as-is
- `Toast` + `ToastProvider` — ports as-is (client component)
- `ConfirmDialog` — ports as-is
- `UserInfoBox` — ports as-is (client component, uses auth context)

---

## Phase 2: API Layer [DONE]

### 2.1 Axios Client (`app/_lib/api/client.ts`) — No Changes
- Existing client kept for **client-side** requests (browser → backend via proxy, cookies sent automatically)

### 2.2 Server-Side Fetch Client [DONE]
Created a **server-side** fetch helper for Server Components at `app/_lib/api/server-client.ts`:
- Uses absolute backend URL from `BACKEND_URL` env var
- Forwards the incoming request's `Cookie` header using `cookies()` from `next/headers`
- Preserves the user's HTTP-only auth cookie for SSR requests that may need auth context
- Same response unwrapping logic (extract from `GenericResponse<T>`)
- Uses native `fetch` instead of axios — Next.js extends `fetch` with built-in caching and revalidation support

### 2.3 Server-Side Data Fetching Functions [DONE]
Created thin wrappers using `serverFetch` with cache tags for on-demand revalidation:

- `app/_lib/api/server/posts.ts` — `fetchPosts()`, `fetchPost()`, `fetchPostsByCategory()`
- `app/_lib/api/server/categories.ts` — `fetchCategories()`

### 2.4 On-Demand Revalidation API (Cache Busting) [DONE]
When a post or category is created/edited/deleted, the backend calls this endpoint to bust the cache:

```ts
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tags } = await req.json()
  for (const tag of tags) {
    revalidateTag(tag, "default")
  }

  return NextResponse.json({ revalidated: true })
}
```

**Backend integration** [TODO]: After a post CRUD operation, the backend sends:
```
POST /api/revalidate
x-revalidate-secret: <token>
{ "tags": ["posts", "post:my-post-slug"] }
```

**Fallback**: Even without backend integration, pages auto-revalidate every 60 seconds via the `revalidate: 60` setting. The on-demand API is for instant cache busting.

---

## Phase 3: Route Migration

### Route Mapping

| Route                   | Next.js Path                         | Rendering                                |
|-------------------------|--------------------------------------|------------------------------------------|
| `/`                     | `app/page.tsx`                       | Server Component (placeholder)           |
| `/posts`                | `app/posts/page.tsx`                 | **Server Component** (server-side fetch) |
| `/post/:slug`           | `app/post/[slug]/page.tsx`           | **Server Component** + client islands    |
| `/post/new`             | `app/post/new/page.tsx`              | Client (`"use client"`)                  |
| `/post/:slug/edit`      | `app/post/[slug]/edit/page.tsx`      | Client (`"use client"`)                  |
| `/post/:slug/revisions` | `app/post/[slug]/revisions/page.tsx` | Client (`"use client"`)                  |
| `/categories`           | `app/categories/page.tsx`            | **Server Component** + client admin      |
| `/category/:slug`       | `app/category/[slug]/page.tsx`       | **Server Component** + client pagination |
| `/search`               | `app/search/page.tsx`                | Client (`"use client"`)                  |
| `/tax-calculator`       | `app/tax-calculator/page.tsx`        | Client (`"use client"`)                  |
| `/me`                   | `app/me/page.tsx`                    | Client (`"use client"`)                  |
| `/login`                | `app/login/page.tsx`                 | Client (`"use client"`)                  |
| `*`                     | `app/not-found.tsx`                  | Server Component                         |

### 3.1 SSR Pages [DONE]

SEO-critical pages are Server Components with server-side data fetching:

#### `app/posts/page.tsx` — Server Component
- Fetches posts server-side via `fetchPosts()`
- Renders PostList with server-fetched data
- Client-side pagination via searchParams

#### `app/post/[slug]/page.tsx` — Server Component + Client Islands
- Fetches post server-side via `fetchPost(slug)`
- `generateMetadata` for dynamic SEO: title, description (excerpt), OpenGraph tags
- Server-renders: header, markdown content (MarkdownRenderer)
- Client island (`post-detail-client.tsx`): comments, subscribe, FAB buttons (auth-dependent)
- **Highest-value page** — blog post content indexed by search engines, served as server-rendered HTML

#### `app/categories/page.tsx` — Server Component + Client Admin
- Fetches categories server-side via `fetchCategories()`
- Server-renders category grid
- Client island (`categories-admin.tsx`): create/delete forms (admin only, auth-dependent)

#### `app/category/[slug]/page.tsx` — Server Component
- Fetches posts by category server-side via `fetchPostsByCategory()`
- `generateMetadata` for dynamic SEO with category name
- Server-renders PostList with client-side pagination

### 3.2 Client-Only Pages (No SSR Needed) [DONE]

These pages are behind auth or have no SEO value. They use `"use client"` at the top and are ported from the previous codebase.

#### `app/post/new/page.tsx` & `app/post/[slug]/edit/page.tsx`
- PostEditorPage with session draft, preview mode, markdown toolbar
- Auth-guarded (redirect if not authenticated)
- Heavy client interactivity — no SSR benefit

#### `app/post/[slug]/revisions/page.tsx`
- PostRevisionsPage — auth-required, admin feature
- No SEO value

#### `app/tax-calculator/page.tsx`
- Pure client-side JavaScript calculation and display
- No data fetching, no SEO requirement
- Port TaxCalculator component as-is with `"use client"`

#### `app/search/page.tsx`
- Pure client-side search — fetches results directly from backend
- No SEO requirement, results are user-specific
- Wrapped in `<Suspense>` for `useSearchParams()`

#### `app/me/page.tsx`
- UserDetailsPage — auth-required profile page

#### `app/login/page.tsx`
- LoginPage — form with auth flow, redirect logic
- Wrapped in `<Suspense>` for `useSearchParams()`

### 3.3 Metadata Strategy [DONE]
Dynamic `generateMetadata` implemented for:
- `app/post/[slug]/page.tsx` — title, description (excerpt), OpenGraph article metadata (published time, author, tags)
- `app/category/[slug]/page.tsx` — title and description with category name

---

## Phase 4: Authentication Adaptation [DONE]

### 4.1 AuthProvider — Client Component (Preserve Current Behavior)
- Stays as `"use client"` context provider
- Same logic: check `sessionHint` in localStorage → fetch `/api/auth/me` → set state
- Same background token refresh (2-minute interval)
- HTTP-only cookie is sent automatically by the browser on all `/api` requests (via proxy rewrite)
- **"Remember" behavior preserved**: sessionHint in localStorage survives tab close; HTTP-only cookie persists per backend's cookie config; returning user triggers `/api/auth/me` check → restores session if cookie still valid
- No changes to login/logout/refresh API calls
- **SSR guard added**: `typeof window === "undefined"` check in `useState` initializer to avoid `localStorage is not defined` during prerendering

### 4.2 Auth Guard — Keep Client-Side
- Keep `AuthGuard` as a client component wrapper — same redirect-to-login behavior
- Uses `useRouter().replace()` with `useEffect` for redirect (replaces React Router's `<Navigate>`)
- Protected pages are all `"use client"` anyway, so no benefit from server-side middleware

### 4.3 Cookie Forwarding for SSR Pages [DONE]
- Server-side pages are rendered without user-specific content in the HTML
- Auth-dependent UI (FAB buttons, edit/delete, admin controls) renders in client islands that check auth after hydration
- The `serverFetch` helper forwards cookies for completeness, but SSR pages do not vary by auth state

### 4.4 Protected Pages
- Wrap client-only protected pages with existing `AuthGuard` component
- No change to auth flow for these pages

---

## Phase 5: Component Refactoring Details [DONE]

### 5.1 Components Changed

| Component                          | Change Made                                                                 |
|------------------------------------|-----------------------------------------------------------------------------|
| All components using `<Link>`      | `react-router-dom` → `next/link` (`href` instead of `to`)                   |
| All components using `useNavigate` | → `useRouter()` from `next/navigation`                                      |
| All components using `useLocation` | → `usePathname()` / `useSearchParams()` from `next/navigation`              |
| All components using `useParams`   | → `useParams()` from `next/navigation`                                      |
| `SearchBar`                        | Wrapped in `<Suspense>` for `useSearchParams()`                             |
| `AuthGuard`                        | `<Navigate>` → `useRouter().replace()` with `useEffect`                     |
| `UserInfoBox`                      | Redirect passed as query param instead of location state                    |

### 5.2 Components Ported As-Is (Client Components)
These needed only `"use client"` directive and import path updates:
- `MarkdownRenderer` (uses rehype/remark plugins, highlight.js — all client-safe)
- `MarkdownEditor` (uses `document.execCommand`, textarea manipulation)
- `YouTubePlayer` (iframe with JS API)
- `TableOfContents` (IntersectionObserver, scroll events)
- `CommentList`, `CommentItem`, `CommentForm` (interactive, auth-dependent)
- `PostCard`, `PostList` (can be server component if no interactivity, but fine as client)
- `CategoryBadge` (simple link — could be server component)
- `TaxCalculator` (pure client-side calculation)
- `Toast`, `ConfirmDialog` (UI interactions)

### 5.3 Components Refactored for SSR [DONE]

Pages converted to Server Components with client islands:
- `PostDetailPage` → server (content, metadata) + client island `post-detail-client.tsx` (comments, subscribe, FAB)
- `PostsPage` → server-fetch data, client pagination controls
- `CategoriesPage` → server-fetch data + client island `categories-admin.tsx` (create/delete forms)
- `CategoryPostsPage` → server-fetch data, client pagination

### 5.4 React Router → Next.js Navigation Cheat Sheet

```ts
// Before (React Router)
import { Link, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
const navigate = useNavigate()
const location = useLocation()
const { slug } = useParams()
const [searchParams] = useSearchParams()
navigate('/posts')
navigate(-1)

// After (Next.js)
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation'
const router = useRouter()
const pathname = usePathname()
const { slug } = useParams()
const searchParams = useSearchParams()
router.push('/posts')
router.back()
```

---

## Phase 6: TanStack Query Integration [DONE]

SSR pages fetch data directly via server-side fetch functions, bypassing TanStack Query on the server. Client islands within those pages use TanStack Query hooks for interactive data (comments, subscriptions, etc.).

All existing hooks (`usePosts`, `usePost`, `useSearchPosts`, `usePostsByCategory`, `useCategories`, `useComments`, `usePostRevisions`) continue working as client-side hooks in client components and client-only pages.

---

## Phase 7: Deployment Changes [DONE]

### 7.1 Docker Image (Standalone)
Replace the current multi-stage Nginx build with a Node.js runtime:

```dockerfile
# Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### 7.2 Docker Compose (Frontend + Backend Together)

```yaml
# docker-compose.yml
services:
  backend:
    image: spring-base-backend
    ports:
      - "8088:8088"

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - BACKEND_URL=http://backend:8088
      - REVALIDATE_SECRET=${REVALIDATE_SECRET}
    depends_on:
      - backend
```

**Standalone mode**: Run the frontend container alone, pointing `BACKEND_URL` to any reachable backend:
```bash
docker run -p 3000:3000 -e BACKEND_URL=https://api.example.com -e REVALIDATE_SECRET=xxx frontend
```

### 7.3 Infrastructure Impact
- **Before**: Nginx serves static files, proxies `/api` to backend
- **After**: Node.js server handles SSR + static assets, proxies `/api` to backend
- Memory footprint increases (Node.js runtime vs Nginx) — typically ~80-150MB for a Next.js standalone server
- For production, consider a reverse proxy (Nginx/Caddy) in front for TLS termination and static asset caching

---

## Files Changed

### Deleted
- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/App.tsx` (routing logic moved to `app/` directory)
- `src/components/layout/PageLayout.tsx`
- All `src/pages/*.tsx` files (moved to `app/` directory)
- `tsconfig.app.json`, `tsconfig.node.json`
- `src/` directory (all source moved to `app/_lib/`)

### Created

```
app/
├── layout.tsx                       (root layout — server component)
├── providers.tsx                    (client providers wrapper)
├── globals.css                      (global styles)
├── page.tsx                         (home — placeholder)
├── not-found.tsx                    (404)
├── api/revalidate/route.ts          (on-demand revalidation endpoint)
├── posts/page.tsx                   (server component — SSR)
├── post/[slug]/page.tsx             (server component — SSR + generateMetadata)
├── post/[slug]/post-detail-client.tsx (client island — comments, subscribe, FAB)
├── post/[slug]/edit/page.tsx        (client)
├── post/[slug]/revisions/page.tsx   (client)
├── post/new/page.tsx                (client)
├── categories/page.tsx              (server component — SSR)
├── categories/categories-admin.tsx  (client island — admin create/delete)
├── category/[slug]/page.tsx         (server component — SSR + generateMetadata)
├── search/page.tsx                  (client)
├── tax-calculator/page.tsx          (client)
├── me/page.tsx                      (client)
├── login/page.tsx                   (client)
└── _lib/
    ├── api/
    │   ├── client.ts                (axios client for browser-side requests)
    │   ├── server-client.ts         (server-side fetch with cookie forwarding)
    │   ├── server/
    │   │   ├── posts.ts             (server fetch: fetchPosts, fetchPost, fetchPostsByCategory)
    │   │   └── categories.ts        (server fetch: fetchCategories)
    │   ├── posts.ts                 (client API for posts)
    │   ├── categories.ts            (client API for categories)
    │   ├── comments.ts              (client API for comments)
    │   └── subscriptions.ts         (client API for subscriptions)
    ├── auth/                        (AuthProvider, AuthGuard)
    ├── components/                  (React components organized by feature)
    ├── hooks/                       (custom React hooks)
    ├── types/                       (TypeScript type definitions)
    └── utils/                       (utility functions)
next.config.js
postcss.config.js
.env.local                           (BACKEND_URL, REVALIDATE_SECRET)
Dockerfile                           (Node.js standalone)
docker-compose.yml                   (frontend + backend)
```

---

## Risks & Mitigations

| Risk                                      | Status                                                                                                                    | Mitigation                                                                                                     |
|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| MarkdownRenderer SSR compatibility        | **Resolved** — kept as `"use client"` component; metadata still gets SSR via `generateMetadata`                           | N/A                                                                                                            |
| Auth-dependent UI flash on SSR pages      | **Mitigated** — auth UI (FAB, admin buttons) renders in client islands after hydration; acceptable brief appearance delay | Client islands pattern                                                                                         |
| Increased deployment complexity           | **Mitigated** — `output: 'standalone'` keeps Docker image minimal; compose file provided                                  | Docker standalone + compose                                                                                    |
| Session "remember" behavior               | **Resolved** — HTTP-only cookie + sessionHint in localStorage preserved; AuthProvider logic unchanged                     | N/A                                                                                                            |
| On-demand revalidation not yet integrated | **Open** — backend does not yet call `POST /api/revalidate` after CRUD operations                                         | Pages use `cache: "no-store"` for fresh data; on-demand revalidation endpoint is ready for backend integration |
