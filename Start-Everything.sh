#!/usr/bin/env bash
set -euo pipefail

BASE_URL=https://raw.githubusercontent.com/vulinh64/spring-base-squad/refs/heads/main
CMD_FILE=run-full-squad-full-stack.sh
DOCKER_COMPOSE_FILE=docker-compose-full-stack.yml

cleanup() {
    rm -f "$CMD_FILE" "$DOCKER_COMPOSE_FILE"
    rm -rf build
}

trap cleanup EXIT

curl --fail --location --output "$CMD_FILE" "$BASE_URL/$CMD_FILE"
curl --fail --location --output "$DOCKER_COMPOSE_FILE" "$BASE_URL/$DOCKER_COMPOSE_FILE"

bash "$CMD_FILE"
