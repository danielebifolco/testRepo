//SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTColl is ERC721URIStorage{
    mapping(address=>string) private motivation;

    //payment management
    mapping(address => uint) private quotes;
    mapping(address => bool) private firstTrancheStatus;
    mapping(address => bool) private secondTrancheStatus;
    mapping(address => bool) private lockedPayment;

    //Time indicators
    mapping(address => uint) private winDates;
    
    // tranche cannot be collected at this time.
	error FunctionInvalidAtThisStage();
    
    //Time modifier
	modifier firstMonth(address _partecipant) {
	if (now <= winDates[_partecipant] + (30 * 1 days))
	    revert FunctionInvalidAtThisStage();
	_;
	}
    
    modifier secondMonth(address _partecipant) {
	if (now <= winDates[_partecipant] + (60 *days))
	    revert FunctionInvalidAtThisStage();
	_;
	}

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    function Mint(address win, uint id, string memory URI, uint256 quote) public onlyOwner{
        _mint(win, id);
        _setTokenURI(id, URI);
        winDates[win]= now;
        quotes[win]=quote;
        firstTrancheStatus[win]=false;
        secondTrancheStatus[win]=false;
        lockedPayment[win]=false;
    }

    function firstTranche () public firstMonth(msg.sender){
        //checks
        require(firstTrancheStatus[msg.sender]==false, "payment already received");
        require (lockedPayment[msg.sender]==false, motivation[msg.sender]);

        //effects
        payable(msg.sender).send(quotes[msg.sender]/2);
        firstTrancheStatus[msg.sender]=true;
    }

    function secondTranche () public secondMonth(msg.sender){
        //checks
        require(secondTrancheStatus[msg.sender]==false, "payment already received");
        require (lockedPayment[msg.sender]==false, motivation[msg.sender]);

        //effects
        payable(msg.sender).send(quotes[msg.sender]/2);
        secondTrancheStatus[msg.sender]=true;
    }

    function lockPayment(string memory reason, address partecipant) onlyOwner{
        
        lockedPayment[partecipant]=!lockedPayment[partecipant];
        motivation[win]=reason;


    }
    
    

}
