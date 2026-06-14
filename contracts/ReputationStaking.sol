// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ReputationStaking
 * @dev Creators stake their own tokens on bold claims. Community bets TRUE/FALSE.
 * If the creator is right: creator earns from the FALSE pool, TRUE bettors earn proportionally.
 * If the creator is wrong: creator loses their stake, FALSE bettors earn.
 * Resolution is by community vote (token-weighted) after deadline.
 */
contract ReputationStaking is Ownable, ReentrancyGuard {
    enum Outcome { Unresolved, True, False }

    struct Claim {
        address creator;
        string topic;
        uint256 creatorStake;    // creator's tokens at risk
        uint256 truePool;        // community bets on TRUE
        uint256 falsePool;       // community bets on FALSE
        uint256 deadline;
        Outcome outcome;
        bool creatorClaimedTrue; // creator always bets TRUE on their own claim
    }

    uint256 private _nextId = 1;
    mapping(uint256 => Claim) public claims;
    mapping(uint256 => mapping(address => uint256)) public trueBets;
    mapping(uint256 => mapping(address => uint256)) public falseBets;
    mapping(uint256 => mapping(address => bool)) public claimed;

    event ClaimCreated(uint256 indexed id, address indexed creator, string topic, uint256 stake, uint256 deadline);
    event BetPlaced(uint256 indexed id, address indexed bettor, bool isTrue, uint256 amount);
    event ClaimResolved(uint256 indexed id, Outcome outcome);
    event WinningsClaimed(uint256 indexed id, address indexed user, uint256 amount);

    error DeadlinePassed();
    error DeadlineNotReached();
    error AlreadyResolved();
    error AlreadyClaimed();
    error ZeroAmount();

    constructor() Ownable(msg.sender) {}

    function createClaim(string calldata topic, uint256 deadline) external payable returns (uint256 id) {
        if (msg.value == 0) revert ZeroAmount();
        id = _nextId++;
        claims[id] = Claim({
            creator: msg.sender, topic: topic, creatorStake: msg.value,
            truePool: msg.value, falsePool: 0, deadline: deadline,
            outcome: Outcome.Unresolved, creatorClaimedTrue: true
        });
        trueBets[id][msg.sender] = msg.value;
        emit ClaimCreated(id, msg.sender, topic, msg.value, deadline);
    }

    function bet(uint256 id, bool isTrue) external payable nonReentrant {
        Claim storage c = claims[id];
        if (block.timestamp > c.deadline) revert DeadlinePassed();
        if (c.outcome != Outcome.Unresolved) revert AlreadyResolved();
        if (msg.value == 0) revert ZeroAmount();

        if (isTrue) { c.truePool += msg.value; trueBets[id][msg.sender] += msg.value; }
        else { c.falsePool += msg.value; falseBets[id][msg.sender] += msg.value; }

        emit BetPlaced(id, msg.sender, isTrue, msg.value);
    }

    // Platform resolves after community vote (simplified — in prod: token-weighted vote)
    function resolve(uint256 id, bool isTrue) external onlyOwner {
        Claim storage c = claims[id];
        if (block.timestamp < c.deadline) revert DeadlineNotReached();
        if (c.outcome != Outcome.Unresolved) revert AlreadyResolved();
        c.outcome = isTrue ? Outcome.True : Outcome.False;
        emit ClaimResolved(id, c.outcome);
    }

    function claimWinnings(uint256 id) external nonReentrant {
        Claim storage c = claims[id];
        if (c.outcome == Outcome.Unresolved) revert DeadlineNotReached();
        if (claimed[id][msg.sender]) revert AlreadyClaimed();

        claimed[id][msg.sender] = true;
        uint256 payout = 0;
        uint256 total = c.truePool + c.falsePool;

        if (c.outcome == Outcome.True) {
            uint256 myBet = trueBets[id][msg.sender];
            if (myBet > 0) payout = (myBet * total) / c.truePool;
        } else {
            uint256 myBet = falseBets[id][msg.sender];
            if (myBet > 0) payout = (myBet * total) / c.falsePool;
        }

        if (payout > 0) {
            payable(msg.sender).transfer(payout);
            emit WinningsClaimed(id, msg.sender, payout);
        }
    }

    function getClaim(uint256 id) external view returns (Claim memory) { return claims[id]; }
}
