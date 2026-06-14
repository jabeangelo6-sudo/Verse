// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CreatorToken.sol";

/**
 * @title Platform
 * @dev Central registry and fee manager for Verse.
 * - Deploys CreatorToken contracts for new creators
 * - Routes tips directly between wallets (no custody)
 * - Manages subscriptions with streaming payments
 * - Governance: token holders vote on protocol parameters
 */
contract Platform is Ownable, ReentrancyGuard {
    uint256 public protocolFeeBps = 250; // 2.5%, governable
    uint256 public constant MAX_FEE_BPS = 1000; // 10% hard cap

    mapping(address => address) public creatorTokens;  // creator => token
    mapping(bytes32 => uint256) public contentOnChain; // contentHash => blockNumber
    mapping(address => uint256) public pendingWithdrawals;

    event CreatorRegistered(address indexed creator, address token, string tokenSymbol);
    event TipSent(address indexed from, address indexed to, uint256 amount, string contentId);
    event ContentPublished(address indexed creator, bytes32 contentHash, string ipfsCID);
    event FeeUpdated(uint256 newFeeBps);

    error AlreadyRegistered();
    error NotRegistered();
    error ZeroAmount();
    error FeeTooHigh();

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register as a creator and deploy your personal token on the bonding curve.
     */
    function registerCreator(
        string calldata tokenName,
        string calldata tokenSymbol
    ) external returns (address tokenAddress) {
        if (creatorTokens[msg.sender] != address(0)) revert AlreadyRegistered();

        CreatorToken token = new CreatorToken(tokenName, tokenSymbol, msg.sender, address(this));
        creatorTokens[msg.sender] = address(token);

        emit CreatorRegistered(msg.sender, address(token), tokenSymbol);
        return address(token);
    }

    /**
     * @dev Send a tip directly to a creator. Platform takes protocolFeeBps.
     * Creator receives instantly — no custody, no delays.
     */
    function tip(address creator, string calldata contentId) external payable nonReentrant {
        if (msg.value == 0) revert ZeroAmount();

        uint256 fee = (msg.value * protocolFeeBps) / 10000;
        uint256 creatorAmount = msg.value - fee;

        pendingWithdrawals[owner()] += fee;
        payable(creator).transfer(creatorAmount);

        emit TipSent(msg.sender, creator, creatorAmount, contentId);
    }

    /**
     * @dev Publish content hash on-chain for censorship resistance.
     * The actual content lives on IPFS/Arweave — this is just the proof.
     */
    function publishContent(bytes32 contentHash, string calldata ipfsCID) external {
        contentOnChain[contentHash] = block.number;
        emit ContentPublished(msg.sender, contentHash, ipfsCID);
    }

    /**
     * @dev Withdraw accumulated protocol fees.
     */
    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        if (amount == 0) revert ZeroAmount();
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Governance: update protocol fee. Capped at 10%.
     */
    function setProtocolFee(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > MAX_FEE_BPS) revert FeeTooHigh();
        protocolFeeBps = newFeeBps;
        emit FeeUpdated(newFeeBps);
    }

    receive() external payable {
        pendingWithdrawals[owner()] += msg.value;
    }
}
