# Frontend Project for `spring-base` Java Backend Service

A frontend project paired with my [backend service](https://github.com/vulinh64/spring-base).

## Features

- Public blog posts, categories, and pagination fetched and rendered on the server per request
- Search, comments, post and author subscriptions
- Cookie-backed authentication and user profile display
- Authenticated post creation, editing, and revision management
- Administrative category management
- Vietnamese personal income tax calculator

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **React 19** — UI library
- **Tailwind CSS 4** — styling
- **TanStack Query v5** — server state management
- **Axios** — HTTP client
- **react-markdown** + remark/rehype plugins — Markdown rendering

SEO-critical pages (`/posts`, `/post/[slug]`, `/categories`, `/category/[slug]`) use Server Components with request-time backend fetching and route-specific or backend-derived metadata. Interactive and authentication-heavy features use Client Components, which are included in the initial HTML and then hydrate in the browser. See [AGENTS.md](AGENTS.md) for architecture and contribution guidance.

## Prerequisites

- Node.js 22 or a compatible newer LTS
- npm (the repository uses `package-lock.json`, and the Docker build uses `npm ci`)
- Docker, Docker Compose, Git, and curl when using the orchestration scripts
- Bash when using the orchestration scripts on Linux or macOS

## Running the Frontend

Install dependencies and start the dev server:

```sh
npm install
npm run dev
```

The app will be accessible at `http://localhost:3000`.

The dev server proxies authentication and account requests to `AUTH_URL` and other `/api` requests to `BACKEND_URL`. Both values can be configured in `.env.local`.

The corresponding backend services must be running for API-backed pages and authentication to work. The tax calculator is standalone.

To run a production build from the current checkout:

```sh
npm run build
npm run start
```

## Environment Variables

| Variable      | Default                 | Description                                                                     |
|---------------|-------------------------|---------------------------------------------------------------------------------|
| `AUTH_URL`    | `http://localhost:8080` | Auth service URL for `/api/auth/*` and `/api/accounts/*` requests               |
| `BACKEND_URL` | `http://localhost:8088` | Content backend URL for other browser `/api/*` requests and server-side fetches |

Example `.env.local`:

```env
AUTH_URL=http://localhost:8080
BACKEND_URL=http://localhost:8088
```

The browser login client currently uses the fixed client ID `spring-base`. Changing `CLIENT_ID` at runtime does not expose a different value to client-side code.

## Validation

Run a production build and the configured flat ESLint setup:

```sh
npm run build
npm run lint
```

There is currently no automated test suite, and adding one is not part of the current project scope. Treat `npm run build` and `npm run lint` as the primary validation commands and manually exercise affected UI states.

## Running with Docker

Next.js resolves proxy rewrite destinations during the production build. Pass non-default service URLs as build arguments:

```sh
docker build \
  --build-arg AUTH_URL=http://host.docker.internal:8080 \
  --build-arg BACKEND_URL=http://host.docker.internal:8088 \
  -t spring-base-frontend .
```

Run the container standalone:

```sh
docker run -p 3000:3000 spring-base-frontend
```

Runtime `BACKEND_URL` can override direct Server Component requests, but it does not change the browser `/api` rewrites baked into the image. Runtime `AUTH_URL` does not change those baked rewrites.

No Docker Compose file is committed in this repository. Use the provided `Start-Everything` scripts below to download external full-stack orchestration files and start freshly cloned frontend and backend repositories.

The app will be accessible at `http://localhost:3000`.

## Running the Backend

Use the provided convenience scripts to pull and start the full backend stack via Docker Compose. They download `run-full-squad` and `docker-compose.yml` from the unpinned `main` branch of the [`spring-base-squad`](https://github.com/vulinh64/spring-base-squad) repository, execute them, then clean up the downloaded files.

These external scripts clone fresh backend repositories into `build/`, stop existing related Compose stacks, force-remove related Docker images, and delete `build/` when the wrapper exits. Review the remote files before running the scripts.

**Linux / macOS:**

```sh
bash Start-Server.sh
```

**Windows:**

```cmd
Start-Server.cmd
```

### Running the Full Stack (Backend + Frontend)

Use the `Start-Everything` scripts to build and start the backend and frontend via Docker Compose. The external runner clones a fresh frontend from GitHub into `build/`; it does not build this current checkout or include local changes. The frontend will be accessible at `http://localhost`.

Like the backend-only runner, this workflow downloads unpinned files from the external repository's `main` branch, stops existing related Compose stacks, force-removes related Docker images, and deletes `build/` when the wrapper exits.

**Linux / macOS:**

```sh
bash Start-Everything.sh
```

**Windows:**

```cmd
Start-Everything.cmd
```
