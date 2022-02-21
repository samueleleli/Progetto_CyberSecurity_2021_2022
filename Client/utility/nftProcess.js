const Base64 = require('js-base64');
module.exports = {
    
    printNft: function (nftBase64) {
        if(Base64.isValid(nftBase64.substring(29))){
            const nft = toJson(nftBase64);
            let tipo='';
        
            if (nft.lotto.charAt(0) === 'M') {
              tipo = 'MATERIA PRIMA';
            } else if (nft.lotto.charAt(0) === 'P') {
              tipo = 'PRODOTTO';
            } else {
              console.log('\nNFT NON TROVATO! \n');
              return false;
            }
            
            console.log('\n' + tipo);
            console.log('\nData URL: '+nftBase64);
            console.log('\nToken: ' + nft.token);
            console.log('Lotto: ' + nft.lotto);
            console.log('Nome: ' + nft.name);
            console.log('Carbon Footprint: ' + nft.footprint + '\n');
            return true;
          } else{
            return false;
          }
    },
    
};

function toJson(nftBase64) {
    const json = Base64.decode(nftBase64.substring(29));
    return JSON.parse(json);
}
