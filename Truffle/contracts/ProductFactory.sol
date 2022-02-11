// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./CarbonFootprint.sol";

/**
 * @title GestioneProdotti
 * @dev SmartContract utilizzato per gestire i prodotti della filiera agroalimentare
 */
contract ProductFactory{

    struct Attivita{
        string nomeAttivita;
        uint256 footprint;
        string lotto;
    }

    mapping(uint=>Attivita) listaAttivita;
    
    //indirizzi
    address payable produttore;
    address payable fornitore;
    address payable consumatore;
    address payable nftContractAddress;

    //contatori
    uint256 counterMateriePrime;
    uint256 counterProdotti;
    uint256 counterAttivita;

    //INIT
    constructor (address payable _produttore, address payable _fornitore, address payable _consumatore,address payable _nftContractAddress){
        produttore = _produttore;
        fornitore = _fornitore;
        consumatore = _consumatore;
        counterMateriePrime = 0;
        counterProdotti = 0;
        counterAttivita = 0;
        nftContractAddress = _nftContractAddress;
    }
    
    //bisogna anche inserire le attività


    //metodo per inserire la materia prima
    function inserisciMateriaPrima(string memory _lotto, string memory _nomeMateriaPrima, uint256 footprint) public{
        require(msg.sender == fornitore);
        //condizioni di accettazione della materia prima in termini di footprint
        require(footprint<100,"Footprint non rispetta i requisiti minimi");        
        
        string memory lotto = string(abi.encodePacked("MP_",_lotto));
        require(! CarbonFootprint(nftContractAddress).existsLotto(lotto)); //nuovo lotto non deve esistere

        CarbonFootprint(nftContractAddress).mint(fornitore,lotto,footprint,_nomeMateriaPrima);
        counterMateriePrime ++;  //incremento del numero delle materie prime
    }

    //metodo per comprare le materie prime da parte del produttore
    function compraMateriePrima(string[] memory _lotti) public returns(bool) {
        require(msg.sender == produttore);
        //verifica dell'esistenza dei lotti
        for(uint i=0;i<_lotti.length;i++){
            require(CarbonFootprint(nftContractAddress).existsLotto(_lotti[i]));
        }
        //passaggio di proprietà

        CarbonFootprint(nftContractAddress).compraNft(fornitore,produttore,_lotti);
        return true;
    }


    //metodo per inserire il prodotto
    function inserisciProdotto(string memory _lotto, string memory _nomeProdotto, string[] memory _lotto_materiePrime, string[] memory _nomiAttivita, uint[] memory _footprintAttivita) public {
        
        // _nomiAttivita = ["A","B","C"]
        // _footprintAttivita = [10, 20, 30]
        
        require(msg.sender == produttore);
        string memory lotto = string(abi.encodePacked("P_",_lotto));
        require(!CarbonFootprint(nftContractAddress).existsLotto(lotto));

        //controllo dell'esistenza delle materie prime
        for(uint i=0;i< _lotto_materiePrime.length;i++){
            require(CarbonFootprint(nftContractAddress).existsLotto(_lotto_materiePrime[i]));
            require(CarbonFootprint(nftContractAddress).isOwner(produttore,_lotto_materiePrime[i])); //controlla se il produttore può usare quella risorsa
        }
        uint footprint = 0;

        //salvaAttivita
        for(uint i=0; i<_nomiAttivita.length; i++){
            listaAttivita[counterAttivita] = Attivita({
                nomeAttivita: _nomiAttivita[i],
                footprint: _footprintAttivita[i],
                lotto: lotto
            });
            counterAttivita++;
            footprint = footprint + _footprintAttivita[i];
        }

        //calcolo del footprint totale
        for(uint i=0;i< _lotto_materiePrime.length;i++){
            footprint = footprint + CarbonFootprint(nftContractAddress).getFootPrintByLotto(_lotto_materiePrime[i]);
        }
 

        require(footprint<100);
        
        CarbonFootprint(nftContractAddress).mint(produttore,lotto,footprint,_nomeProdotto);

        counterProdotti ++; //incremento del numero dei prodotti inseriti
    }

    //cerca il prodotto in base al numero di lotto
    function searchProdottoByLotto(string memory lotto) public view returns (string memory){
        return CarbonFootprint(nftContractAddress).searchProdottoByLotto(lotto);
    }

    //cerca la materia prima in base al lotto
    function searchMateriaPrimaByLotto(string memory lotto) public view returns (string memory){
        return CarbonFootprint(nftContractAddress).searchMateriaPrimaByLotto(lotto);
    }

      function getWallet(address owner) public view returns (string[] memory){
        uint[] memory nftTokens = CarbonFootprint(nftContractAddress).walletOfOwner(owner);
        string[] memory nftList = new string[](nftTokens.length);
        for(uint i=0;i< nftTokens.length;i++){
            nftList[i] = getNft(nftTokens[i]);
        }
        return nftList;
    }

    function getNft(uint idToken) public view returns (string memory){
        return CarbonFootprint(nftContractAddress).buildMetadata(idToken);
    }

}