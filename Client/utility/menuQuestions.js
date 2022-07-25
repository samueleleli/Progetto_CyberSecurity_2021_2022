//contenitore delle voci dei vari menu utilizzati nella Dapp + validazione e sanificazione degli input
module.exports = {
    NFTvisualizzaQuestions: [
        {
            type: 'input',
            name: 'token',
            message: "Inserisci l'ID del token da cercare",
            validate: (answer) => checkIfInputIsNumber(answer)
        }

    ],
    MPvisualizzaQuestions: [
        {
            type: 'input',
            name: 'lotto',
            message: "Inserisci il codice di lotto da cercare",
            validate: (answer) => checkIfInputContainsBlank(answer),
        }
    ],
    MPinserisciQuestions: [
        {
            type: 'input',
            name: 'lotto',
            message: "Inserisci il codice di lotto",
            validate: (answer) => checkJsonValid(answer),
        },
        {
            type: 'input',
            name: 'nome',
            message: "Inserisci il nome",
            validate: (answer) => checkIfInputIsBlankOrNull(answer),
        },
        {
            type: 'input',
            name: 'footprint',
            message: "Inserisci il footprint della materia prima",
            validate: (answer) => checkIfInputIsNumber(answer),
        },
    ],
    MPcompraQuestions: [
        {
            type: 'input',
            name: 'lotto',
            message: "Inserisci il codice di lotto da comprare",
            validate: (answer) => checkIfInputContainsBlank(answer),
        }
    ],
    PinserisciQuestions: [
        {
            type: 'input',
            name: 'lotto',
            message: "Inserisci il codice di lotto",
            validate: (answer) => checkJsonValid(answer),
        },
        {
            type: 'input',
            name: 'nomeProdotto',
            message: "Inserisci il nome",
            validate: (answer) => checkIfInputIsBlankOrNull(answer),
        },
        {
            type: 'input',
            name: 'lottiMateriePrime',
            message: "Inserisci i codici di lotto delle materie prime utilizzate (Esempio formattazione: MP_01,MP_02,MP_03)",
            validate: (answer) => {
                answer.replace(/\s/g, '');
                if (!(/^MP_\w+(,MP_\w+)*$/.test(answer))) {
                    return "Errore di formattazione";
                }
                return checkIfInputContainsBlank(answer);
            }

        },
    ],
    AttivitaQuestions: [
        {
            type: 'input',
            name: 'nomeAttivita',
            message: "Inserisci il nome dell'attività",
            validate: (answer) => checkIfInputIsBlankOrNull(answer),
        },
        {
            type: 'input',
            name: 'footprintAttivita',
            message: "Inserisci il carbon footprint dell'attività",
            validate: (answer) => checkIfInputIsNumber(answer),
        }
    ],
    compraConfirm: [
        {
            type: 'confirm',
            name: 'decisione',
            message: "Vuoi confermare l'acquisto?",
            default: false
        }
    ],
    attivitaConfirm: [
        {
            type: 'confirm',
            name: 'decisione',
            message: "Vuoi visualizzare anche le attività di lavorazione e le materie prime utilizzate?",
            default: true
        }
    ],

    questionsMenuFornitore: [
        {
            type: "list",
            name: "decisioneForn",
            message: "Azione",
            choices: ["Inserisci Materia Prima", "Cerca materia prima tramite il codice di lotto", "Cerca prodotto tramite il codice di lotto", "Cerca NFT tramite ID","Visualizza NFT posseduti","Logout"]
        }
    ],
    questionsMenuProduttore: [
        {
            type: "list",
            name: "decisioneProd",
            message: "Azione",
            choices: ["Inserisci Prodotto", "Compra Materia Prima", "Cerca prodotto tramite il codice di lotto", "Cerca materia prima tramite il codice di lotto", "Cerca NFT tramite ID","Visualizza NFT posseduti","Logout"]
        }
    ],
    questionsMenuConsumatore: [
        {
            type: "list",
            name: "decisioneCons",
            message: "Azione",
            choices: ["Cerca prodotto tramite il codice di lotto", "Cerca materia prima tramite il codice di lotto", "Cerca NFT tramite ID", "Logout"]
        }
    ],
    questionsMenuAttivita: [
        {
            type: "list",
            name: "decisioneAttivita",
            message: "Azione",
            choices: ["Inserisci Nuova Attività", "Visualizza tutte le Attività", "Conferma definitiva dell'inserimento del prodotto", "Back"]
        }
    ],
}

function checkJsonValid(lotto){
    let check = checkIfInputContainsBlank(lotto)
    if(check===true){
        try {
            if(lotto.includes('"') || lotto.includes("'") || lotto.includes("\\")) return "Caratteri inseriti non validi";
            let str = '{"lotto":'+'"'+lotto+'"}' 
            JSON.parse(str);
        } catch (e) {
            return "Caratteri inseriti non validi";
        }
        return true;
    }
    return check
    
}

function checkIfInputContainsBlank(answer){
    if (answer === null || answer == '' || /\s/g.test(answer)){
        return "Il codice di lotto non può contene il carattere space"
    }
    return true;
}


function checkIfInputIsBlankOrNull(answer) {
    if (answer === null || answer == '' || /^\s+$/.test(answer)) {
        return "Stringa non valida";
    }
    if (answer.charAt(0) == " ") {
        return "Stringa non può iniziare con il carattere space"
    }
    return true;
}

function checkIfInputIsNumber(answer) {
    if(answer.toString().indexOf('.') != -1 || answer.toString().indexOf('-') != -1){
        return "E' possibile inserire solo valori interi positivi";
    }

    if (isNaN(answer) || answer === null || answer == '' || /^\s+$/.test(answer)) {
        return "Per favore inserisci un numero";
    }
    return true;

}