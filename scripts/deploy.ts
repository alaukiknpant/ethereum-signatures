import { constants, Wallet } from "ethers";
import { ethers } from "hardhat";
import { ERC20PermitSample } from "../typechain-types";
import { getPermitSignature } from "../utils/permit";

async function main() {
  const tokenName = "ERC20-Permit-Sample";
  let wallet: Wallet;
  let other: Wallet;
  let erc20PermitSampleContract: ERC20PermitSample;

  const wallets = await (ethers as any).getSigners();
  [wallet, other] = wallets;

  const ERC20PermitSample = await ethers.getContractFactory(
    "ERC20PermitSample"
  );
  const erc20PermitSample = await ERC20PermitSample.deploy(
    tokenName,
    "EPS",
    ethers.utils.parseUnits("40000", 6)
  );

  erc20PermitSampleContract =
    (await erc20PermitSample.deployed()) as ERC20PermitSample;

  console.log(
    `Balance of wallet:${wallet.address} prior to signing:`,
    await erc20PermitSampleContract.balanceOf(wallet.address)
  );
  console.log(
    `Balance of other:${other.address} prior to signing:`,
    await erc20PermitSampleContract.balanceOf(other.address)
  );
  console.log(
    `Allowance of ${other.address} prior to signing:`,
    await erc20PermitSampleContract.allowance(wallet.address, other.address)
  );

  const value = ethers.utils.parseUnits("10000", 6);

  const { v, r, s } = await getPermitSignature(
    wallet,
    erc20PermitSampleContract,
    other.address,
    value
  );

  console.log("Signing the message for allowance...");

  await erc20PermitSampleContract[
    "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"
  ](wallet.address, other.address, value, constants.MaxUint256, v, r, s);

  console.log(
    `Allowance of ${other.address} after signing:`,
    await erc20PermitSampleContract.allowance(wallet.address, other.address)
  );
  console.log("Transferring ERC20 from wallet to other");
  await erc20PermitSampleContract
    .connect(other)
    .transferFrom(
      wallet.address,
      other.address,
      await erc20PermitSampleContract.allowance(wallet.address, other.address)
    );
  console.log(
    `Balance of wallet:${wallet.address} after signing and transferring:`,
    await erc20PermitSampleContract.balanceOf(wallet.address)
  );
  console.log(
    `Balance of other:${other.address} after signing and transferring:`,
    await erc20PermitSampleContract.balanceOf(other.address)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
