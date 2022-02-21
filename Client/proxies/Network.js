const ProductFactoryABI = require('../../Truffle/build/contracts/ProductFactory.json');

class Network {
  constructor() {
    this.deploymentKey = Object.keys(ProductFactoryABI.networks)[0];
    this.ProductFactoryABI = ProductFactoryABI;
    var accounts = require('fs').readFileSync("./proxies/accounts.txt", 'utf-8').split('\n');
    this.produttore = accounts[0];
    this.fornitore = accounts[1];
    this.consumatore = accounts[2];
  }
}

const network = new Network();
Object.freeze(network);

exports.instance = network;
