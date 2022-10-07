// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20PermitSample is ERC20Permit {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialBalance
    ) ERC20(name, symbol) ERC20Permit(name) {
        _mint(msg.sender, initialBalance);
    }

    function getChainId() external view returns (uint256 chainId) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            chainId := chainid()
        }
    }

    uint8 private immutable _decimals = 6;

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    function permit(
        address holder,
        address spender,
        uint256 nonce,
        uint256 expiry,
        bool allowed,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(this.nonces(holder) == nonce, 'TestERC20PermitAllowed::permit: wrong nonce');
        permit(holder, spender, allowed ? type(uint256).max : 0, expiry, v, r, s);
    }
}
