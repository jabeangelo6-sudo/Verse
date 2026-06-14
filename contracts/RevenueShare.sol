// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RevenueShare
 * @dev On-chain collaborative revenue splitting for co-authored content.
 * Creators set splits at publish time. Every tip/payment auto-distributes instantly.
 * No trust needed — splits are enforced by the contract forever.
 */
contract RevenueShare is ReentrancyGuard {
    struct Split {
        address[] recipients;
        uint256[] basisPoints; // must sum to 10000 (100%)
        string contentId;      // IPFS CID or post ID
        bool active;
    }

    mapping(bytes32 => Split) public splits;
    mapping(bytes32 => uint256) public totalEarned;

    event SplitCreated(bytes32 indexed splitId, address[] recipients, uint256[] bps, string contentId);
    event PaymentDistributed(bytes32 indexed splitId, address indexed from, uint256 total);

    error InvalidSplit();
    error SplitNotFound();
    error ZeroPayment();

    function createSplit(
        string calldata contentId,
        address[] calldata recipients,
        uint256[] calldata bps
    ) external returns (bytes32 splitId) {
        if (recipients.length != bps.length || recipients.length == 0) revert InvalidSplit();

        uint256 total = 0;
        for (uint i = 0; i < bps.length; i++) total += bps[i];
        if (total != 10000) revert InvalidSplit();

        splitId = keccak256(abi.encodePacked(contentId, msg.sender, block.timestamp));
        splits[splitId] = Split({ recipients: recipients, basisPoints: bps, contentId: contentId, active: true });

        emit SplitCreated(splitId, recipients, bps, contentId);
    }

    /**
     * @dev Send ETH to this function to distribute to all recipients instantly.
     */
    function distribute(bytes32 splitId) external payable nonReentrant {
        Split storage s = splits[splitId];
        if (!s.active) revert SplitNotFound();
        if (msg.value == 0) revert ZeroPayment();

        totalEarned[splitId] += msg.value;

        for (uint i = 0; i < s.recipients.length; i++) {
            uint256 share = (msg.value * s.basisPoints[i]) / 10000;
            if (share > 0) payable(s.recipients[i]).transfer(share);
        }

        emit PaymentDistributed(splitId, msg.sender, msg.value);
    }

    function getSplit(bytes32 splitId) external view returns (Split memory) {
        return splits[splitId];
    }

    function getRecipients(bytes32 splitId) external view returns (address[] memory, uint256[] memory) {
        Split storage s = splits[splitId];
        return (s.recipients, s.basisPoints);
    }
}
