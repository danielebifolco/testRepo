const TenderFactory = artifacts.require("TenderFactory.sol");
let countTender=0;
contract("TenderFactory", (accounts) => {
    const {expectRevert} = require('@openzeppelin/test-helpers');
  it("Select winner by admin ", async () => {
    const TenderFatoryInstace = await TenderFactory.deployed();
    const URI = "\{\"name\":\"appalto1\", \"quote\":\"1500\", \"expire\":\"2-02-2023\"\}";
    await TenderFatoryInstace.openNewTender(URI,{from: accounts[0]});
    await TenderFatoryInstace.newProposal(1000, 0,{from: accounts[1]})
    await TenderFatoryInstace.newProposal(800, 0,{from: accounts[2]})
    await TenderFatoryInstace.newProposal(500, 0,{from: accounts[3]})
    await TenderFatoryInstace.assignWinner(0);
    const tenderInfo=await TenderFatoryInstace.getTenders();
    assert.equal(tenderInfo[0].win, accounts[3],"The tender was won by incorrect account")
  });
  it("Select winner by non-admin ", async () => {
    const TenderFatoryInstace = await TenderFactory.deployed();
    const URI = "\{\"name\":\"appalto2\", \"quote\":\"7000\", \"expire\":\"5-02-2023\"\}";
    await TenderFatoryInstace.openNewTender(URI,{from: accounts[0]});
    await TenderFatoryInstace.newProposal(1000, 1,{from: accounts[1]})
    await TenderFatoryInstace.newProposal(6500, 1,{from: accounts[2]})
    await TenderFatoryInstace.newProposal(5000, 1,{from: accounts[3]})
    await expectRevert(TenderFatoryInstace.assignWinner(1,{from: accounts[3]}), "VM Exception while processing transaction: revert AccessControl");
  });
  
});
