set BASE_URL=https://raw.githubusercontent.com/vulinh64/spring-base-squad/refs/heads/main
set CMD_FILE=run-full-squad-full-stack.cmd
set DOCKER_COMPOSE_FILE=docker-compose-full-stack.yml

curl -L -o %CMD_FILE% %BASE_URL%/%CMD_FILE%
curl -L -o %DOCKER_COMPOSE_FILE% %BASE_URL%/%DOCKER_COMPOSE_FILE%

if exist build rmdir /s /q build

call %CMD_FILE%

del /f /q %CMD_FILE%
del /f /q %DOCKER_COMPOSE_FILE%
if exist build rmdir /s /q build