#!/bin/bash

# STOP ->
echo "Stopping the quorum network..."
cd network/3-nodes-istanbul-tessera-docker-compose && docker-compose down
