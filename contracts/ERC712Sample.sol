// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract ERC712Sample is Context, EIP712 {
    mapping(address => uint256) public signers;

    // owner address -> nonce
    mapping(address => uint256) public nonces;

    constructor() EIP712("ERC712Sample", "1") {}

    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    string public constant NAME = "ERC712Sample";

    /**
     * @notice The EIP-712 typehash for the contract's domain
     **/
    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,uint256 chainId,address verifyingContract)"
        );

    /**
     * @notice The EIP-712 typehash for the message struct used by the contract
     **/
    bytes32 public constant MESSAGE_TYPEHASH =
        keccak256("Message(uint256 paramOne,bool paramTwo)");

    function castSig(
        uint256 paramOne,
        bool paramTwo,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        bytes32 domainSeparator = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256(bytes(NAME)),
                getChainId(),
                address(this)
            )
        );
        bytes32 structHash = keccak256(
            abi.encode(MESSAGE_TYPEHASH, paramOne, paramTwo)
        );

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", domainSeparator, structHash)
        );
        address signatory = ecrecover(digest, v, r, s);
        signers[signatory] += 1;
    }

    function getChainId() internal view returns (uint256) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        return chainId;
    }
}
