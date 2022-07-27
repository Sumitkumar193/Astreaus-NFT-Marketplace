pragma solidity >= 0.7.0 < 0.9.0;
//"SPDX-License-Identifier: UNLICENSED

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ERC721NFT is ERC721URIStorage {

    uint private _tokenIds;
    string[] public hashes;
    mapping(string => bool) private isExist; //IPFS Hashes stored


    constructor() ERC721("AssetsForMobilio", "AFM") {
        hashes.push("First Hash that is pushed to hashes Array for testing!");
    }

    function mint(string memory hash) public returns(uint) {
        require(isExist[hash] == false, "hash/token already exist");
        isExist[hash] = true;
        _tokenIds += 1;
        uint newTokenId = _tokenIds;
        hashes.push(hash);
        _mint(_msgSender(), newTokenId);
        _setTokenURI(newTokenId, hash);
        return newTokenId;
    }

    function intToEther(uint price) public pure returns (uint){
        return price*1 ether;
    }

    function getString(uint id) public view returns (string memory){
        return hashes[id];
    }

}