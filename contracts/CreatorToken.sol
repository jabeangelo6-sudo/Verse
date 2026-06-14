// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreatorToken
 * @dev ERC-20 creator token with bonding curve pricing.
 * Price increases as supply increases — early supporters benefit most.
 * Creators earn a 5% fee on every buy/sell.
 */
contract CreatorToken is ERC20, Ownable {
    uint256 public constant PROTOCOL_FEE_BPS = 250;  // 2.5%
    uint256 public constant CREATOR_FEE_BPS = 500;   // 5%
    uint256 public constant SLOPE = 1e12;             // bonding curve slope

    address public immutable creator;
    address public immutable platform;
    uint256 public poolBalance;

    event Buy(address indexed buyer, uint256 tokenAmount, uint256 ethAmount);
    event Sell(address indexed seller, uint256 tokenAmount, uint256 ethAmount);

    error InsufficientPayment();
    error SlippageExceeded();

    constructor(
        string memory name,
        string memory symbol,
        address _creator,
        address _platform
    ) ERC20(name, symbol) Ownable(_creator) {
        creator = _creator;
        platform = _platform;
    }

    /**
     * @dev Returns the price in ETH to buy `amount` tokens given current supply.
     * Uses linear bonding curve: price = SLOPE * supply
     */
    function getBuyPrice(uint256 amount) public view returns (uint256) {
        uint256 supply = totalSupply();
        // Area under the curve from supply to supply+amount
        // integral of SLOPE*x dx from supply to supply+amount
        return (SLOPE * (2 * supply + amount) * amount) / 2e18;
    }

    /**
     * @dev Returns ETH received for selling `amount` tokens.
     */
    function getSellPrice(uint256 amount) public view returns (uint256) {
        uint256 supply = totalSupply();
        if (amount > supply) revert SlippageExceeded();
        return (SLOPE * (2 * supply - amount) * amount) / 2e18;
    }

    /**
     * @dev Buy tokens. ETH sent must >= getBuyPrice(amount).
     */
    function buy(uint256 amount, uint256 maxCost) external payable {
        uint256 cost = getBuyPrice(amount);
        if (msg.value < cost) revert InsufficientPayment();
        if (cost > maxCost) revert SlippageExceeded();

        uint256 protocolFee = (cost * PROTOCOL_FEE_BPS) / 10000;
        uint256 creatorFee = (cost * CREATOR_FEE_BPS) / 10000;

        poolBalance += cost - protocolFee - creatorFee;

        _mint(msg.sender, amount);

        payable(platform).transfer(protocolFee);
        payable(creator).transfer(creatorFee);

        // Refund excess ETH
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit Buy(msg.sender, amount, cost);
    }

    /**
     * @dev Sell tokens back to the curve for ETH.
     */
    function sell(uint256 amount, uint256 minReturn) external {
        uint256 proceeds = getSellPrice(amount);
        if (proceeds < minReturn) revert SlippageExceeded();

        uint256 protocolFee = (proceeds * PROTOCOL_FEE_BPS) / 10000;
        uint256 creatorFee = (proceeds * CREATOR_FEE_BPS) / 10000;
        uint256 net = proceeds - protocolFee - creatorFee;

        poolBalance -= proceeds;
        _burn(msg.sender, amount);

        payable(msg.sender).transfer(net);
        payable(platform).transfer(protocolFee);
        payable(creator).transfer(creatorFee);

        emit Sell(msg.sender, amount, net);
    }

    receive() external payable {
        poolBalance += msg.value;
    }
}
