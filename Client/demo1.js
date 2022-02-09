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

const questionsMenuAccount = [
    {
      type: "list",
      name: "account",
      message: "Seleziona il tuo account",
      choices: ["0xed9d02e382b34818e88B88a309c7fe71E65f419d", "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e", "0x0fBDc686b912d7722dc86510934589E0AAf3b55A","EXIT"]
    }
  ];
const questionsMenuFornitore = [
	{
      type: "list",
      name: "decisioneForn",
      message: "Azione",
      choices: ["Inserisci Materia Prima", "Visualizza Materia Prima in base al Lotto", "Visualizza Prodotto", "Visualizza NFT", "Back"]
    }
];
const questionsMenuProduttore = [
	{
      type: "list",
      name: "decisioneProd",
      message: "Azione",
      choices: ["Inserisci Prodotto", "Compra Materia Prima", "Visualizza Prodotto", "Visualizza Materia Prima", "Visualizza NFT", "Back"]
    }
];
const questionsMenuConsumatore = [
	{
      type: "list",
      name: "decisioneCons",
      message: "Azione",
      choices: ["Visualizza Prodotto", "Visualizza Materia Prima", "Visualizza NFT", "Back"]
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
		 case fornitore:
		        console.log("Hai selezionato l'account Fornitore, connessione al nodo in corso..");
				web3 = new Web3('http://localhost:22001');
				productFactory = new web3.eth.Contract(
				ProductFactoryABI.abi,
				ProductFactoryABI.networks[deploymentKey].address,
				{transactionConfirmationBlocks: 5}
				);
				account = fornitore;
				menuFornitore();
				
				
		        break;
		 case produttore:
				console.log("Hai selezionato l'account Produttore, connessione al nodo in corso..");
				web3 = new Web3('http://localhost:22000');
				productFactory = new web3.eth.Contract(
				ProductFactoryABI.abi,
				ProductFactoryABI.networks[deploymentKey].address,
				{transactionConfirmationBlocks: 5}
				);
				account = produttore;
				menuProduttore();
				
				
		        break;
		 case consumatore:
				console.log("Hai selezionato l'account Consumatore, connessione al nodo in corso..");
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
		 case "Visualizza Materia Prima in base al Lotto":
				MPvisualizza();
				
		        break;
		 case "Visualizza Prodotto":
				console.log("Hai selezionato l'account Consumatore");
				Pvisualizza();
				
		        break;
		case "Visualizza NFT":
				console.log("Hai selezionato l'account Consumatore");
				NFTvisualizza();
				
				break;
				
		 case "Back":
		        askMenuPrincipale();
				break;
	     case "EXIT":
		        return 0;
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
		        console.log("Hai selezionato l'account Fornitore");
				Pinserisci();
				
		        break;
		 case "Compra Materia Prima":
				console.log("Hai selezionato l'account Produttore");
				MPcompra();
				
		        break;	
		 case "Visualizza Prodotto":
				console.log("Hai selezionato l'account Produttore");
				Pvisualizza();
				
		        break;
		 case "Visualizza Materia Prima":
				console.log("Hai selezionato l'account Consumatore");
				MPvisualizza();
				
		        break;
		case "Visualizza NFT":
				console.log("Hai selezionato l'account Consumatore");
				NFTvisualizza();
				
				break;
				
		 case "Back":
		        askMenuPrincipale();
				break;
	     case "EXIT":
		        return 0;
		        break;
	 }
	});
	
	
}
function menuConsumatore(){
	//può visualizzare nft, prodotti e materie prime
		inquirer.prompt(questionsMenuConsumatore).then((answers) => {
    switch(answers.decisioneCons){
		 case "Visualizza Prodotto":
				console.log("Hai selezionato l'account Produttore");
				Pvisualizza();
				
		        break;
		 case "Visualizza Materia Prima":
				console.log("Hai selezionato l'account Consumatore");
				MPvisualizza();
				
		        break;
		case "Visualizza NFT":
				console.log("Hai selezionato l'account Consumatore");
				NFTvisualizza();
				
				break;
				
		 case "Back":
		        askMenuPrincipale();
				break;
	     case "EXIT":
		        return 0;
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
	 	searchMateriaPrimaByLotto(answers.lotto)
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
}

//funzioni da fare

function Pvisualizza(){
}
function MPcompra(){
}

//END - funzioni

//Interfacciamento con BlockChain

async function setMateriaPrima(lotto,nome, footprint){
	await productFactory.methods
        .inserisciMateriaPrima(lotto, nome,footprint)
        .send({ from: account})
        .then((receipt) => {
          console.log(receipt);
		  goBackByAccount()		  
		  
	});
}

async function searchMateriaPrimaByLotto(lotto){
	 await productFactory.methods
            .searchMateriaPrimaByLotto(lotto)
            .call({ from: account }).then((receipt) => {
				console.log(" ");
				console.log(receipt);
				result = toJson(receipt);
				printNft(result,"MATERIA PRIMA");
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
		  });
	
	
}	

//END - Interfacciamento con BlockChain

//utils


function printNft(nft,tipo){
	
	console.log(" ");
	if(nft.lotto==""){
		console.log(tipo+ " NON TROVATO!");
		return;
	}
	console.log(tipo);
	console.log(" ");
    console.log("Lotto: " + nft.lotto);
	console.log("Nome: " + nft.name);
	console.log("Footprint: " + nft.footprint);
	console.log(" ");
	
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

