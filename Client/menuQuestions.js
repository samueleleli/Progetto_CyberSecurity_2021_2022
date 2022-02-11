module.exports = {
    NFTvisualizzaQuestions: [
        {
            type: 'input',
            name: 'token',
            message: "Inserisci il token da cercare",
            validate: (answer) => checkIfInputIsNumber(answer)
        }

    ],
    MPvisualizzaQuestions: [
        {
            type: 'input',
            name: 'lotto',
            message: "Inserisci il numero di lotto da cercare",
            validate: (answer) => checkIfInputIsBlankOrNull(answer),
        }
    ],
    MPinserisciQuestions: [
        {
            type: 'input',
            name: 'lotto',
            message: "Inserisci il numero di lotto",
            validate: (answer) => checkIfInputIsBlankOrNull(answer),
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
            message: "Inserisci il numero di lotto da comprare",
            validate: (answer) => checkIfInputIsBlankOrNull(answer),
        }
    ],
    PinserisciQuestions: [
        {
            type: 'input',
            name: 'lotto',
            message: "Inserisci il numero di lotto",
            validate: (answer) => checkIfInputIsBlankOrNull(answer),
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
            message: "Inserisci i lotti delle materie prime utilizzate (devono essere separati da una virgola e con il prefisso MP_ - Esempio: MP_01, MP_02, MP_03)",
            validate: (answer) => {
                answer.replace(/\s/g, '');
                if (!(/^MP_\w+(,MP_\w+)*$/.test(answer))) {
                    return "Errore di formattazione";
                }
                return checkIfInputIsBlankOrNull(answer);
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

    questionsMenuAccount: [
        {
            type: "list",
            name: "account",
            message: "Seleziona il tuo account",
            choices: ["Fornitore - 0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e", "Produttore - 0xed9d02e382b34818e88B88a309c7fe71E65f419d", "Consumatore - 0x0fBDc686b912d7722dc86510934589E0AAf3b55A", "EXIT"]
        }
    ],
    questionsMenuFornitore: [
        {
            type: "list",
            name: "decisioneForn",
            message: "Azione",
            choices: ["Inserisci Materia Prima", "Cerca materia prima tramite il numero di lotto", "Cerca prodotto tramite il numero di lotto", "Cerca prodotto/materia prima tramite token","Visualizza NFT posseduti","Logout"]
        }
    ],
    questionsMenuProduttore: [
        {
            type: "list",
            name: "decisioneProd",
            message: "Azione",
            choices: ["Inserisci Prodotto", "Compra Materia Prima", "Cerca prodotto tramite il numero di lotto", "Cerca materia prima tramite il numero di lotto", "Cerca prodotto/materia prima tramite token","Visualizza NFT posseduti","Logout"]
        }
    ],
    questionsMenuConsumatore: [
        {
            type: "list",
            name: "decisioneCons",
            message: "Azione",
            choices: ["Cerca prodotto tramite il numero di lotto", "Cerca materia prima tramite il numero di lotto", "Cerca prodotto/materia prima tramite token", "Logout"]
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
    //etc
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

    if (isNaN(answer) || answer === null || answer == '' || /^\s+$/.test(answer)) {
        return "Per favore inserisci un numero";
    }
    return true;

}