//SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTColl is ERC721URIStorage, Ownable{
    mapping(address=>string) private motivation;

    //payment management
    mapping(address => uint) private quotes;
    //mapping(address => bool) private firstTrancheStatus;
    //mapping(address => bool) private secondTrancheStatus;
    //mapping(address => bool) private lockedPayment;
    mapping(address => bool) private payedByOwner;
    //Time indicators
    mapping(address => uint) private winDates;
    
    // tranche cannot be collected at this time.
	error FunctionInvalidAtThisStage();
    
    event Deposited (address form, uint amount);
    
    function depositMoney(address from, address partecipant) public payable {
        require(msg.value>=quotes[partecipant]);
        payedByOwner[partecipant]= true;
        emit Deposited(from, msg.value);
    }

    // Use transfer method to withdraw an amount of money and for updating automatically the balance
    function withdrawMoney(address _to, uint _value) public onlyOwner {
        payable(_to).transfer(_value);
    }

    // Getter smart contract Balance
    function getSmartContractBalance() external view returns(uint) {
        return address(this).balance;
    }
    //Time modifier
/* 	modifier firstMonth(address _partecipant) {
	if (block.timestamp <= winDates[_partecipant] + (30 * 1 days))
	    revert FunctionInvalidAtThisStage();
	_;
	}
    
    modifier secondMonth(address _partecipant) {
	if (block.timestamp <= winDates[_partecipant] + (60 * 1 days))
	    revert FunctionInvalidAtThisStage();
	_;
	} */

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    /* function sendEth(address partecipant) public payable onlyOwner{
        require(msg.value>=quotes[partecipant]);
        payedByOwner[partecipant]=true;

    } */

    function Mint(address win, uint id, string memory URI, uint256 quote) public onlyOwner{
        _mint(win, id);
        _setTokenURI(id, URI);
        winDates[win]= block.timestamp;
        quotes[win]=quote;
        firstTrancheStatus[win]=false;
        secondTrancheStatus[win]=false;
    }

    /* function firstTranche () public firstMonth(msg.sender){
        //checks
        require(payedByOwner[msg.sender]==true);
        require(firstTrancheStatus[msg.sender]==false, "payment already received");
        require (lockedPayment[msg.sender]==false, motivation[msg.sender]);

        //effects
        //avoid re-entrancy attack
        firstTrancheStatus[msg.sender]=true;
        if(!payable(msg.sender).send(quotes[msg.sender]/2)){
           firstTrancheStatus[msg.sender]=false; 
        }
        
    }

    function secondTranche () public secondMonth(msg.sender){
        //checks
        require(payedByOwner[msg.sender]==true);
        require(secondTrancheStatus[msg.sender]==false, "payment already received");
        require (lockedPayment[msg.sender]==false, motivation[msg.sender]);

        //effects
        //svoid re-entrancy attack
        secondTrancheStatus[msg.sender]=true;
        if(!payable(msg.sender).send(quotes[msg.sender]/2)){
            secondTrancheStatus[msg.sender]=false;
        }
        
    }

    function lockPayment(string memory reason, address partecipant)public onlyOwner{
        
        lockedPayment[partecipant]=!lockedPayment[partecipant];
        motivation[partecipant]=reason;


    }
    
    function getQuote(address partecipant) public onlyOwner returns(uint256){
        return quotes[partecipant];

    }
    
 */
}
