#!/bin/bash
open -a docker
sleep 30
cd network/3-nodes-istanbul-tessera-docker-compose 
docker-compose up -d
wget -q --spider --proxy=off http://localhost:8999/actuator/health
Echo "localhost pronta"



echo "deploy contratti in corso..."
cd ../..
cd Truffle
truffle migrate --network development --reset


