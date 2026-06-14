// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EarlyBeliever
 * @dev Soulbound NFT minted when a user follows a creator before they hit a threshold.
 * Non-transferable — proof of genuine early support, not purchasable.
 * Tier: Genesis (<100 followers), Founding (<500), Early (<1000).
 */
contract EarlyBeliever is ERC721, Ownable {
    struct Badge {
        address creator;
        uint256 followerCountAtFollow;
        uint256 threshold;
        uint256 mintedAt;
        uint8 tier; // 0=Early, 1=Founding, 2=Genesis
    }

    uint256 private _nextId = 1;
    mapping(uint256 => Badge) public badges;
    mapping(address => mapping(address => bool)) public hasBadge; // fan => creator => has badge
    mapping(address => uint256) public creatorFollowerCount;

    address public immutable platform;

    event BadgeMinted(address indexed fan, address indexed creator, uint256 tokenId, uint8 tier, uint256 followerCount);
    event FollowerCountUpdated(address indexed creator, uint256 newCount);

    error AlreadyHasBadge();
    error ThresholdNotMet();
    error Soulbound();

    constructor(address _platform) ERC721("Verse Early Believer", "VBELIEVE") Ownable(msg.sender) {
        platform = _platform;
    }

    /**
     * @dev Platform calls this when a user follows a creator whose count is below threshold.
     */
    function mintBadge(address fan, address creator, uint256 currentFollowers, uint256 threshold) external returns (uint256 id) {
        if (hasBadge[fan][creator]) revert AlreadyHasBadge();
        if (currentFollowers >= threshold) revert ThresholdNotMet();

        uint8 tier = currentFollowers < 100 ? 2 : currentFollowers < 500 ? 1 : 0;
        id = _nextId++;

        badges[id] = Badge({ creator: creator, followerCountAtFollow: currentFollowers, threshold: threshold, mintedAt: block.timestamp, tier: tier });
        hasBadge[fan][creator] = true;
        _mint(fan, id);

        emit BadgeMinted(fan, creator, id, tier, currentFollowers);
    }

    function updateFollowerCount(address creator, uint256 newCount) external {
        creatorFollowerCount[creator] = newCount;
        emit FollowerCountUpdated(creator, newCount);
    }

    function getBadge(uint256 id) external view returns (Badge memory) {
        return badges[id];
    }

    // Soulbound: block all transfers
    function transferFrom(address, address, uint256) public pure override {
        revert Soulbound();
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert Soulbound();
    }
}
