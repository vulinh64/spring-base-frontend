@echo off
set BASE_URL=https://raw.githubusercontent.com/vulinh64/spring-base-squad/refs/heads/main

curl -L -o run-full-squad.cmd %BASE_URL%/run-full-squad.cmd
curl -L -o docker-compose.yml %BASE_URL%/docker-compose.yml

call run-full-squad.cmd

del /f /q run-full-squad.cmd
del /f /q docker-compose.yml
rmdir /s /q build
