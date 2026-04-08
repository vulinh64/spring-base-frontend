#!/bin/sh
BASE_URL=https://raw.githubusercontent.com/vulinh64/spring-base-squad/refs/heads/main
CMD_FILE=run-full-squad-full-stack.sh
DOCKER_COMPOSE_FILE=docker-compose-full-stack.yml

curl -L -o $CMD_FILE $BASE_URL/$CMD_FILE
curl -L -o $DOCKER_COMPOSE_FILE $BASE_URL/$DOCKER_COMPOSE_FILE

chmod +x $CMD_FILE
sh $CMD_FILE

rm -f $CMD_FILE $DOCKER_COMPOSE_FILE
rm -rf build
