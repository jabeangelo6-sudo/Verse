// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title ContentNFT
 * @dev ERC-1155 for token-gated content passes.
 * Each post/collection gets an ID. Holding a pass = access to exclusive content.
 * Implements EIP-2981 for on-chain royalties on secondary sales.
 */
contract ContentNFT is ERC1155, Ownable, IERC2981 {
    uint256 public constant PLATFORM_FEE_BPS = 250; // 2.5%
    uint96 public constant ROYALTY_BPS = 1000;       // 10% creator royalty

    struct Pass {
        address creator;
        uint256 price;        // price in ETH
        uint256 maxSupply;    // 0 = unlimited
        uint256 minted;
        string contentCID;    // IPFS CID of the gated content
        bool active;
    }

    address public immutable platform;
    uint256 private _nextId = 1;
    mapping(uint256 => Pass) public passes;
    mapping(uint256 => string) private _uris;

    event PassCreated(uint256 indexed id, address indexed creator, string contentCID, uint256 price);
    event PassMinted(uint256 indexed id, address indexed buyer, uint256 price);

    error PassNotActive();
    error MaxSupplyReached();
    error InsufficientPayment();

    constructor(address _platform) ERC1155("") Ownable(msg.sender) {
        platform = _platform;
    }

    /**
     * @dev Creator creates a new gated content pass.
     */
    function createPass(
        uint256 price,
        uint256 maxSupply,
        string calldata contentCID,
        string calldata metadataURI
    ) external returns (uint256 id) {
        id = _nextId++;
        passes[id] = Pass({
            creator: msg.sender,
            price: price,
            maxSupply: maxSupply,
            minted: 0,
            contentCID: contentCID,
            active: true
        });
        _uris[id] = metadataURI;
        emit PassCreated(id, msg.sender, contentCID, price);
    }

    /**
     * @dev Buy a content pass. Grants access to the gated content.
     */
    function mint(uint256 id) external payable {
        Pass storage pass = passes[id];
        if (!pass.active) revert PassNotActive();
        if (pass.maxSupply > 0 && pass.minted >= pass.maxSupply) revert MaxSupplyReached();
        if (msg.value < pass.price) revert InsufficientPayment();

        uint256 fee = (pass.price * PLATFORM_FEE_BPS) / 10000;
        uint256 creatorShare = pass.price - fee;

        pass.minted++;
        _mint(msg.sender, id, 1, "");

        payable(platform).transfer(fee);
        payable(pass.creator).transfer(creatorShare);

        if (msg.value > pass.price) {
            payable(msg.sender).transfer(msg.value - pass.price);
        }

        emit PassMinted(id, msg.sender, pass.price);
    }

    /**
     * @dev Check if an address holds a pass for content ID.
     */
    function hasAccess(address user, uint256 id) external view returns (bool) {
        return balanceOf(user, id) > 0;
    }

    /**
     * @dev EIP-2981: royalty info for secondary sales.
     */
    function royaltyInfo(uint256 id, uint256 salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
        receiver = passes[id].creator;
        royaltyAmount = (salePrice * ROYALTY_BPS) / 10000;
    }

    function uri(uint256 id) public view override returns (string memory) {
        return _uris[id];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}
