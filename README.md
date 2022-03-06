
# Progetto di Software Cybersecurity 2021/2022 - gruppo 5
Progetto a scopo didattico il cui obiettivo è stato quello di realizzare una Dapp che implementi delle metodologie di cyber security, utilizzando la tecnologia Blockchain.

## Struttura del progetto

```
.
├── Client/
│   ├── models/
│   ├── utility/
│   └── client.js
├── Truffle/
|   ├── build/
|   ├── contracts/
|   ├── migrations/
|   ├── test/
|   └── truffle-config.js
├── MACOS-StartNetworkAndDeploy/
|   ├── runclient.sh
|   ├── startnetwork.sh
|   └── stop.sh
├── WINDOWS-StartNetworkAndDeploy/
|   ├── runclient.sh
|   ├── startnetwork.sh
|   └── stop.sh
├── network/
|   └── 3-nodes-istanbul-tessera-docker-compose/
└── install_lib.sh
```


## Setup

Per poter utilizzare il software c'è bisogno che il computer abbia installato:

**- Docker** \
**- Node.js** \
**- Git**

Installati i precedenti software si può eseguire la clone del progetto attraverso il comando seguente:

```bash
git clone https://github.com/samueleleli/Progetto_CyberSecurity_2021_2022.git
```
Nella directory in cui è stato eseguita la clone apparirà quindi la directory *Progetto_CyberSecurity_2021_2022*. Bisogna quindi postarsi nella suddetta cartella e installare le dipendenze di progetto lanciando i seguenti comandi:

```bash
cd Progetto_CyberSecurity_2021_2022 
sh install_lib.sh 
# or ./install_lib.sh
```
***N.B. Per gli utenti Windows è necessario utilizzare un emulatore del terminale Linux (Es. GitBash) per poter lanciare i comandi***

A questo punto, a seconda del sistema operativo utilizzato, bisogna eseguire le seguenti operazioni:

### Utenti che utilizzano Windows/Linux

    1. Lanciare il programma Docker (aspettare che sia in fase di run)

    2. Eseguire i seguenti comandi:
    
```bash
cd WINDOWS-StartNetworkAndDeploy
sh startnetwork.sh
# or ./startnetwork.sh
``` 


 ### Utenti che utilizzano MacOs
 Eseguire i seguenti comandi:
    
```bash
cd MACOS-StartNetworkAndDeploy
sh startnetwork.sh
# or ./startnetwork.sh
```
## 

All'interno della cartella è presente anche il file per fermare i container di Docker.
Per fermarli, basta eseguire:

```bash
#posizione di partenza: MACOS-StartNetworkAndDeploy o WINDOWS-StartNetworkAndDeploy

sh stop.sh
# or ./stop.sh
```
## Avvio del client

Eseguite tutte le operazioni precedenti, per lanciare il client ci sono 2 possibilità:

**a) METODO 1 -** tramite il file *runclient.sh*\

Eseguire il seguente comando:

```bash
#posizione di partentza: MACOS-StartNetworkAndDeploy o WINDOWS-StartNetworkAndDeploy

sh runclient.sh
# or ./runclient.sh
```

**b) METODO 2 -** manualmente (nel caso in cui tramite il Metodo 1 non si riescano a selezionare le opzioni del menu) 

Dalla root di progetto spostarsi nella directory Client e lanciare i seguenti comandi:

```bash
#posizione di partenza: root di progetto

cd Client
node client.js
```

L'avvio in maniera corretta del client è testimoniato dall'apparizione del menu di login:

![alt text](https://drive.google.com/uc?export=view&id=1DkSIncirw6bp6Nl4Khbmewczd-xpsDUv)



## Contributi
Progetto realizzato da:

**Di Rado Simone - 1107371** \
**Ferretti Matteo - 1103343** \
**Leli Samuele - 1107310**\
**Lillini Davide - 1102892** \
**Raimondi Michela - 1102439**

## Ringraziamenti

[W001247] - SOFTWARE CYBERSECURITY - Professor **Luca Spalazzi**
