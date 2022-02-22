const Web3 = require('web3');
const inquirer = require('inquirer');
const questions = require('./utility/menuQuestions.js');
const Network = require('./proxies/Network.js').instance;
const nftProcess = require('./utility/nftProcess.js');

let productFactory;
let account;
let web3;
let attivitaList = [];

const questionsMenuAccount = [
  {
    type: 'list',
    name: 'account',
    message: 'Login',
    choices: ['Fornitore - ' + Network.fornitore, 'Produttore - ' + Network.produttore, 'Consumatore - ' + Network.consumatore, 'EXIT'],
  },
];

askMenuPrincipale();

// menu

async function askMenuPrincipale() {
  inquirer.prompt(questionsMenuAccount).then((answers) => {
    switch (answers.account) {
      case 'Fornitore - ' + Network.fornitore:
        console.log('\nHai selezionato l\'account Fornitore, connessione al nodo in corso..\n');
        connect("1");
        account = Network.fornitore;
        menuFornitore();
        break;
      case 'Produttore - ' + Network.produttore:
        console.log('\nHai selezionato l\'account Produttore, connessione al nodo in corso..\n');
        connect("0");
        account = Network.produttore;
        menuProduttore();
        break;
      case 'Consumatore - ' + Network.consumatore:
        console.log('\nHai selezionato l\'account Consumatore, connessione al nodo in corso..\n');
        connect("2");
        account = Network.consumatore;
        menuConsumatore();
        break;
      case 'EXIT':
        return 0;
    }
  });
}

function menuFornitore() {
  // può caricare materia prima
  // può visualizzare nft, prodotti e materie prime

  inquirer.prompt(questions.questionsMenuFornitore).then((answers) => {
    switch (answers.decisioneForn) {
      case 'Inserisci Materia Prima':
        console.log('Inserisci dati della materia prima');
        inserisciMateriaPrima();

        break;
      case 'Cerca materia prima tramite il numero di lotto':
        visualizzaMateriaPrima();

        break;
      case 'Cerca prodotto tramite il numero di lotto':
        visualizzaProdotto();

        break;
      case 'Cerca NFT tramite token':
        visualizzaNFT();

        break;
      case 'Visualizza NFT posseduti':
        getWallet();
        break;
      case 'Logout':
        askMenuPrincipale();
        break;
    }
  });
}

function menuProduttore() {
  // può comprare materie prime
  // può inserire prodotti
  // può visualizzare nft, prodotti e materie prime
  inquirer.prompt(questions.questionsMenuProduttore).then((answers) => {
    switch (answers.decisioneProd) {
      case 'Inserisci Prodotto':
        console.log('\n PASSO 1: inserimento dei dati del prodotto: \n');
        inserisciProdotto();

        break;
      case 'Compra Materia Prima':
        compraMateriaPrima();

        break;
      case 'Cerca prodotto tramite il numero di lotto':
        visualizzaProdotto();

        break;
      case 'Cerca materia prima tramite il numero di lotto':
        visualizzaMateriaPrima();

        break;
      case 'Cerca NFT tramite token':
        visualizzaNFT();

        break;
      case 'Visualizza NFT posseduti':
        getWallet();
        break;

      case 'Logout':
        askMenuPrincipale();
        break;
    }
  });
}

function menuConsumatore() {
  // può visualizzare nft, prodotti e materie prime
  inquirer.prompt(questions.questionsMenuConsumatore).then((answers) => {
    switch (answers.decisioneCons) {
      case 'Cerca prodotto tramite il numero di lotto':
        visualizzaProdotto();

        break;
      case 'Cerca materia prima tramite il numero di lotto':
        visualizzaMateriaPrima();

        break;
      case 'Cerca NFT tramite token':
        visualizzaNFT();

        break;

      case 'Logout':
        askMenuPrincipale();
        break;
    }
  });
}

// END - menu

// funzioni locali

function inserisciMateriaPrima() {
  inquirer.prompt(questions.MPinserisciQuestions).then((answers) => {
    setMateriaPrima(answers.lotto, answers.nome, answers.footprint);
  });
}

function visualizzaMateriaPrima() {
  inquirer.prompt(questions.MPvisualizzaQuestions).then((answers) => {
    searchMateriaPrimaByLotto(answers.lotto).then(() => {
      goBackByAccount();
    });
  });
}
function visualizzaNFT() {
  inquirer.prompt(questions.NFTvisualizzaQuestions).then((answers) => {
    getNft(answers.token);
  });
}

function inserisciProdotto() {
  // inserimento attività
  inquirer.prompt(questions.PinserisciQuestions).then((answers) => {
    // lottiMateriePrime = answers.lottiMateriePrime+','
    const product = {
      lotto: answers.lotto,
      nome: answers.nomeProdotto,
      lottiMateriePrime: answers.lottiMateriePrime.replace(/\s/g, '').split(','),
      nomiAttivita: [],
      footprintAttivita: [],
    };
    console.log('\n PASSO 2: inserimento dei footprint delle attività: \n');
    inserisciA(product);
  });
}

function inserisciA(product) {
  // inserimento attività
  inquirer.prompt(questions.questionsMenuAttivita).then((answers) => {
    switch (answers.decisioneAttivita) {
      case 'Inserisci Nuova Attività':
        inserisciAttivita(product);

        break;
      case 'Visualizza tutte le Attività':
        console.log(attivitaList);
        inserisciA(product);
        break;

      case 'Conferma definitiva dell\'inserimento del prodotto':
        if (attivitaList.length === 0) {
          console.log('\n La lista delle attività è vuota! \n');
          inserisciA(product);
          break;
        }
        attivitaList.forEach((attivita) => {
          product.nomiAttivita.push(attivita.nome);
          product.footprintAttivita.push(attivita.footprint);
        });

        attivitaList = [];
        salvaProdotto(product);
        break;
      case 'Back':
        attivitaList = [];
        goBackByAccount();
        break;
    }
  });
}

function inserisciAttivita(product) {
  inquirer.prompt(questions.AttivitaQuestions).then((answers) => {
    attivitaList.push(
        {
          'nome': answers.nomeAttivita,
          'footprint': answers.footprintAttivita,
        },
    );
    inserisciA(product);
  });
}

function visualizzaProdotto() {
  inquirer.prompt(questions.MPvisualizzaQuestions).then((answers) => {
    searchProdottoByLotto(answers.lotto).then((find) => {
      if(find){
        var lotto = answers.lotto;
        inquirer.prompt(questions.attivitaConfirm).then((answers) => {
          if (answers.decisione) {
            return getListaAttivitaMP(lotto.trim());
          } else {
            goBackByAccount();
          }
        });
      } else{
        goBackByAccount();
      }
    });
  });
}

function compraMateriaPrima() {
  inquirer.prompt(questions.MPcompraQuestions).then((answers) => {
    searchMateriaPrimaByLotto(answers.lotto).then((find) => {
      const lotto = answers.lotto;
      if (find) {
        inquirer.prompt(questions.compraConfirm).then((answers) => {
          if (answers.decisione) {
            acquistaMateriaPrima('MP_' + lotto);
          } else {
            goBackByAccount();
          }
        });
      } else {
        goBackByAccount();
      }
    });
  });
}

// END - funzioni

// Interfacciamento con BlockChain

async function salvaProdotto(product) {
  await productFactory.methods
      .inserisciProdotto(product.lotto.trim(), product.nome.trim(), product.lottiMateriePrime, product.nomiAttivita, product.footprintAttivita)
      .send({from: account})
      .then((receipt) => {
        console.log(receipt);
        goBackByAccount();
      }).catch((err) => {
        console.log('Failed with error: ' + err);
        goBackByAccount();
      });
}

async function acquistaMateriaPrima(lotto) {
  await productFactory.methods
      .compraMateriaPrima(lotto.trim())
      .send({from: account})
      .then((receipt) => {
        console.log(receipt);
        goBackByAccount();
      }).catch((err) => {
        console.log('Failed with error: ' + err);
        goBackByAccount();
      });
}

async function setMateriaPrima(lotto, nome, footprint) {
  await productFactory.methods 
      .inserisciMateriaPrima(lotto.trim(), nome.trim(), footprint.trim())
      .send({from: account})
      .then((receipt) => {
        console.log(receipt);
        goBackByAccount();
      }).catch((err) => {
        console.log('Failed with error: ' + err);
        goBackByAccount();
      });
}

async function searchProdottoByLotto(lotto) {
   return await productFactory.methods
      .searchProdottoByLotto(lotto.trim())
      .call({from: account}).then((receipt) => {
        return nftProcess.printNft(receipt);
      }).catch((err) => {
        console.log('Failed with error: ' + err);
        goBackByAccount();
      });
}

async function searchMateriaPrimaByLotto(lotto) {
  return await productFactory.methods
      .searchMateriaPrimaByLotto(lotto.trim())
      .call({from: account}).then((receipt) => {
        return nftProcess.printNft(receipt);
      }).catch((err) => {
        console.log('Failed with error: ' + err);
        goBackByAccount();
      });
}

async function getWallet() {
  await productFactory.methods
      .getWallet(account)
      .call({from: account}).then((myNft) => {
        if (myNft.length === 0) {
          console.log('\nNON POSSIEDI NFT\n');
        } else {
          myNft.forEach((nft) => {
            nftProcess.printNft(nft);
          });
        }
        goBackByAccount();
      }).catch((err) => {
        console.log('Failed with error: ' + err);
        goBackByAccount();
      });
}

async function getNft(token) {
  await productFactory.methods
      .getNft(token.trim())
      .call({from: account}).then((receipt) => {
        nftProcess.printNft(receipt);
        goBackByAccount();
      }).catch((err) => {
        console.log('Failed with error: ' + err);
        goBackByAccount();
      });
}

async function getListaAttivitaMP(lotto){
  await productFactory.methods
      .visualizzaAttivitaDiLavorazione(lotto)
      .call({from: account}).then((receipt) => {
        nftProcess.printAttivita(receipt[0],receipt[1],receipt[2]);
        goBackByAccount();
      }).catch((err) => {
        console.log('Failed with error: ' + err);
        goBackByAccount();
      });
}

// END - Interfacciamento con BlockChain

// utility

function goBackByAccount() {
  switch (account) {
    case Network.fornitore:
      menuFornitore();
      break;
    case Network.produttore:
      menuProduttore();
      break;
    case Network.consumatore:
      menuConsumatore();
      break;
  }
}

function connect(n){
  web3 = new Web3('http://localhost:2200'+n);  
  productFactory = new web3.eth.Contract(
    Network.ProductFactoryABI.abi,
    Network.ProductFactoryABI.networks[Network.deploymentKey].address,
    {transactionConfirmationBlocks: 5},
  );

}

// END - utility
