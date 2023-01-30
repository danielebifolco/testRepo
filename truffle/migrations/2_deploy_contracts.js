
var tender = artifacts.require("./Tender.sol");
var tenderFactory = artifacts.require("./TenderFactory.sol");
var NFT = artifacts.require("./NFTColl.sol");

module.exports = function(deployer) {
  deployer.deploy(tender);
  deployer.deploy(tenderFactory,"Bando","BND");
  deployer.deploy(NFT,"Bando","BND");
};
