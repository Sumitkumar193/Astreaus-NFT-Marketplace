var ERC721NFT = artifacts.require("ERC721NFT"); //Contract name -> addInfo

module.exports = function (deployer) {
    deployer.deploy(ERC721NFT);
}