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

The dev server proxies `/api` requests to the backend at `http://localhost:8088` (configurable via `BACKEND_URL` in `.env.local`).

## Environment Variables

| Variable      | Default                 | Description                                                              |
|---------------|-------------------------|--------------------------------------------------------------------------|
| `BACKEND_URL` | `http://localhost:8088` | Backend API base URL (used by Next.js rewrites to proxy `/api` requests) |

## Running with Docker

Build the image:

```sh
docker build -t spring-base-frontend .
```

Run the container standalone:

```sh
docker run -p 3000:3000 -e BACKEND_URL=http://host.docker.internal:8088 spring-base-frontend
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
