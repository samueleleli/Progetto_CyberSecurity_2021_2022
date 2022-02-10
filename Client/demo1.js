const Web3 = require('web3');
const ProductFactoryABI = require('./../Truffle/build/contracts/ProductFactory.json');
const inquirer = require("inquirer");
const output = [];
const deploymentKey = Object.keys(ProductFactoryABI.networks)[0];

var accounts = [];
var productFactory;
var account;
var web3; 
var produttore = "";
var fornitore = "";
var consumatore = "";
let attivitaList = [];

const NFTvisualizzaQuestions = [
  {
    type: 'number',
    name: 'token',
    message: "Inserisci il token da cercare",
  }

];
const MPvisualizzaQuestions = [
  {
    type: 'input',
    name: 'lotto',
    message: "Inserisci il numero di lotto da cercare",
  }
];
const MPinserisciQuestions = [
  {
    type: 'input',
    name: 'lotto',
    message: "Inserisci il numero di lotto",
  },
  {
    type: 'input',
    name: 'nome',
    message: "Inserisci il nome",
  },
  {
	 type: 'number',
	 name: 'footprint',
    message: "Inserisci il footprint della materia prima",
  },
];
const MPcompraQuestions = [
  {
    type: 'input',
    name: 'lotto',
    message: "Inserisci il numero di lotto da cercare",
  }
];
const PinserisciQuestions = [
  {
    type: 'input',
    name: 'lotto',
    message: "Inserisci il numero di lotto",
  },
  {
    type: 'input',
    name: 'nomeProdotto',
    message: "Inserisci il nome",
  },
  {
    type: 'input',
    name: 'lottiMateriePrime',
    message: "Inserisci i lotti delle materie prime utilizzate (devono essere separati da una virgola e con il prefisso MP_ - Esempio: MP_01, MP_02, MP_03)",
  },
];
const AttivitaQuestions = [ 
  {
    type: 'input',
    name: 'nomeAttivita',
    message: "Inserisci il nome dell'attività",
  },
  {
    type: 'number',
    name: 'footprintAttivita',
    message: "Inserisci il carbon footprint dell'attività",
  }
]
const compraConfirm = [
  {
    type: 'confirm',
    name: 'decisione',
    message: "Vuoi confermare l'acquisto?",
	default: false
  }
];

const questionsMenuAccount = [
    {
      type: "list",
      name: "account",
      message: "Seleziona il tuo account",
      choices: [ "Fornitore - 0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e","Produttore - 0xed9d02e382b34818e88B88a309c7fe71E65f419d", "Consumatore - 0x0fBDc686b912d7722dc86510934589E0AAf3b55A","EXIT"]
    }
  ];
const questionsMenuFornitore = [
	{
      type: "list",
      name: "decisioneForn",
      message: "Azione",
      choices: ["Inserisci Materia Prima", "Cerca materia prima tramite il numero di lotto", "Cerca prodotto tramite il numero di lotto", "Cerca prodotto/materia prima tramite token", "Logout"]
    }
];
const questionsMenuProduttore = [
	{
      type: "list",
      name: "decisioneProd",
      message: "Azione",
      choices: ["Inserisci Prodotto", "Compra Materia Prima", "Cerca prodotto tramite il numero di lotto", "Cerca materia prima tramite il numero di lotto", "Cerca prodotto/materia prima tramite token", "Logout"]
    }
];
const questionsMenuConsumatore = [
	{
      type: "list",
      name: "decisioneCons",
      message: "Azione",
      choices: ["Cerca prodotto tramite il numero di lotto", "Cerca materia prima tramite il numero di lotto", "Cerca prodotto/materia prima tramite token", "Logout"]
    }
];
const questionsMenuAttivita = [
	{
      type: "list",
      name: "decisioneAttivita",
      message: "Azione",
      choices: ["Inserisci Nuova Attività", "Visualizza tutte le Attività", "Conferma definitiva dell'inserimento del prodotto","Back"]
    }
];

askMenuPrincipale();
  
//menu

async function askMenuPrincipale() {
  for(let i = 0; i < 3; i++){
    web3 = new Web3('http://localhost:2200' + i);
    await web3.eth.getAccounts().then((value)=> {
		accounts.push(value[0]);
    }).catch(() => {
      console.log("Si è verificato un errore!")
    });
  }
  produttore = accounts[0];
  fornitore = accounts[1];
  consumatore = accounts[2];
  inquirer.prompt(questionsMenuAccount).then((answers) => {
    switch(answers.account){
		 case "Fornitore - "+fornitore:
		        console.log("\nHai selezionato l'account Fornitore, connessione al nodo in corso..\n");
				web3 = new Web3('http://localhost:22001');
				productFactory = new web3.eth.Contract(
				ProductFactoryABI.abi,
				ProductFactoryABI.networks[deploymentKey].address,
				{transactionConfirmationBlocks: 5}
				);
				account = fornitore;
				menuFornitore();
				
				
		        break;
		 case "Produttore - "+produttore:
				console.log("\nHai selezionato l'account Produttore, connessione al nodo in corso..\n");
				web3 = new Web3('http://localhost:22000');
				productFactory = new web3.eth.Contract(
				ProductFactoryABI.abi,
				ProductFactoryABI.networks[deploymentKey].address,
				{transactionConfirmationBlocks: 5}
				);
				account = produttore;
				menuProduttore();
				
				
		        break;
		 case "Consumatore - "+consumatore:
				console.log("\nHai selezionato l'account Consumatore, connessione al nodo in corso..\n");
				web3 = new Web3('http://localhost:22002');
				productFactory = new web3.eth.Contract(
				ProductFactoryABI.abi,
				ProductFactoryABI.networks[deploymentKey].address,
				{transactionConfirmationBlocks: 5}
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
function menuFornitore(){
	//può caricare materia prima
	//può visualizzare nft, prodotti e materie prime
	inquirer.prompt(questionsMenuFornitore).then((answers) => {
    switch(answers.decisioneForn){

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
		case "Cerca prodotto/materia prima tramite token":
				NFTvisualizza();
				
				break;
				
		 case "Logout":
		        askMenuPrincipale();
				break;
	 }
	});
	
	
	
}
function menuProduttore(){
    //può comprare materie prime
	//può inserire prodotti
	//può visualizzare nft, prodotti e materie prime
	inquirer.prompt(questionsMenuProduttore).then((answers) => {
    switch(answers.decisioneProd){
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
		case "Cerca prodotto/materia prima tramite token":
				NFTvisualizza();
				
				break;
				
		 case "Logout":
		        askMenuPrincipale();
				break;
	 }
	});
	
	
}
function menuConsumatore(){
	//può visualizzare nft, prodotti e materie prime
		inquirer.prompt(questionsMenuConsumatore).then((answers) => {
    switch(answers.decisioneCons){
		 case "Cerca prodotto tramite il numero di lotto":
				Pvisualizza();
				
		        break;
		 case "Cerca materia prima tramite il numero di lotto":
				MPvisualizza();
				
		        break;
		case "Cerca prodotto/materia prima tramite token":
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

//funzioni fatte

function MPinserisci(){
	inquirer.prompt(MPinserisciQuestions).then((answers) => {
	//mancano controlli sugli input
    setMateriaPrima(answers.lotto,answers.nome,answers.footprint)
});
}
function MPvisualizza(){
	inquirer.prompt(MPvisualizzaQuestions).then((answers) => {
	 	searchMateriaPrimaByLotto(answers.lotto).then(()=>{
			goBackByAccount();
		});
	});
}
function NFTvisualizza(){
	inquirer.prompt(NFTvisualizzaQuestions).then((answers) => {
		//mancano controlli sugli input
		getNft(answers.token)
	});
	
}

//funzioni in corso
function Pinserisci(){
	//inserimento attività
	inquirer.prompt(PinserisciQuestions).then((answers) => {
		
		
		//lottiMateriePrime = answers.lottiMateriePrime+','
		var product = {
			lotto: answers.lotto,
			nome: answers.nomeProdotto,
			lottiMateriePrime: answers.lottiMateriePrime.split(','),
			nomiAttivita: [],
			footprintAttivita: [],
		};
		console.log("\n PASSO 2: inserimento dei footprint delle attività: \n");
		Ainserisci(product);
	});

}



function Ainserisci(product){
	
	
	//inserimento attività
	inquirer.prompt(questionsMenuAttivita).then((answers) => {
		switch(answers.decisioneAttivita){
		 case "Inserisci Nuova Attività":
				inserisciAttivita(product);
				
		        break;
		 case "Visualizza tutte le Attività":
				console.log(attivitaList);
				Ainserisci(product);
		        break;	
		
		 case "Conferma definitiva dell'inserimento del prodotto":
				if(attivitaList.length == 0){
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

function inserisciAttivita(product){

	inquirer.prompt(AttivitaQuestions).then((answers) => {
		attivitaList.push(
		{
			"nome": answers.nomeAttivita,
			"footprint": answers.footprintAttivita,
		}
		);
		Ainserisci(product);
	});
	
}


function Pvisualizza(){
	inquirer.prompt(MPvisualizzaQuestions).then((answers) => {
	 	searchProdottoByLotto(answers.lotto).then(()=>{
			goBackByAccount();
		});
	});
   
}

function MPcompra(){
	inquirer.prompt(MPcompraQuestions).then((answers) => {
		//mancano controlli sugli input
		searchMateriaPrimaByLotto(answers.lotto).then((find)=>{
			var lotto = answers.lotto;
			if(find){
				inquirer.prompt(compraConfirm).then((answers) => {
					if(answers.decisione){
						acquistaMateriaPrima("MP_"+lotto);
					}
					else{
						goBackByAccount();
					}
				});
		 
			}	
			else{
				goBackByAccount();
			}
			});
		
	    	
		
	});
}

//END - funzioni

//Interfacciamento con BlockChain

async function salvaProdotto(product){

	await productFactory.methods
        .inserisciProdotto(product.lotto,product.nome,product.lottiMateriePrime,product.nomiAttivita,product.footprintAttivita)
        .send({ from: account})
        .then((receipt) => {
          console.log(receipt);
		  goBackByAccount();	  
		  
	}).catch((err) => {
		console.log("Failed with error: " + err);
		goBackByAccount();
	});
}


async function acquistaMateriaPrima(lotto){
	await productFactory.methods
        .compraMateriePrima([lotto])
        .send({ from: account})
        .then((receipt) => {
          console.log(receipt);
		  goBackByAccount();	  
		  
	}).catch((err) => {
		console.log("Failed with error: " + err);
		goBackByAccount();
	});
}

async function setMateriaPrima(lotto,nome, footprint){
	await productFactory.methods
        .inserisciMateriaPrima(lotto, nome,footprint)
        .send({ from: account})
        .then((receipt) => {
          console.log(receipt);
		  goBackByAccount()		  
		  
	}).catch((err) => {
		console.log("Failed with error: " + err);
		goBackByAccount();
	});
}

async function searchProdottoByLotto(lotto){
	  return await productFactory.methods
            .searchProdottoByLotto(lotto)
            .call({ from: account }).then((receipt) => {
				console.log(" ");
				console.log(receipt);
				result = toJson(receipt);
				return printNft(result,"PRODOTTO");
				
		  }).catch((err) => {
		console.log("Failed with error: " + err);
		goBackByAccount();
	});
	
}


async function searchMateriaPrimaByLotto(lotto){
	  return await productFactory.methods
            .searchMateriaPrimaByLotto(lotto)
            .call({ from: account }).then((receipt) => {
				console.log(" ");
				console.log(receipt);
				result = toJson(receipt);
				return printNft(result,"MATERIA PRIMA");
				
		  }).catch((err) => {
		console.log("Failed with error: " + err);
		goBackByAccount();
	});
	
}
async function getNft(token){
	let tickets = await productFactory.methods
            .getNft(token)
            .call({ from: account }).then((receipt) => {
				console.log(" ");
				console.log(receipt);
				result = toJson(receipt);
				if(result.lotto.charAt(0)=='M'){
					printNft(result,"MATERIA PRIMA");
				}
				else{
					printNft(result,"PRODOTTO");
				}

				goBackByAccount();
		  }).catch((err) => {
		console.log("Failed with error: " + err);
		goBackByAccount();
	});
	
	
}	

//END - Interfacciamento con BlockChain

//utility

function printNft(nft,tipo){
	
	if(nft.lotto==""){
		console.log("\n NFT NON TROVATO! \n");
		return false;
	}
	console.log("\n"+tipo);
    console.log("\nLotto: " + nft.lotto);
	console.log("Nome: " + nft.name);
	console.log("Footprint: " + nft.footprint+"\n");
	return true;
}	



function toJson(receipt){
	var json = atob(receipt.substring(29));
	return JSON.parse(json);
}

function goBackByAccount(){
	switch(account){
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