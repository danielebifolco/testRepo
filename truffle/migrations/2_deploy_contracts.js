var tenderFactory = artifacts.require("./TenderFactory.sol");
var NFT = artifacts.require("./NFTColl.sol");

module.exports = function (deployer) {
  deployer.deploy(NFT,"Bando","BND").then(async () => {
    // get instance of deployed contract
    const NftInstance = await NFT.deployed(); 
    // pass its address as argument for Contract1's constructor
    await deployer.deploy(tenderFactory,NftInstance.address); 
  });
};
