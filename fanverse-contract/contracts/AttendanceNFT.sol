// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AttendanceNFT {
    struct NFTMetadata {
        string eventName;
        string eventDate;
        string eventType;
        string rarity;
        string imageUrl;
        uint32 attendanceCount;
        uint64 timestamp;
    }

    address public immutable owner;
    uint256 public nextTokenId;
    
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(address => uint256[]) public userNFTs;
    mapping(uint256 => address) public tokenOwner;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string rarity);

    constructor() {
        owner = msg.sender;
        nextTokenId = 1;
    }

    // 🟢 Fonction pour NFT Common
    function mintCommonNFT(
        address to,
        string calldata eventName,
        string calldata eventDate,
        string calldata eventType,
        uint32 attendanceCount
    ) external returns (uint256) {
        require(msg.sender == owner, "Seul l'owner peut mint");
        return _mintNFT(to, eventName, eventDate, eventType, "Common", attendanceCount);
    }

    // 🔵 Fonction pour NFT Rare
    function mintRareNFT(
        address to,
        string calldata eventName,
        string calldata eventDate,
        string calldata eventType,
        uint32 attendanceCount
    ) external returns (uint256) {
        require(msg.sender == owner, "Seul l'owner peut mint");
        return _mintNFT(to, eventName, eventDate, eventType, "Rare", attendanceCount);
    }

    // 🟣 Fonction pour NFT Epic
    function mintEpicNFT(
        address to,
        string calldata eventName,
        string calldata eventDate,
        string calldata eventType,
        uint32 attendanceCount
    ) external returns (uint256) {
        require(msg.sender == owner, "Seul l'owner peut mint");
        return _mintNFT(to, eventName, eventDate, eventType, "Epic", attendanceCount);
    }

    // 🟡 Fonction pour NFT Legendary
    function mintLegendaryNFT(
        address to,
        string calldata eventName,
        string calldata eventDate,
        string calldata eventType,
        uint32 attendanceCount
    ) external returns (uint256) {
        require(msg.sender == owner, "Seul l'owner peut mint");
        return _mintNFT(to, eventName, eventDate, eventType, "Legendary", attendanceCount);
    }

    // 🔧 Fonction interne commune
    function _mintNFT(
        address to,
        string memory eventName,
        string memory eventDate,
        string memory eventType,
        string memory rarity,
        uint32 attendanceCount
    ) private returns (uint256) {
        uint256 tokenId = nextTokenId++;
        
        // Générer URL d'image basée sur la rareté
        string memory imageUrl = _generateImageUrl(eventName, eventType, rarity);
        
        nftMetadata[tokenId] = NFTMetadata({
            eventName: eventName,
            eventDate: eventDate,
            eventType: eventType,
            rarity: rarity,
            imageUrl: imageUrl,
            attendanceCount: attendanceCount,
            timestamp: uint64(block.timestamp)
        });

        tokenOwner[tokenId] = to;
        userNFTs[to].push(tokenId);

        emit NFTMinted(to, tokenId, rarity);
        return tokenId;
    }

    function _generateImageUrl(
        string memory eventName,
        string memory eventType,
        string memory rarity
    ) private pure returns (string memory) {
        uint256 hash = uint256(keccak256(abi.encodePacked(eventName, eventType, rarity))) % 10000;
        return string(abi.encodePacked(
            "https://fanverse.io/nft/",
            eventType,
            "/",
            rarity,
            "/",
            _toString(hash)
        ));
    }

    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Fonctions utilitaires
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }

    function getNFTMetadata(uint256 tokenId) external view returns (NFTMetadata memory) {
        require(tokenId < nextTokenId, "NFT inexistant");
        return nftMetadata[tokenId];
    }

    function getTotalSupply() external view returns (uint256) {
        return nextTokenId - 1;
    }
}