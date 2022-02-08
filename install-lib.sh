#!/bin/bash

echo "Installing Project dependencies.."
cd Truffle/ && npm i && npm install -g truffle@5.3.14
echo "Setting client"
cd ../Client && npm i
echo "Installazione avvenuta con successo!"
