const Web3 = require('web3');

class Provider {
  constructor() {
    this.web3 = new Web3('http://localhost:22000');
  }
}

exports.provider = Provider;