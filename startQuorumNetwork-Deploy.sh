#!/bin/bash

cd network/3-nodes-istanbul-tessera-docker-compose && docker-compose up -d
if ! command -v wget &> /dev/null
    then
        echo "${bold}Warning:${normal} wget isn't installed. Restart truffle e dapp manually once installed."
        exit 
    else
        echo "Waiting cakeshop to launch on 8999..."
        wget -q --spider --proxy=off http://localhost:8999/actuator/health
        echo "Cakeshop started successfully!"
    fi
cd ../../Truffle/	
truffle migrate --network development --reset