const Web3 = require('web3');
var web3;
var accounts=[];

var ProductFactory = artifacts.require("ProductFactory");
var Base64 = artifacts.require("Base64");
var CarbonFootprint = artifacts.require("CarbonFootprint");

module.exports = async function (deployer) {

  //ottengo gli address
  for (let i = 0; i < 3; i++) {
    web3 = new Web3('http://localhost:2200' + i);
    await web3.eth.getAccounts().then((value) => {
      accounts.push(value[0]);
    }).catch(() => {
      console.log("Si è verificato un errore!")
    });
  }

  //deploy
  deployer.deploy(Base64)
  await deployer.deploy(CarbonFootprint,"Prodotti","PRD").then(function () {
    return deployer.deploy(ProductFactory,accounts[0],accounts[1],accounts[2], CarbonFootprint.address);
  })
}
