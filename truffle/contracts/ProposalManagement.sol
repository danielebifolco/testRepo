//SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
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
        if (map.inserted[key]) {
            map.values[key] = val;
        } else {
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

contract ProposalManagement is AccessControl{
    
    bytes32 public constant ADMIN = keccak256("ADMIN");
    using IterableMapping for IterableMapping.Map;
    IterableMapping.Map private proposal;
    bool private status = false;
    address winner;

    constructor (){
        _grantRole(ADMIN, msg.sender);
    }

    function givePermission (address newAdmin) public onlyRole(ADMIN){
        grantRole(ADMIN, newAdmin);
    }

    function revokePermission (address oldAdmin) public onlyRole(ADMIN) {
        revokeRole(ADMIN, oldAdmin);
    }

	function sendProposal(address participant, uint256 newQuote) public onlyRole(ADMIN){
		require(status);
		proposal.set(participant, newQuote);
		
	}

	function openTender() public onlyRole(ADMIN) {
		status = true;
	}

	function closeTender() public onlyRole(ADMIN){
		status = false;
	}

    function getStatus() public view onlyRole(ADMIN)returns(bool){
        return status;
    }

	function proposalEvaluation() external onlyRole(ADMIN) returns (address){
        
        require(!status);
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
}
