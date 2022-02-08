const Provider = require('./Provider');
const Web3 = require('web3');
const ProductFactoryABI = require('../contracts/ProductFactory.json');

class ProductFactory {
  constructor() {
    const web3 = new Web3('http://localhost:22001');
    const deploymentKey = Object.keys(ProductFactoryABI.networks)[0];

    this.instance = new web3.eth.Contract(
      ProductFactoryABI.abi,
      ProductFactoryABI.networks[deploymentKey].address,
      {transactionConfirmationBlocks: 5}
    );
  }

  getInstance = () => this.instance;
}

const productFactory = new ProductFactory();
Object.freeze(productFactory);

exports.instance = productFactory.getInstance();
