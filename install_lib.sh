#!/bin/bash
echo "Installing Project dependencies.."

cd truffle
npm install -g truffle@5.3.14 && npm i  
cd ../Client && npm i
echo "installazione finita"
