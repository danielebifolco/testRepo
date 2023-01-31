//SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTColl is ERC721URIStorage{
    
    
    //Time indicators
    mapping(address => uint) winDates;
    
    // tranche cannot be collected at this time.
	error FunctionInvalidAtThisStage();
    
    //Time modifier
	modifier firstTranche(address _partecipant) {
	if (now <= winDates[_partecipant] + (30 * 1 days))
	    revert FunctionInvalidAtThisStage();
	_;
	}
    
    modifier secondTranche(address _partecipant) {
	if (now <= winDates[_partecipant] + (60 *days))
	    revert FunctionInvalidAtThisStage();
	_;
	}

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    function Mint(address win, uint id, string memory URI) public{
        _mint(win, id);
        _setTokenURI(id, URI);
        winDates[win]= now;
    }
    
    

}
