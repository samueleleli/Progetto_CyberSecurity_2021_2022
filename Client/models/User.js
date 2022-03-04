const Web3 = require('web3');
const ProductFactoryABI = require('../../Truffle/build/contracts/ProductFactory.json');
const Role = require ('./Role.js');

//classe per l'interfacciamento con la blockchain da parte dell'utente che estende 
//la classe Role che permette l'assegnazione dei ruoli
class User extends Role{
    constructor() {
      super();
      this.deploymentKey = Object.keys(ProductFactoryABI.networks)[0];
      this.ProductFactoryABI = ProductFactoryABI;
      
    }
  
    async salvaProdotto(product) {
      var nomiAttivita = [];
      var footprintAttivita = [];
      
      product.listaAttivita.forEach((attivita) => {
        nomiAttivita.push(attivita.nome);
        footprintAttivita.push(attivita.footprint);
      });
        return await this.productFactory.methods
            .inserisciProdotto(product.lotto.trim(), product.nome.trim(), product.lottiMateriePrime, nomiAttivita, footprintAttivita)
            .send({from: this.account.address});
        
    }
  
  async acquistaMateriaPrima(lotto) {
        return await this.productFactory.methods
            .compraMateriaPrima(lotto.trim())
            .send({from: this.account.address});
  }
  
  async setMateriaPrima(lotto, nome, footprint) {
    return await this.productFactory.methods 
        .inserisciMateriaPrima(lotto.trim(), nome.trim(), footprint.trim())
        .send({from: this.account.address});
  }
  
  async searchProdottoByLotto(lotto) {
     return await this.productFactory.methods
        .searchProdottoByLotto(lotto.trim())
        .call({from: this.account.address});
  }
  
  async searchMateriaPrimaByLotto(lotto) {
    return await this.productFactory.methods
        .searchMateriaPrimaByLotto(lotto.trim())
        .call({from: this.account.address});
  }
  
  async getWallet() {
    return await this.productFactory.methods
        .getWallet(this.account.address)
        .call({from: this.account.address});
  }
  
  async getNft(token) {
    return await this.productFactory.methods
        .getNft(token.trim())
        .call({from: this.account.address});
  }
  
  async getListaAttivitaMP(lotto){
    return await this.productFactory.methods
        .visualizzaAttivitaDiLavorazione(lotto)
        .call({from: this.account.address});
  }

  connect(){
    this.web3 = new Web3('http://localhost:2200'+this.account.node);  
    this.productFactory = new this.web3.eth.Contract(
      this.ProductFactoryABI.abi,
      this.ProductFactoryABI.networks[this.deploymentKey].address,
      {transactionConfirmationBlocks: 5},
    );
  }
  set changeAccount(address) {
    if(address===this.fornitore.address){this.account = this.fornitore}
    else if(address===this.produttore.address){this.account = this.produttore}
    else if(address===this.consumatore.address){this.account = this.consumatore}
    this.connect();
  }

  }

  const user = new User();
  exports.instance = user;


