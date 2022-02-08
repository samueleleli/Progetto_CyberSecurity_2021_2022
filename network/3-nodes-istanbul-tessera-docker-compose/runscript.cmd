@ECHO OFF
SETLOCAL
if "%1"=="" (
  echo Please provide a valid script file to execute as the first parameter (i.e. private_contract.js^) && EXIT /B 1
)
if NOT EXIST %1 (
  echo Please provide a valid script file to execute as the first parameter (i.e. private_contract.js^) && EXIT /B 1
)
FOR /F "tokens=* USEBACKQ" %%g IN (`docker-compose ps -q node1`) DO set DOCKER_CONTAINER=%%g
docker cp %1 %DOCKER_CONTAINER%:/%1
docker-compose exec node1 /bin/sh -c "geth --exec 'loadScript(\"%1\")' attach qdata/dd/geth.ipc"

