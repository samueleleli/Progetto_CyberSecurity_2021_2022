@ECHO OFF
SETLOCAL
SET NUMBER_OF_NODES=3
SET /A NODE_NUMBER=%1

if "%1"=="" (
    echo Please provide the number of the node to attach to (i.e. attach.cmd 2^) && EXIT /B 1
)

if %NODE_NUMBER% EQU 0 (
    echo Please provide the number of the node to attach to (i.e. attach.cmd 2^) && EXIT /B 1
)

if %NODE_NUMBER% GEQ %NUMBER_OF_NODES%+1 (
    echo %1 is not a valid node number. Must be between 1 and %NUMBER_OF_NODES%. && EXIT /B 1
)
docker-compose exec node%NODE_NUMBER% /bin/sh -c "geth attach qdata/dd/geth.ipc"