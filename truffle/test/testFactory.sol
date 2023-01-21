//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Factory.sol";

contract testFactory{
    //Factory contratto= Factory(DeployedAddresses.Factory());
    Factory contratto= new Factory("bando","BND");
    uint expectedminimo=50;

    function testing() public{
                uint256 num=contratto.openNewTender("bando:1");
                contratto.Proposal(60,num,address(2));
                contratto.Proposal(70,num,address(3));
                contratto.Proposal(120,num,address(7));
                uint256 num1=contratto.openNewTender("bando:2");
                contratto.Proposal(4000,num1,address(4));
                contratto.Proposal(50000,num1,address(1));
                address winner = contratto.assignWinner(num);
                address winner1 = contratto.assignWinner(num1);
                Assert.equal(winner,address(2),"error1");
                Assert.equal(winner1,address(4),"errore2");
    }
}
