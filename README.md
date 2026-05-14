# Frontend Project for `spring-base` Java Backend Service

A frontend project paired with my [backend service](https://github.com/vulinh64/spring-base).

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **React 19** — UI library
- **Tailwind CSS 4** — styling
- **TanStack Query v5** — server state management
- **Axios** — HTTP client
- **react-markdown** + remark/rehype plugins — Markdown rendering

> **Migration status**: The project has been fully migrated from Vite + React Router to Next.js App Router. SEO-critical pages (`/posts`, `/post/[slug]`, `/categories`, `/category/[slug]`) are Server Components with server-side data fetching and dynamic metadata. Interactive/auth-heavy pages remain client-rendered. See [NextJS-SSR.md](NextJS-SSR.md) for full details.

## Prerequisites

- Node.js (latest LTS recommended)
- npm, pnpm, or yarn

## Running the Frontend

Install dependencies and start the dev server:

```sh
npm install
npm run dev
```

The app will be accessible at `http://localhost:3000`.

The dev server proxies browser requests under `/api` to two backends:
- `/api/auth/*` and `/api/accounts/*` → auth server at `http://localhost:8080` (configurable via `AUTH_URL`)
- everything else under `/api/*` → service backend at `http://localhost:8088` (configurable via `BACKEND_URL`)

The `/api` prefix is stripped on the way out — e.g. `/api/post/123` → `${BACKEND_URL}/post/123`. Server Components fetch the backend directly (no proxy), so they also rely on `BACKEND_URL` / `AUTH_URL`.

Auth uses HttpOnly cookies (`access_token`, `refresh_token`) issued by the auth server on `/auth/login`. The proxy forwards cookies in both directions, so the browser never sees the JWTs and the app server reads `access_token` from the cookie via `CookieBearerTokenResolver`. In production, the same routing is provided by `nginx.conf`.

## Environment Variables

| Variable      | Default                 | Description                                                                       |
|---------------|-------------------------|-----------------------------------------------------------------------------------|
| `AUTH_URL`    | `http://localhost:8080` | Auth server base URL — used for `/api/auth/*` and `/api/accounts/*` rewrites      |
| `BACKEND_URL` | `http://localhost:8088` | Service backend base URL — used by the catch-all `/api/*` rewrite and `serverFetch` |

## Running with Docker

Build the image:

```sh
docker build -t spring-base-frontend .
```

Run the container standalone:

```sh
docker run -p 3000:3000 \
  -e AUTH_URL=http://host.docker.internal:8080 \
  -e BACKEND_URL=http://host.docker.internal:8088 \
  spring-base-frontend
```

Or use Docker Compose with the backend:

```sh
docker compose up
```

The app will be accessible at `http://localhost:3000`.

## Running the Backend

Use the provided convenience scripts to pull and start the full backend stack via Docker Compose. They download `run-full-squad` and `docker-compose.yml` from the [`spring-base-squad`](https://github.com/vulinh64/spring-base-squad) repository, execute them, then clean up the downloaded files.

**Linux / macOS:**

```sh
sh Start-Server.sh
```

**Windows:**

```cmd
Start-Server.cmd
```

### Running the Full Stack (Backend + Frontend)

Use the `Start-Everything` scripts to build and start both the backend and frontend via Docker Compose. The frontend will be accessible at `http://localhost`.

**Linux / macOS:**

```sh
sh Start-Everything.sh
```

**Windows:**

```cmd
Start-Everything.cmd
```