//SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ProposalManagement.sol";


contract Factory is ERC721URIStorage, AccessControl{

    bytes32 public constant ADMIN = keccak256("ADMIN");
    using Counters for Counters.Counter;
    struct Tender{
        uint256 id;
        bool status;
        string URI;
        ProposalManagement proposal;
    }

    Tender[] private tenders;
    Counters.Counter private _numOfProposal;
    
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _grantRole(ADMIN, msg.sender);
    }

    function givePermission (address newAdmin) public onlyRole(ADMIN){
        grantRole(ADMIN, newAdmin);
    }

    /*function revokePermission (address oldAdmin) public onlyRole(ADMIN) {
        revokeRole(ADMIN, oldAdmin);
    }*/
     
    function openNewTender(string memory tokenURI) public onlyRole(ADMIN) returns(uint){

        ProposalManagement newProposal = new ProposalManagement();
        newProposal.openTender();
        tenders.push(Tender(_numOfProposal.current(),true,tokenURI,newProposal));
        _numOfProposal.increment();

        return _numOfProposal.current()-1;
    }

    function Proposal(uint256 quote, uint num, address ind) public {

        require(tenders[num].status);
        tenders[num].proposal.sendProposal(ind,quote);

    }

    function assignWinner(uint256 num) public onlyRole(ADMIN) returns(address){
        
        require(tenders[num].status);
        tenders[num].proposal.closeTender();
        tenders[num].status=false;
        address winner = tenders[num].proposal.proposalEvaluation();
        _mint(winner, num);
        _setTokenURI(num, tenders[num].URI);

        return winner;
    }

    function getTenders() public view returns (Tender[] memory) {
        Tender[] memory output= new Tender[](_numOfProposal.current());
        for(uint i = 0; i < _numOfProposal.current(); i++){
            Tender storage temp = tenders[i];
            output[i]=temp;
        }

        return output;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}