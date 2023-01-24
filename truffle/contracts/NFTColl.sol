//SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTColl is ERC721URIStorage{

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    function Mint(address win, uint num, string memory URI) public{
        _mint(win, num);
        _setTokenURI(num, URI);

    }

}