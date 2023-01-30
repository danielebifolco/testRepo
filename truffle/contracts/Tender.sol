//SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;
//portare la versione di solidity a 0.8.0

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

library IterableMapping {
    // Iterable mapping from address to uint;
    struct Map {
        address[] keys;
        mapping(address => uint) values;
        mapping(address => uint) indexOf;
        mapping(address => bool) inserted;
    }

    function get(Map storage map, address key) internal view returns (uint) {
        return map.values[key];
    }

    function getKeyAtIndex(Map storage map, uint index) internal view returns (address) {
        return map.keys[index];
    }

    function size(Map storage map) internal view returns (uint) {
        return map.keys.length;
    }

    function set(Map storage map, address key, uint val) internal {
    
    //Each participant can submit only one proposal
        if (!map.inserted[key]) {
            map.inserted[key] = true;
            map.values[key] = val;
            map.indexOf[key] = map.keys.length;
            map.keys.push(key);
        }
    }

    function remove(Map storage map, address key) internal {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.values[key];

        uint index = map.indexOf[key];
        uint lastIndex = map.keys.length - 1;
        address lastKey = map.keys[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

        map.keys[index] = lastKey;
        map.keys.pop();
    }
}

contract ProposalManagement is Ownable{

	using IterableMapping for IterableMapping.Map;

	enum Stages {
		Open,
		Close
	}

	// Function cannot be called at this time.
	error FunctionInvalidAtThisStage();

	// This is the current stage.
	Stages private stage = Stages.Close;
	IterableMapping.Map private proposals;
	address private winner;

	//stage modifier
	modifier atStage(Stages stage_) {
	if (stage != stage_)
	    revert FunctionInvalidAtThisStage();
	_;
	}

	//GET and SET functions
	function openTender() public view onlyOwner{
		stage = Stages.Open;
	}

	function closeTender() public view onlyOwner{
		stage = Stages.Close;
	}

	function getStatus() public view onlyOwner returns(bool){
		if (stage == Stages.Open){
			return true;
		}else{
			return false;
		}
	}
	
	//core functions
	function proposalEvaluation() public onlyOwner atStage(Stages.Close) returns (address){
		uint256 min;
		min = proposal.get(proposal.getKeyAtIndex(0));

		for (uint i=0; i<proposal.size(); i++) {
	    		address participant = proposal.getKeyAtIndex(i);
	    		uint256 value= proposal.get(participant);
	    		if (value <= min ){
				min = value;
				winner = participant;
	    		}
		}
		return winner; 
	}
	
	function sendProposal(address participant, uint256 newQuote) public onlyOwner atStage(Stages.Open){
		//Checks, migliorare i controlli
		require(newQuote>=0);
		
		//Effects
		proposal.set(participant, newQuote);

	}
}