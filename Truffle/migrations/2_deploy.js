const Web3 = require('web3');
const fs = require('fs');
var web3;
var accounts=[];

var ProductFactory = artifacts.require("ProductFactory");
var Base64 = artifacts.require("Base64");
var CarbonFootprint = artifacts.require("CarbonFootprint");

module.exports = async function (deployer) {
  var accountsData = [];    

  //ottengo gli address
  for (let i = 0; i < 3; i++) {
    web3 = new Web3('http://localhost:2200' + i);
    await web3.eth.getAccounts().then((value) => {
      accountsData.push({address: value[0], node: i});
    }).catch(() => {
      console.log("Si è verificato un errore!")
    });
  }

  fs.writeFileSync("../Client/models/accounts.json", JSON.stringify(accountsData));

  //deploy
  deployer.deploy(Base64)
  await deployer.deploy(CarbonFootprint,"Prodotti","PRD").then(function () {
    return deployer.deploy(ProductFactory,accountsData[0].address,accountsData[1].address,accountsData[2].address, CarbonFootprint.address).then(function (){
      web3 = new Web3('http://localhost:22001'); 
      let nftContract = new web3.eth.Contract(
          CarbonFootprint.abi,
          CarbonFootprint.address,
          {transactionConfirmationBlocks: 5},
      );
      //lo smart contract in questo modo può trasferire gli NFT
      return nftContract.methods
      .setApprovalForAll(ProductFactory.address,true)
      .send({from: accountsData[1].address}).then((receipt) => {
        console.log("MIGRAZIONE AVVENUTA CON SUCCESSO");
      }).catch((err) => {
        console.log('Failed with error: ' + err);
      });
    });
  })
  
       
      
}
