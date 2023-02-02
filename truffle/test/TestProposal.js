const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');

const TenderFactory = artifacts.require("TenderFactory.sol");
let countTender=0;
contract("TenderFactory", (accounts) => {
    const {expectRevert} = require('@openzeppelin/test-helpers');
    it("Insert new proposal with correct quote by non-admin user", async () => {
        const TenderFatoryInstace = await TenderFactory.deployed();
        const URI = "\{\"name\":\"appalto1\", \"quote\":\"1500\", \"expire\":\"2-02-2023\"\}";
        await TenderFatoryInstace.openNewTender(URI,{from: accounts[0]}), "A tender with correct URI wasn't created";
        assert(await TenderFatoryInstace.newProposal(1000, 0,{from: accounts[1]}), "Proposal has an incorrect quote");
    });
    it("Insert new proposal with incorrect quote by non-admin", async () => {
        const TenderFatoryInstace = await TenderFactory.deployed();
        await expectRevert( TenderFatoryInstace.newProposal(0, 0,{from: accounts[2]}),"VM Exception while processing transaction: revert");
    }); 
    it("Insert new proposal with correct quote by admin", async () => {
        const TenderFatoryInstace = await TenderFactory.deployed();
        await expectRevert( TenderFatoryInstace.newProposal(500, 0,{from: accounts[0]}),"VM Exception while processing transaction: revert");
    });
    it("A non-admin user send two times a proposal", async () => {
        const TenderFatoryInstace = await TenderFactory.deployed();
        await expectRevert( TenderFatoryInstace.newProposal(500, 0,{from: accounts[1]}),"VM Exception while processing transaction: revert");
    }); 
});