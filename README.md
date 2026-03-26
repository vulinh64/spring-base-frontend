# Frontend Project for `spring-base` Java Backend Service

A PoC frontend project paired with my [backend service](https://github.com/vulinh64/spring-base).

Most of the features were vibe coded.

## Tech Stack

- **React 19** with TypeScript

- **Vite 8** — dev server and bundler

- **Tailwind CSS 4**

- **TanStack Query** — server state management

- **React Router v7**

- **Axios** — HTTP client

- **react-markdown** + remark/rehype plugins — Markdown rendering

## Prerequisites

- Node.js (latest LTS recommended)
- npm, pnpm, or yarn

## Running the Frontend

Install dependencies and start the dev server:

```sh
# npm
npm install
npm run dev

# pnpm
pnpm install
pnpm dev

# yarn
yarn
yarn dev
```

The app will be accessible at `http://localhost:5173`.

## Running with Docker

Build the image:

```sh
docker build -t spring-base-frontend .
```

Run the container:

```sh
docker run -p 80:80 spring-base-frontend
```

The app will be accessible at `http://localhost`.

## Running the Backend

TBA
