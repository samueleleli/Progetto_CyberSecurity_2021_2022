// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Base64.sol";

contract CarbonFootprint is ERC721Enumerable, Ownable {
  using Strings for uint256;

  struct Risorsa{
    uint idToken;
    string lotto;
    string nome;
    uint footprint;
  }

  mapping(string=>Risorsa) getRisorsaByLotto; //mapping del prodotto in base al lotto
  mapping(uint=>Risorsa) getRisorsaByTokenId;
  mapping(uint=>Risorsa) listaRisorse;
  mapping(string => bool) private risorsaUtilizzata;
  mapping(string => bool) private risorsaExists;

  constructor(
    string memory _name,
    string memory _symbol
  ) ERC721(_name, _symbol) {
  }


  //metodo utilizzato per mintare l'nft
  function mint(address _to, string memory _lotto, uint _footprint, string memory _nome) public  {
    require(!risorsaUtilizzata[_lotto],"Lotto gia' utilizzato!");
    uint256 supply = totalSupply();
    _safeMint(_to, supply+1);
    listaRisorse[supply] = Risorsa({
       idToken: supply+1,
       lotto: _lotto,
       nome: _nome,
       footprint: _footprint
    });
    getRisorsaByTokenId[supply+1] = listaRisorse[supply]; 
    getRisorsaByLotto[_lotto] = listaRisorse[supply];
    risorsaExists[_lotto] = true;
    risorsaUtilizzata[_lotto] = false;
  }

  //funzione che permette di indicare l'utilizzo della risorsa
  function setRisorsaUtilizzata(string memory _lotto) public  {
    risorsaUtilizzata[_lotto] = true;
  }

  //restituisce true se la risorsa è già stata utilizzata
  function getRisorsaUtilizzata(string memory _lotto) public view returns (bool){
    return risorsaUtilizzata[_lotto];
  }

  //restituisce i token posseduti dall'account
  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }
   
   //funzione per comprare la materia prima
   function trasferisciNft(address payable _fornitore, address payable _produttore, string memory lotto) public{

      require(isOwner(_fornitore,lotto),string(abi.encodePacked("Il fornitore non possiede il lotto ",lotto)));

      safeTransferFrom(_fornitore, _produttore,getRisorsaByLotto[lotto].idToken);
      
    
   }

   //verifica se il lotto appartiene all'account
   function isOwner(address _account, string memory lotto) public view returns(bool){
      return _isApprovedOrOwner(_account,getRisorsaByLotto[lotto].idToken);
   }
  
   //codifica dei dati della risorsa in base 64
   function buildMetadata(uint256 _tokenId) public view returns(string memory) {
      Risorsa memory risorsa = getRisorsaByTokenId[_tokenId];
      return string(abi.encodePacked(
              'data:application/json;base64,', Base64.encode(bytes(abi.encodePacked(
                          '{"token":', 
                          uint2str(risorsa.idToken),
                          ',"name":"', 
                          risorsa.nome,
                          '","lotto":"', 
                          risorsa.lotto,
                          '","footprint":', 
                          uint2str(risorsa.footprint),'}')))));
                          
  }
  
  //verifica dell'esistenza del lotto
  function existsLotto(string memory _lotto) public view returns (bool){
    return risorsaExists[_lotto];
  }

  //cerca la materia prima in base al lotto
  function searchMateriaPrimaByLotto(string memory lotto) public view returns(string memory) {
      Risorsa memory risorsa = getRisorsaByLotto[string(abi.encodePacked("MP_",lotto))];
      return buildMetadata(risorsa.idToken);
  }

  //cerca il prodotto tramite il numero di lotto
  function searchProdottoByLotto(string memory lotto) public view returns(string memory) {
        Risorsa memory risorsa = getRisorsaByLotto[string(abi.encodePacked("P_",lotto))];
        return buildMetadata(risorsa.idToken);
    }

  //cerca il footprint tramite il numero di lotto
  function getFootPrintByLotto(string memory lotto) public view returns (uint256){
        return getRisorsaByLotto[lotto].footprint; 
   }

  //conversione da intero a stringa
  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }


}