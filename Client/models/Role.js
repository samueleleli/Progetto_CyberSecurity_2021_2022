//classe per l'assegnamento dei ruoli
const json= require('./../models/accounts.json'); 
class Role {
  constructor() {
      this.produttore = {address: json[0].address, node: json[0].node};
      this.fornitore = {address: json[1].address, node: json[1].node};
      this.consumatore = {address: json[2].address, node: json[2].node};
  }
}

module.exports = Role;