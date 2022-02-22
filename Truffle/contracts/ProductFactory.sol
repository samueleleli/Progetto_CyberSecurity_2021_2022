// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./CarbonFootprint.sol";

/**
 * @title GestioneProdotti
 * @dev SmartContract utilizzato per gestire i prodotti della filiera agroalimentare
 */
contract ProductFactory{

    struct Attivita{
        string[] nomiAttivita;
        uint256[] footprint;
        string lotto;
        string[] lottiMateriePrime;
    }

    mapping(uint=>Attivita) listaAttivita;
    mapping(string=>Attivita) getListaAttivitaByLotto;
    
    //indirizzi
    address payable produttore;
    address payable fornitore;
    address payable consumatore;
    address payable nftContractAddress;

    //contatori
    uint256 counterMateriePrime;
    uint256 counterProdotti;

    //INIT
    constructor (address payable _produttore, address payable _fornitore, address payable _consumatore,address payable _nftContractAddress){
        produttore = _produttore;
        fornitore = _fornitore;
        consumatore = _consumatore;
        counterMateriePrime = 0;
        counterProdotti = 0;
        nftContractAddress = _nftContractAddress;
    }
    
    //metodo per inserire la materia prima
    function inserisciMateriaPrima(string memory _lotto, string memory _nomeMateriaPrima, uint256 footprint) public{
        require(msg.sender == fornitore,"Operazione non permessa");
        
        string memory lotto = string(abi.encodePacked("MP_",_lotto));
        require(! CarbonFootprint(nftContractAddress).existsLotto(lotto),string(abi.encodePacked("Il lotto ",lotto," gia' esiste!"))); //nuovo lotto non deve esistere

        CarbonFootprint(nftContractAddress).mint(fornitore,lotto,footprint,_nomeMateriaPrima);
        counterMateriePrime ++;  //incremento del numero delle materie prime
    }

    //metodo per comprare le materie prime da parte del produttore
    function compraMateriaPrima(string memory _lotto) public returns(bool) {
        require(msg.sender == produttore,"Operazione non permessa");
        //verifica dell'esistenza del lotto
        require(CarbonFootprint(nftContractAddress).existsLotto(_lotto),string(abi.encodePacked("Il lotto ",_lotto," non esiste")));
        
        //passaggio di proprietà

        CarbonFootprint(nftContractAddress).trasferisciNft(fornitore,produttore,_lotto);
        return true;
    }


    //metodo per inserire il prodotto
    function inserisciProdotto(string memory _lotto, string memory _nomeProdotto, string[] memory _lotto_materiePrime, string[] memory _nomiAttivita, uint[] memory _footprintAttivita) public {
        
        // _nomiAttivita = ["A","B","C"]
        // _footprintAttivita = [10, 20, 30]
        
        //controlli
        require(msg.sender == produttore,"Operazione non permessa");
        require(_lotto_materiePrime.length>0,"Deve essere inserita almeno una materia prima'");
        require(_footprintAttivita.length>0 && _nomiAttivita.length>0,"Deve essere inserita almeno un'attivita'");
        require(_footprintAttivita.length == _nomiAttivita.length,"I 2 vettori hanno lunghezza diversa");
        string memory lotto = string(abi.encodePacked("P_",_lotto));
        require(!CarbonFootprint(nftContractAddress).existsLotto(lotto),string(abi.encodePacked("Il lotto ",lotto," gia' esiste!")));

        //controllo dell'esistenza delle materie prime
        for(uint i=0;i< _lotto_materiePrime.length;i++){
            require(CarbonFootprint(nftContractAddress).existsLotto(_lotto_materiePrime[i]),string(abi.encodePacked("Il lotto ",_lotto_materiePrime[i]," non esiste")));
            require(CarbonFootprint(nftContractAddress).isOwner(produttore,_lotto_materiePrime[i]),string(abi.encodePacked("Non possiedi il lotto ",_lotto_materiePrime[i]))); //controlla se il produttore può usare quella risorsa
            require(!(CarbonFootprint(nftContractAddress).getRisorsaUtilizzata(_lotto_materiePrime[i])),string(abi.encodePacked("Hai gia' utilizzato il lotto ",_lotto_materiePrime[i])));
        }
        uint footprint = 0;

        //calcolo footprint attivita
        for(uint i=0; i<_nomiAttivita.length; i++){
            footprint = footprint + _footprintAttivita[i];
        }

        //calcolo del footprint totale
        for(uint i=0;i< _lotto_materiePrime.length;i++){
            CarbonFootprint(nftContractAddress).setRisorsaUtilizzata(_lotto_materiePrime[i]);
            footprint = footprint + CarbonFootprint(nftContractAddress).getFootPrintByLotto(_lotto_materiePrime[i]);
        }

        //inserimento dell'attività
        listaAttivita[counterProdotti] = Attivita({
                nomiAttivita: _nomiAttivita,
                footprint: _footprintAttivita,
                lottiMateriePrime: _lotto_materiePrime,
                lotto: lotto
        });

        getListaAttivitaByLotto[lotto] = listaAttivita[counterProdotti];
        
        CarbonFootprint(nftContractAddress).mint(produttore,lotto,footprint,_nomeProdotto);

        counterProdotti++; //incremento del numero dei prodotti inseriti
    }

    //cerca il prodotto in base al numero di lotto
    function searchProdottoByLotto(string memory lotto) public view returns (string memory){
        return CarbonFootprint(nftContractAddress).searchProdottoByLotto(lotto);
    }

    //cerca la materia prima in base al lotto
    function searchMateriaPrimaByLotto(string memory lotto) public view returns (string memory){
        return CarbonFootprint(nftContractAddress).searchMateriaPrimaByLotto(lotto);
    }

    //ottieni materie prime possedute dall'owner
    function getWallet(address owner) public view returns (string[] memory){
        uint[] memory nftTokens = CarbonFootprint(nftContractAddress).walletOfOwner(owner);
        string[] memory nftList = new string[](nftTokens.length);
        for(uint i=0;i< nftTokens.length;i++){
            nftList[i] = getNft(nftTokens[i]);
        }
        return nftList;
    }


    //metodo che permette di ottenere l'nft tramite l'id del token
    function getNft(uint idToken) public view returns (string memory){
        return CarbonFootprint(nftContractAddress).buildMetadata(idToken);
    }

    function visualizzaAttivitaDiLavorazione(string memory _lotto) public view returns (string[] memory,uint256[] memory,string[] memory){
        Attivita memory attivita = getListaAttivitaByLotto[string(abi.encodePacked("P_",_lotto))];
        return (attivita.nomiAttivita,attivita.footprint,attivita.lottiMateriePrime);
    }
}