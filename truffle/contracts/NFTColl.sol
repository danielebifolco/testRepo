//SPDX-License-Identifier: MIT
pragma solidity >=0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTColl is ERC721URIStorage, Ownable{
   
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    function Mint(address win, uint id, string memory URI) public onlyOwner{
        _mint(win, id);
        _setTokenURI(id, URI);
    }
}
