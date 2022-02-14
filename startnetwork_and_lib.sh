#!/bin/bash
open -a docker
sleep 30
cd network/3-nodes-istanbul-tessera-docker-compose 
docker-compose up -d
wget -q --spider --proxy=off http://localhost:8999/actuator/health
Echo "localhost pronta"

echo "Installing Project dependencies.."
cd ../..

cd truffle
npm install -g truffle@5.3.14 && npm i  
../Client && npm i
echo "installazione finita"

echo "deploy contratti in corso..."
cd ..
cd Truffle
truffle migrate --network development --reset


