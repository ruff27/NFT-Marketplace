// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    // The ERC721 token representing NFTs
    ERC721 public nftToken;

    // Struct to represent individual NFTs
    struct NFT {
        uint256 tokenId;
        string name;
        string description;
        uint256 price;
        bool isBought;
        bool isSold;
    }

    // Array to store NFTs
    NFT[] public nfts;

    // Events to log important actions
    event NFTAdded(uint256 indexed tokenId, string name, string description, uint256 price);
    event NFTBought(uint256 indexed tokenId, address buyer);
    event NFTSold(uint256 indexed tokenId, address seller);

    constructor(address _nftToken) {
        // Constructor to set the ERC721 token
        nftToken = ERC721(_nftToken);
    }

    function addNFT(string memory name, string memory description, uint256 price) public onlyOwner {
        // Function to add a new NFT to the marketplace
        uint256 tokenId = nfts.length;
        nfts.push(NFT(tokenId, name, description, price, false, false));
        emit NFTAdded(tokenId, name, description, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        // Function to buy an NFT
        require(tokenId < nfts.length, "Invalid NFT ID");
        NFT storage nft = nfts[tokenId];
        require(!nft.isBought, "NFT already bought");
        require(msg.value >= nft.price, "Insufficient funds");

        nftToken.transferFrom(owner(), msg.sender, nft.tokenId);
        nft.isBought = true;
        nft.isSold = true;
        emit NFTBought(tokenId, msg.sender);
        emit NFTSold(tokenId, owner());

        // Transfer funds to the seller (contract owner)
        address payable seller = payable(owner());
        seller.transfer(msg.value);
    }

    function sellNFT(uint256 tokenId) public onlyOwner {
        // Function to mark an NFT as sold by the owner
        require(tokenId < nfts.length, "Invalid NFT ID");
        NFT storage nft = nfts[tokenId];
        require(nft.isBought && !nft.isSold, "NFT cannot be sold");
        nft.isSold = true;
        emit NFTSold(tokenId, owner());
    }
}
