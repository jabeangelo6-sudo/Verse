// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title SubscriptionNFT
 * @dev Transferable ERC-721 subscription passes.
 * Unlike platform subscriptions, these are owned assets — fans can resell them.
 * Creator earns 10% royalty on every secondary sale (EIP-2981).
 * Three tiers: Founding, Supporter, Fan — each with fixed supply and price.
 */
contract SubscriptionNFT is ERC721, IERC2981 {
    struct Tier {
        string name;
        uint256 price;
        uint256 maxSupply;
        uint256 minted;
        uint96 royaltyBps;
    }

    address public immutable creator;
    address public immutable platform;
    uint256 public constant PLATFORM_FEE_BPS = 250;

    uint256 private _nextId = 1;
    mapping(uint256 => uint8) public tokenTier;
    Tier[3] public tiers;

    event Minted(address indexed buyer, uint8 tier, uint256 tokenId, uint256 price);

    error TierSoldOut();
    error InsufficientPayment();
    error InvalidTier();

    constructor(address _creator, address _platform) ERC721("Verse Subscription", "VSUB") {
        creator = _creator;
        platform = _platform;
        // Founding tier
        tiers[0] = Tier("Founding", 0.12 ether, 50, 0, 1000);
        // Supporter tier
        tiers[1] = Tier("Supporter", 0.04 ether, 200, 0, 1000);
        // Fan tier
        tiers[2] = Tier("Fan", 0.01 ether, 500, 0, 1000);
    }

    function mint(uint8 tierId) external payable returns (uint256 id) {
        if (tierId > 2) revert InvalidTier();
        Tier storage tier = tiers[tierId];
        if (tier.minted >= tier.maxSupply) revert TierSoldOut();
        if (msg.value < tier.price) revert InsufficientPayment();

        uint256 fee = (tier.price * PLATFORM_FEE_BPS) / 10000;
        id = _nextId++;
        tier.minted++;
        tokenTier[id] = tierId;
        _mint(msg.sender, id);

        payable(platform).transfer(fee);
        payable(creator).transfer(tier.price - fee);
        if (msg.value > tier.price) payable(msg.sender).transfer(msg.value - tier.price);

        emit Minted(msg.sender, tierId, id, tier.price);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view override returns (address receiver, uint256 amount) {
        uint8 tierId = tokenTier[tokenId];
        receiver = creator;
        amount = (salePrice * tiers[tierId].royaltyBps) / 10000;
    }

    function getTier(uint8 id) external view returns (Tier memory) { return tiers[id]; }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}
