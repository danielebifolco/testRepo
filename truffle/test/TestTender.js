const TenderFactory = artifacts.require("TenderFactory.sol");
let countTender=0;
contract("TenderFactory", (accounts) => {
    const {expectRevert} = require('@openzeppelin/test-helpers');
  it("Insert new Tender by owner with correct URI", async () => {
    const TenderFatoryInstace = await TenderFactory.deployed();
    const URI = "\{\"name\":\"appalto1\", \"quote\":\"1500\", \"expire\":\"2-02-2023\"\}";
    assert(await TenderFatoryInstace.openNewTender(URI,{from: accounts[0]}), "A tender with correct URI wasn't created");
  });
  it("Insert new Tender by owner with wrong URI", async () => {
    const TenderFatoryInstace = await TenderFactory.deployed();
    const URI = "";
    await expectRevert(TenderFatoryInstace.openNewTender(URI,{from: accounts[0]}), "VM Exception while processing transaction: revert");
  });
  it("Insert new Tender from a normal user", async () => {
    const TenderFatoryInstace = await TenderFactory.deployed();
    const URI = "\{\"name\":\"appalto1\", \"quote\":\"1500\", \"expire\":\"2-02-2023\"\}";
    await expectRevert(TenderFatoryInstace.openNewTender(URI,{from: accounts[1]}), "VM Exception while processing transaction: revert AccessControl");
  });

});
