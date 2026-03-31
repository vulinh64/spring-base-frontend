#!/bin/sh
BASE_URL=https://raw.githubusercontent.com/vulinh64/spring-base-squad/refs/heads/main

curl -L -o run-full-squad.sh $BASE_URL/run-full-squad.sh
curl -L -o docker-compose.yml $BASE_URL/docker-compose.yml

chmod +x run-full-squad.sh
sh run-full-squad.sh

rm -f run-full-squad.sh docker-compose.yml
rm -rf build
