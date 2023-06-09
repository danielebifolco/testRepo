//SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;
//portare la versione di solidity a 0.8.0

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

library IterableMapping {
    // Iterable mapping from address to uint;
    struct Map {
        address[] keys;
        mapping(address => uint256) values;
        mapping(address => uint256) indexOf;
        mapping(address => bool) inserted;
    }

    function get(Map storage map, address key) internal view returns (uint256) {
        return map.values[key];
    }

    function getKeyAtIndex(Map storage map, uint256 index)
        internal
        view
        returns (address)
    {
        return map.keys[index];
    }

    function size(Map storage map) internal view returns (uint256) {
        return map.keys.length;
    }

    function set(
        Map storage map,
        address key,
        uint256 val
    ) internal {
        //Each participant can submit only one proposals
        if (!map.inserted[key]) {
            map.inserted[key] = true;
            map.values[key] = val;
            map.indexOf[key] = map.keys.length;
            map.keys.push(key);
        } else {
            revert("value waw submitted 2 times");
        }
    }

    function remove(Map storage map, address key) internal {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.values[key];

        uint256 index = map.indexOf[key];
        uint256 lastIndex = map.keys.length - 1;
        address lastKey = map.keys[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

        map.keys[index] = lastKey;
        map.keys.pop();
    }
}

contract Tender is Ownable {
    using IterableMapping for IterableMapping.Map;

    enum Status {
        Open,
        Close
    }

    // Function cannot be called at this time.
    error FunctionInvalidAtThisStage();

    // This is the current status.
    Status private status = Status.Close;
    IterableMapping.Map private proposals;
    address private winner;
    uint256 private minProposal = 0;

    //status modifier
    modifier atStage(Status stage_) {
        if (status != stage_) revert FunctionInvalidAtThisStage();
        _;
    }

    //GET and SET functions
    function openTender() public onlyOwner {
        status = Status.Open;
    }

    function closeTender() public onlyOwner {
        require(winner != address(0));
        status = Status.Close;
    }

    function getStatus() public view onlyOwner returns (bool) {
        if (status == Status.Open) {
            return true;
        } else {
            return false;
        }
    }

    //core functions
    function getWinner()
        public
        view
        onlyOwner
        atStage(Status.Close)
        returns (address)
    {
        return (winner);
    }

    function sendProposal(address participant, uint256 newQuote)
        public
        onlyOwner
        atStage(Status.Open)
    {
        //Checks, migliorare i controlli
        require(newQuote > 0);
        //Effects
        proposals.set(participant, newQuote);
        if ((minProposal == 0) || (newQuote < minProposal)){
            minProposal = newQuote;
            winner = participant;
        }
    }
}
