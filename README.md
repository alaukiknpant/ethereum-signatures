# Signing Messages in Ethereum


EIP is a peer-reviewed and improved way of off-chain message signing for use on-chain. Off-chain signing is useful as it saves gas and reduces the number of transactions on the blockchain. What kind of messages can we sign? Ethereum has two kinds of messages
1. transactions 𝕋 - signed using eth_sendTransaction
2. bytestrings 𝔹⁸ⁿ. signed using eth_sign

You might be interested in sigining transactions for, say, approving an ERC20 token for a contract to use. Anoer example includes Opensea where you can leave an offer to buy an item by signing a transaction. But on-chain it will be approved only when the seller selects 1 of the offers, and then accepts it, by paying for the broadcast.

You might be interested in signing messages to agree to the terms and conditions of a platform. This repo explores how messages are signed in ethereum using the EIP712 standard. In particular, we explore signing messages to vote on behalf of a user using EIP-712 and permitting a ERC-20 token approval using EIP-2612.


## EIP-712: Typed structured data hashing and signing

`EIP712Sample.sol` explores signing a message on behalf of another user off chain.


## EIP-2612: EIP-20 Permit Extension: Signed Approvals

`ERC20PermitSample` explores this. In order to interact with ERC20 tokens via smart contracts, users have to `approve()` the smart contract, which in turn invokes a `transferFrom()`. Given this flow, [even in the simple use case of paying another person, they need to hold ETH to pay for transaction gas costs. ERC-2612 extends the EIP-20 standard with a new function permit, which allows users to modify the allowance mapping using a signed message, instead of through msg.sender. The signed data is structured following EIP-712, which already has wide spread adoption in major RPC providers](https://eips.ethereum.org/EIPS/eip-2612).

As interesting as EIP-2612 sounds, not all major ERC20s [support](https://help.1inch.io/en/articles/5435386-permit-712-signed-token-approvals-and-how-they-work-on-1inch) this standard, namely USDC and USDT. DAI was an early adopter of EIP-2612. The code in this repo demonstrates using EIP-2612.


## TODO: EIP-3009: Transfer With Authorization 

A contract interface that enables transferring of fungible assets via a signed authorization. USDC might allow EIP-3009. More research will follow.


## TODO: EIP-1271: Standard Signature Validation Method for Contracts

## References to note

| EIP  | Reference |
| ------------- | ------------- |
| 712  | [How to: EIP712 and Ethers.js](https://github.com/ethers-io/ethers.js/discussions/2280) |
| 712 | [EIP712 is here by Koh Wei Jie](https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26#:~:text=This%20standard%20allows%20wallets%20to,can%20be%20confusing%20and%20insecure) |
| 2612  | [Library for signed approvals](https://github.com/1inch/permit-signed-approvals-utils) |
| 2612 | [How uniswap implements 2612](https://github.com/Uniswap/v3-periphery/blob/main/test/shared/permit.ts)|



## Scripts

```
git clone git@github.com:alaukiknpant/ethereum-signatures.git
cd ethereum-signatures
yarn install
yarn hardhat compile
yarn hardhat test
yarn hardhat run scripts/deploy.ts
```
