ARG AUTH_URL=http://localhost:8080
ARG BACKEND_URL=http://localhost:8088

FROM node:26.13.0-alpine3.24 AS builder

ARG AUTH_URL
ARG BACKEND_URL

WORKDIR /app

ENV AUTH_URL=${AUTH_URL}
ENV BACKEND_URL=${BACKEND_URL}

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:26.13.0-alpine3.24 AS runner

ARG AUTH_URL
ARG BACKEND_URL

WORKDIR /app

ENV NODE_ENV=production
ENV AUTH_URL=${AUTH_URL}
ENV BACKEND_URL=${BACKEND_URL}

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
