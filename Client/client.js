const inquirer = require('inquirer'); //import della libreria inquirer
const questions = require('./utility/menuQuestions.js');  //import dei menu di navigazione
const nftProcess = require('./utility/nftProcess.js');  //import dei metodi per convertire i dati
const user = require('./models/User.js').instance;  //import del modello user per interfacciarsi con la blockchain

const questionsMenuAccount = [
  {
    type: 'list',
    name: 'account',
    message: 'Login',
    choices: ['Fornitore - ' + user.fornitore.address, 'Produttore - ' + user.produttore.address, 'Consumatore - ' + user.consumatore.address, 'EXIT'],
  },
];

// START - menu

async function askMenuPrincipale() {
  inquirer.prompt(questionsMenuAccount).then((answers) => {
    switch (answers.account) {
      case 'Fornitore - ' + user.fornitore.address:
        console.log('\nHai selezionato l\'account Fornitore, connessione al nodo in corso..\n');
        user.changeAccount = user.fornitore.address;
        menuFornitore();
        break;
      case 'Produttore - ' + user.produttore.address:
        console.log('\nHai selezionato l\'account Produttore, connessione al nodo in corso..\n');
        user.changeAccount = user.produttore.address;
        menuProduttore();
        break;
      case 'Consumatore - ' + user.consumatore.address:
        console.log('\nHai selezionato l\'account Consumatore, connessione al nodo in corso..\n');
        user.changeAccount = user.consumatore.address;
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
      case 'Cerca materia prima tramite il codice di lotto':
        visualizzaMateriaPrima();
        break;
      case 'Cerca prodotto tramite il codice di lotto':
        visualizzaProdotto();
        break;
      case 'Cerca NFT tramite ID':
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
      case 'Cerca prodotto tramite il codice di lotto':
        visualizzaProdotto();
        break;
      case 'Cerca materia prima tramite il codice di lotto':
        visualizzaMateriaPrima();
        break;
      case 'Cerca NFT tramite ID':
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
      case 'Cerca prodotto tramite il codice di lotto':
        visualizzaProdotto();
        break;
      case 'Cerca materia prima tramite il codice di lotto':
        visualizzaMateriaPrima();
        break;
      case 'Cerca NFT tramite ID':
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
        console.log(product.listaAttivita);
        inserisciAMenu(product);
        break;

      case 'Conferma definitiva dell\'inserimento del prodotto':
        if (product.listaAttivita.length === 0) {
          console.log('\n La lista delle attività è vuota! \n');
          inserisciAMenu(product);
          break;
        }
        
        user.salvaProdotto(product).then((receipt) => {
          console.log(receipt);
          goBackByAccount();
        }).catch((err) => {
          console.log('Failed with error: ' + err);
          product.listaAttivita = [];
          goBackByAccount();
        });   

        break;
      case 'Back':
        product.listaAttivita = [];
        goBackByAccount();
        break;
    }
  });
}

function inserisciAttivita(product) {
  inquirer.prompt(questions.AttivitaQuestions).then((answers) => {
    product.listaAttivita.push(
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
    var product = {
      lotto: answers.lotto,
      nome: answers.nomeProdotto,
      lottiMateriePrime: answers.lottiMateriePrime.replace(/\s/g, '').split(','),
      listaAttivita: [],
    };
    console.log('\n PASSO 2: inserimento e gestione delle attività di lavorazione: \n');
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
  switch (user.account.address) {
    case user.fornitore.address:
      menuFornitore();
      break;
    case user.produttore.address:
      menuProduttore();
      break;
    case user.consumatore.address:
      menuConsumatore();
      break;
  }
}

// END - utility

askMenuPrincipale();

