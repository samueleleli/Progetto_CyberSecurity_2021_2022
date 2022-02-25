const inquirer = require('inquirer'); //import della libreria inquirer
const questions = require('./utility/menuQuestions.js');  //import dei menu di navigazione
const nftProcess = require('./utility/nftProcess.js');  //import dei metodi per convertire i dati
const user = require('./models/User.js').instance;  //import del modello user per interfacciarsi con la blockchain

const questionsMenuAccount = [
  {
    type: 'list',
    name: 'account',
    message: 'Login',
    choices: ['Fornitore - ' + user.fornitore, 'Produttore - ' + user.produttore, 'Consumatore - ' + user.consumatore, 'EXIT'],
  },
];

let attivitaList = []; //vettore che contiene le attività di lavorazione del prodotto

askMenuPrincipale();

// START - menu

async function askMenuPrincipale() {
  inquirer.prompt(questionsMenuAccount).then((answers) => {
    switch (answers.account) {
      case 'Fornitore - ' + user.fornitore:
        console.log('\nHai selezionato l\'account Fornitore, connessione al nodo in corso..\n');
        user.connect("1");
        user.changeAccount = user.fornitore;
        menuFornitore();
        break;
      case 'Produttore - ' + user.produttore:
        console.log('\nHai selezionato l\'account Produttore, connessione al nodo in corso..\n');
        user.connect("0");
        user.changeAccount = user.produttore;
        menuProduttore();
        break;
      case 'Consumatore - ' + user.consumatore:
        console.log('\nHai selezionato l\'account Consumatore, connessione al nodo in corso..\n');
        user.connect("2");
        user.changeAccount = user.consumatore;
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
        user.getWallet().then((myNft) => {
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
        break;
      case 'Logout':
        user.changeAccount = "";
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
        user.getWallet().then((myNft) => {
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
        break;

      case 'Logout':
        user.changeAccount = "";
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
        user.changeAccount = "";
        askMenuPrincipale();
        break;
    }
  });
}

// END - menu

//START - menu Attività

function inserisciAMenu(product) {
  // inserimento attività
  inquirer.prompt(questions.questionsMenuAttivita).then((answers) => {
    switch (answers.decisioneAttivita) {
      case 'Inserisci Nuova Attività':
        inserisciAttivita(product);

        break;
      case 'Visualizza tutte le Attività':
        console.log(attivitaList);
        inserisciAMenu(product);
        break;

      case 'Conferma definitiva dell\'inserimento del prodotto':
        if (attivitaList.length === 0) {
          console.log('\n La lista delle attività è vuota! \n');
          inserisciAMenu(product);
          break;
        }
        attivitaList.forEach((attivita) => {
          product.nomiAttivita.push(attivita.nome);
          product.footprintAttivita.push(attivita.footprint);
        });

        attivitaList = [];
      
        user.salvaProdotto(product).then((receipt) => {
          console.log(receipt);
          goBackByAccount();
        }).catch((err) => {
          console.log('Failed with error: ' + err);
          goBackByAccount();
        });   

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
    inserisciAMenu(product);
  });
}


//END - menu Attività

//START - form di inserimento e ottenimento dati + interfacciamento blockchain tramite user

function inserisciMateriaPrima() {
  inquirer.prompt(questions.MPinserisciQuestions).then((answers) => {
    user.setMateriaPrima(answers.lotto, answers.nome, answers.footprint).then((receipt) => {
      console.log(receipt);
      goBackByAccount();
    }).catch((err) => {
      console.log('Failed with error: ' + err);
      goBackByAccount();
    });
  });
}

function visualizzaMateriaPrima() {
  inquirer.prompt(questions.MPvisualizzaQuestions).then((answers) => {
    user.searchMateriaPrimaByLotto(answers.lotto).then((receipt) => {
      return nftProcess.printNft(receipt);
    }).catch((err) => {
      console.log('Failed with error: ' + err);
      goBackByAccount();
    }).then(() => {
      goBackByAccount();
    });
  });
}

function visualizzaNFT() {
  inquirer.prompt(questions.NFTvisualizzaQuestions).then((answers) => {
    user.getNft(answers.token).then((receipt) => {
      nftProcess.printNft(receipt);
      goBackByAccount();
    }).catch((err) => {
      console.log('Failed with error: ' + err);
      goBackByAccount();
    });
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
    inserisciAMenu(product);
  });
}


function visualizzaProdotto() {
  inquirer.prompt(questions.MPvisualizzaQuestions).then((answers) => {
    user.searchProdottoByLotto(answers.lotto).then((receipt) => {
      return nftProcess.printNft(receipt)
    }).catch((err) => {
      console.log('Failed with error: ' + err);
      goBackByAccount();
    }).then((find) => {
      if(find){
        var lotto = answers.lotto;
        inquirer.prompt(questions.attivitaConfirm).then((answers) => {
          if (answers.decisione) {
            return user.getListaAttivitaMP(lotto.trim()).then((receipt) => {
              nftProcess.printAttivita(receipt[0],receipt[1],receipt[2]);
              goBackByAccount();
            }).catch((err) => {
              console.log('Failed with error: ' + err);
              goBackByAccount();
            });
          } else {
            goBackByAccount();
          }
        });
      } else{
        goBackByAccount();
      }
    });
  })
}

function compraMateriaPrima() {
  inquirer.prompt(questions.MPcompraQuestions).then((answers) => {
    user.searchMateriaPrimaByLotto(answers.lotto).then((receipt) => {
      return nftProcess.printNft(receipt);
    }).catch((err) => {
      console.log('Failed with error: ' + err);
      goBackByAccount();
    }).then((find) => {
      const lotto = answers.lotto;
      if (find) {
        inquirer.prompt(questions.compraConfirm).then((answers) => {
          if (answers.decisione) {
            user.acquistaMateriaPrima('MP_' + lotto).then((receipt) => {
              console.log(receipt);
              goBackByAccount();
            }).catch((err) => {
              console.log('Failed with error: ' + err);
              goBackByAccount();
            });          
          } 
            else {
            goBackByAccount();
          }
        });
      } else {
        goBackByAccount();
      }
    });
  });
}

// END - form di inserimento e ottenimento dati + interfacciamento blockchain tramite user

// utility

function goBackByAccount() {
  switch (user.account) {
    case user.fornitore:
      menuFornitore();
      break;
    case user.produttore:
      menuProduttore();
      break;
    case user.consumatore:
      menuConsumatore();
      break;
  }
}

// END - utility
