import Provider from './Provider';
import EventABI from '../contracts/CarbonFootprint.json'

const provider = new Provider();

const CarbonFootprint = (contractAddress) => {
  const web3 = provider.web3;
  const instance = new web3.eth.Contract(CarbonFootprintABI.abi, contractAddress);
  return instance;
};

export default CarbonFootprintNFT;