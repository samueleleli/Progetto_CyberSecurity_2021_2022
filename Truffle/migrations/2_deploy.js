const Web3 = require('web3');
const fs = require('fs');
var web3;
var accounts=[];

var ProductFactory = artifacts.require("ProductFactory");
var Base64 = artifacts.require("Base64");
var CarbonFootprint = artifacts.require("CarbonFootprint");

module.exports = async function (deployer) {
  fs.writeFileSync("../Client/models/accounts.txt","");
    
  //ottengo gli address
  for (let i = 0; i < 3; i++) {
    web3 = new Web3('http://localhost:2200' + i);
    await web3.eth.getAccounts().then((value) => {
      accounts.push(value[0]);
        fs.writeFileSync("../Client/models/accounts.txt", value[0] + "\n", {
        encoding: "utf8",
        flag: "a+",
        mode: 0o666
      });
    }).catch(() => {
      console.log("Si è verificato un errore!")
    });
  }

 

  //deploy
  deployer.deploy(Base64)
  await deployer.deploy(CarbonFootprint,"Prodotti","PRD").then(function () {
    return deployer.deploy(ProductFactory,accounts[0],accounts[1],accounts[2], CarbonFootprint.address).then(function (){
      web3 = new Web3('http://localhost:22001'); 
      let nftContract = new web3.eth.Contract(
          CarbonFootprint.abi,
          CarbonFootprint.address,
          {transactionConfirmationBlocks: 5},
      );
      //lo smart contract in questo modo può trasferire gli NFT
      return nftContract.methods
      .setApprovalForAll(ProductFactory.address,true)
      .send({from: accounts[1]}).then((receipt) => {
        console.log("MIGRAZIONE AVVENUTA CON SUCCESSO");
      }).catch((err) => {
        console.log('Failed with error: ' + err);
      });
    });
  })
  
       
      
}
