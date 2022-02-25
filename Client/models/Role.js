//classe per l'assegnamento dei ruoli
class Role {
  constructor() {
    var accounts = require('fs').readFileSync("./models/accounts.txt", 'utf-8').split('\n');
    this.produttore = accounts[0];
    this.fornitore = accounts[1];
    this.consumatore = accounts[2];
  }
}

module.exports = Role;