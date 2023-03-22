//SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Tender.sol";
import "./NFTColl.sol";

contract TenderFactory is AccessControl {
    using Counters for Counters.Counter;
    struct TenderInfo {
        uint256 id;
        bool status;
        string URI;
        Tender tender;
        address win;
    }

    bytes32 private constant ADMIN = keccak256("ADMIN");
    TenderInfo[] private tendersInfo;
    Counters.Counter private _numTender;
    NFTColl private NFT;

    modifier notAdmin(address partecipant) {
        if (hasRole(ADMIN, partecipant)) revert();
        _;
    }

    constructor(string memory name, string memory symbol) {
        NFT = new NFTColl(name, symbol);
        _grantRole(ADMIN, msg.sender);
    }

    function openNewTender(string memory tokenURI) public onlyRole(ADMIN) {
        require(bytes(tokenURI).length > 0);
        Tender newtender = new Tender();
        newtender.openTender();
        tendersInfo.push(
            TenderInfo(
                _numTender.current(),
                true,
                tokenURI,
                newtender,
                address(0)
            )
        );
        _numTender.increment();
    }

    function newProposal(uint256 quote, uint256 id)
        public
        notAdmin(msg.sender)
    {
        require(tendersInfo[id].status);
        tendersInfo[id].tender.sendProposal(msg.sender, quote);
    }

    function assignWinner(uint256 id) 
        public 
        onlyRole(ADMIN) 
    {
        require(tendersInfo[id].status);
        tendersInfo[id].tender.closeTender();
        tendersInfo[id].status = false;
        tendersInfo[id].win = tendersInfo[id].tender.getWinner();
        NFT.Mint(tendersInfo[id].win, id, tendersInfo[id].URI);
    }

    function getTenders() public view returns (TenderInfo[] memory) {
        return tendersInfo;
    }
}
