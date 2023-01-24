//SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ProposalManagement.sol";
import "./NFTColl.sol";
contract Factory is AccessControl {
    bytes32 public constant ADMIN = keccak256("ADMIN");
    using Counters for Counters.Counter;
    struct Tend {
        uint id;
        bool stat;
        string URI;
        ProposalManagement proposal;
        address win;
    }
    Tend[] private tends;
    Counters.Counter private _numProp;
    NFTColl private NFT;

    constructor(string memory name, string memory symbol) {
        NFT=new NFTColl(name,symbol);
        _grantRole(ADMIN, msg.sender);
    }

    function openNewTender(string memory tokenURI)
        public
        onlyRole(ADMIN)
        returns (uint)
    {
        ProposalManagement newProposal = new ProposalManagement();
        newProposal.openTender();
        tends.push(
            Tend(_numProp.current(), true, tokenURI, newProposal, address(0))
        );
        _numProp.increment();
        return _numProp.current() - 1;
    }

    function Proposal(uint quote, uint num) public {
        require(tends[num].stat);
        tends[num].proposal.sendProposal(msg.sender, quote);
    }

    function assignWinner(uint num) public onlyRole(ADMIN) {
        require(tends[num].stat);
        tends[num].proposal.closeTender();
        tends[num].stat = false;
        tends[num].win = tends[num].proposal.proposalEvaluation();
        NFT.Mint(tends[num].win, num, tends[num].URI);
    }

    function getTends() public view returns (Tend[] memory) {
        Tend[] memory output = new Tend[](_numProp.current());
        for (uint i = 0; i < _numProp.current(); i++) {
            Tend storage temp = tends[i];
            output[i] = temp;
        }
        return output;
    }
}
