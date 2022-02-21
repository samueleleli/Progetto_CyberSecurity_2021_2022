class Network {
  constructor() {
    var accounts = require('fs').readFileSync("./proxies/accounts.txt", 'utf-8').split('\n');
    this.produttore = accounts[0];
    this.fornitore = accounts[1];
    this.consumatore = accounts[2];
  }

}

const network = new Network();
Object.freeze(network);

exports.instance = network;
