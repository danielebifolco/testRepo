// Provare anche con queste due combinazioni:
//var gestioneProposte = artifacts.require("gestioneProposte.sol");
//var Tenders = artifacts.require("Tenders");
var proposalManagement = artifacts.require("./ProposalManagement.sol");
//var tenders = artifacts.require("./Tenders.sol");
var factory = artifacts.require("./Factory.sol");

module.exports = function(deployer) {
  deployer.deploy(proposalManagement);
  deployer.deploy(factory,"Bando","BND");
};
