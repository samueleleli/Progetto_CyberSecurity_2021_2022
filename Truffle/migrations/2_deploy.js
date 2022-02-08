var ProductFactory = artifacts.require("ProductFactory");
var Base64 = artifacts.require("Base64");
var CarbonFootprint = artifacts.require("CarbonFootprint");

module.exports = async function (deployer) {
  deployer.deploy(Base64)
  await deployer.deploy(CarbonFootprint,"Prodotti","PRD").then(function () {
    return deployer.deploy(ProductFactory,"0xed9d02e382b34818e88B88a309c7fe71E65f419d","0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e","0x0fBDc686b912d7722dc86510934589E0AAf3b55A", CarbonFootprint.address);
  })
}
