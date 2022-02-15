const Web3 = require('web3');
const ProductFactoryABI = require('../Truffle/build/contracts/ProductFactory.json');
const inquirer = require("inquirer");
const deploymentKey = Object.keys(ProductFactoryABI.networks)[0];
var questions = require('./utility/menuQuestions.js');

var productFactory;
var account;
var web3;
var produttore = "";
var fornitore = "";
var consumatore = "";
let attivitaList = [];
let questionsMenuAccount;

getAccounts();

//ottieni account e accedi al menu
async function getAccounts() {
	var accounts = [];
	for (let i = 0; i < 3; i++) {
		web3 = new Web3('http://localhost:2200' + i);
		await web3.eth.getAccounts().then((value) => {
			accounts.push(value[0]);
		}).catch(() => {
			console.log("Si è verificato un errore!")
		});
	}
	
	produttore = accounts[0];
	fornitore = accounts[1];
	consumatore = accounts[2];
	
	questionsMenuAccount = [
        {
            type: "list",
            name: "account",
            message: "Login",
            choices: ["Fornitore - " + fornitore,"Produttore - " + produttore,"Consumatore - " + consumatore,"EXIT"]
        }
    ];
	askMenuPrincipale();
}


//menu

async function askMenuPrincipale() {

	inquirer.prompt(questionsMenuAccount).then((answers) => {
		switch (answers.account) {
			case "Fornitore - " + fornitore:
				console.log("\nHai selezionato l'account Fornitore, connessione al nodo in corso..\n");
				web3 = new Web3('http://localhost:22001');
				productFactory = new web3.eth.Contract(
					ProductFactoryABI.abi,
					ProductFactoryABI.networks[deploymentKey].address,
					{ transactionConfirmationBlocks: 5 }
				);
				account = fornitore;
				menuFornitore();


				break;
			case "Produttore - " + produttore:
				console.log("\nHai selezionato l'account Produttore, connessione al nodo in corso..\n");
				web3 = new Web3('http://localhost:22000');
				productFactory = new web3.eth.Contract(
					ProductFactoryABI.abi,
					ProductFactoryABI.networks[deploymentKey].address,
					{ transactionConfirmationBlocks: 5 }
				);
				account = produttore;
				menuProduttore();


				break;
			case "Consumatore - " + consumatore:
				console.log("\nHai selezionato l'account Consumatore, connessione al nodo in corso..\n");
				web3 = new Web3('http://localhost:22002');
				productFactory = new web3.eth.Contract(
					ProductFactoryABI.abi,
					ProductFactoryABI.networks[deploymentKey].address,
					{ transactionConfirmationBlocks: 5 }
				);
				account = consumatore;
				menuConsumatore();


				break;
			case "EXIT":
				return 0;
				break;
		}
	});
}

function menuFornitore() {
	//può caricare materia prima
	//può visualizzare nft, prodotti e materie prime

	inquirer.prompt(questions.questionsMenuFornitore).then((answers) => {
		switch (answers.decisioneForn) {

			case "Inserisci Materia Prima":
				console.log("Inserisci dati della materia prima");
				MPinserisci();

				break;
			case "Cerca materia prima tramite il numero di lotto":
				MPvisualizza();

				break;
			case "Cerca prodotto tramite il numero di lotto":
				Pvisualizza();

				break;
			case "Cerca NFT tramite token":
				NFTvisualizza();

				break;
			case "Visualizza NFT posseduti":
				getWallet();
				break;	
			case "Logout":
				askMenuPrincipale();
				break;
		}
	});
}

function menuProduttore() {
	//può comprare materie prime
	//può inserire prodotti
	//può visualizzare nft, prodotti e materie prime
	inquirer.prompt(questions.questionsMenuProduttore).then((answers) => {
		switch (answers.decisioneProd) {
			case "Inserisci Prodotto":
				console.log("\n PASSO 1: inserimento dei dati del prodotto: \n");
				Pinserisci();

				break;
			case "Compra Materia Prima":
				MPcompra();

				break;
			case "Cerca prodotto tramite il numero di lotto":
				Pvisualizza();

				break;
			case "Cerca materia prima tramite il numero di lotto":
				MPvisualizza();

				break;
			case "Cerca NFT tramite token":
				NFTvisualizza();

				break;
			case "Visualizza NFT posseduti":
				getWallet();
				break;	

			case "Logout":
				askMenuPrincipale();
				break;
		}
	});


}

function menuConsumatore() {
	//può visualizzare nft, prodotti e materie prime
	inquirer.prompt(questions.questionsMenuConsumatore).then((answers) => {
		switch (answers.decisioneCons) {
			case "Cerca prodotto tramite il numero di lotto":
				Pvisualizza();

				break;
			case "Cerca materia prima tramite il numero di lotto":
				MPvisualizza();

				break;
			case "Cerca NFT tramite token":
				NFTvisualizza();

				break;

			case "Logout":
				askMenuPrincipale();
				break;
		}
	});

}

//END - menu

//funzioni locali

function MPinserisci() {
	inquirer.prompt(questions.MPinserisciQuestions).then((answers) => {
		setMateriaPrima(answers.lotto, answers.nome, answers.footprint)
	});
}

function MPvisualizza() {
	inquirer.prompt(questions.MPvisualizzaQuestions).then((answers) => {
		searchMateriaPrimaByLotto(answers.lotto).then(() => {
			goBackByAccount();
		});
	});
}
function NFTvisualizza() {
	inquirer.prompt(questions.NFTvisualizzaQuestions).then((answers) => {
		getNft(answers.token)
	});

}

function Pinserisci() {
	//inserimento attività
	inquirer.prompt(questions.PinserisciQuestions).then((answers) => {


		//lottiMateriePrime = answers.lottiMateriePrime+','
		var product = {
			lotto: answers.lotto,
			nome: answers.nomeProdotto,
			lottiMateriePrime: answers.lottiMateriePrime.replace(/\s/g, '').split(','),
			nomiAttivita: [],
			footprintAttivita: [],
		};
		console.log("\n PASSO 2: inserimento dei footprint delle attività: \n");
		Ainserisci(product);
	});

}

function Ainserisci(product) {

	//inserimento attività
	inquirer.prompt(questions.questionsMenuAttivita).then((answers) => {
		switch (answers.decisioneAttivita) {
			case "Inserisci Nuova Attività":
				inserisciAttivita(product);

				break;
			case "Visualizza tutte le Attività":
				console.log(attivitaList);
				Ainserisci(product);
				break;

			case "Conferma definitiva dell'inserimento del prodotto":
				if (attivitaList.length == 0) {
					console.log("\n La lista delle attività è vuota! \n");
					Ainserisci(product);
					break;
				}
				attivitaList.forEach(attivita => {
					product.nomiAttivita.push(attivita.nome);
					product.footprintAttivita.push(attivita.footprint);
				});

				attivitaList = [];
				salvaProdotto(product);
				break;
			case "Back":
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
				"nome": answers.nomeAttivita,
				"footprint": answers.footprintAttivita,
			}
		);
		Ainserisci(product);
	});

}

function Pvisualizza() {
	inquirer.prompt(questions.MPvisualizzaQuestions).then((answers) => {
		searchProdottoByLotto(answers.lotto).then(() => {
			goBackByAccount();
		});
	});

}

function MPcompra() {
	inquirer.prompt(questions.MPcompraQuestions).then((answers) => {
		searchMateriaPrimaByLotto(answers.lotto).then((find) => {
			var lotto = answers.lotto;
			if (find) {
				inquirer.prompt(questions.compraConfirm).then((answers) => {
					if (answers.decisione) {
						acquistaMateriaPrima("MP_" + lotto);
					}
					else {
						goBackByAccount();
					}
				});

			}
			else {
				goBackByAccount();
			}
		});
	});
}

//END - funzioni

//Interfacciamento con BlockChain

async function salvaProdotto(product) {

	await productFactory.methods
		.inserisciProdotto(product.lotto.trim(), product.nome.trim(), product.lottiMateriePrime, product.nomiAttivita, product.footprintAttivita)
		.send({ from: account })
		.then((receipt) => {
			console.log(receipt);
			goBackByAccount();

		}).catch((err) => {
			console.log("Failed with error: " + err);
			goBackByAccount();
		});
}

async function acquistaMateriaPrima(lotto) {
	await productFactory.methods
		.compraMateriaPrima(lotto.trim())
		.send({ from: account })
		.then((receipt) => {
			console.log(receipt);
			goBackByAccount();

		}).catch((err) => {
			console.log("Failed with error: " + err);
			goBackByAccount();
		});
}

async function setMateriaPrima(lotto, nome, footprint) {
	await productFactory.methods
		.inserisciMateriaPrima(lotto.trim(), nome.trim(), footprint.trim())
		.send({ from: account })
		.then((receipt) => {
			console.log(receipt);
			goBackByAccount()

		}).catch((err) => {
			console.log("Failed with error: " + err);
			goBackByAccount();
		});
}

async function searchProdottoByLotto(lotto) {
	return await productFactory.methods
		.searchProdottoByLotto(lotto.trim())
		.call({ from: account }).then((receipt) => {

			return printNft(receipt);

		}).catch((err) => {
			console.log("Failed with error: " + err);
			goBackByAccount();
		});

}

async function searchMateriaPrimaByLotto(lotto) {
	return await productFactory.methods
		.searchMateriaPrimaByLotto(lotto.trim())
		.call({ from: account }).then((receipt) => {

			return printNft(receipt);

		}).catch((err) => {
			console.log("Failed with error: " + err);
			goBackByAccount();
		});

}

async function getWallet(){
	await productFactory.methods
		.getWallet(account)
		.call({ from: account }).then((myNft) => {
			if(myNft.length == 0){
				console.log("\nNON POSSIEDI NFT\n");
			} else{
			myNft.forEach(nft => {
				printNft(nft);
			});
			}
			goBackByAccount();
		}).catch((err) => {
			console.log("Failed with error: " + err);
			goBackByAccount();
		});


}

async function getNft(token) {
	await productFactory.methods
		.getNft(token.trim())
		.call({ from: account }).then((receipt) => {
			printNft(receipt);
			goBackByAccount();
		}).catch((err) => {
			console.log("Failed with error: " + err);
			goBackByAccount();
		});


}

//END - Interfacciamento con BlockChain

//utility

function printNft(nftBase64) {
	var nft = toJson(nftBase64);
	var tipo="";

	if (nft.lotto.charAt(0) == 'M') {
		tipo = "MATERIA PRIMA"
	}
	else if(nft.lotto.charAt(0) == 'P'){
		tipo = "PRODOTTO";
	}
	else {
		console.log("\nNFT NON TROVATO! \n");
		return false;
	}

	console.log("\n" + tipo);
	console.log("\nData URL: "+nftBase64);
	console.log("\nLotto: " + nft.lotto);
	console.log("Nome: " + nft.name);
	console.log("Footprint: " + nft.footprint + "\n");
	return true;
}

function toJson(receipt) {
	var json = atob(receipt.substring(29));
	return JSON.parse(json);
}

function goBackByAccount() {
	switch (account) {
		case fornitore:
			menuFornitore();
			break;
		case produttore:
			menuProduttore();
			break;
		case consumatore:
			menuConsumatore();
			break;
	}
}

//END - utility