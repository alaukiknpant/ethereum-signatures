import { expect } from "chai";
import { ethers } from "hardhat";
import { getPermitSignature } from "../utils/permit";
import { constants, Wallet } from "ethers";
import { ERC20PermitSample } from "../typechain-types";

describe("ERC20PermitSample", function () {
  const tokenName = "ERC20-Permit-Sample";
  let wallet: Wallet;
  let other: Wallet;
  let erc20PermitSampleContract: ERC20PermitSample;

  before(async () => {
    const wallets = await (ethers as any).getSigners();
    [wallet, other] = wallets;
  });

  beforeEach(async () => {
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
  });

  describe("Deployment", function () {
    it("Should set the right erc20 name, decimals etc", async function () {
      expect(await erc20PermitSampleContract.name()).to.equal(tokenName);
      expect(await erc20PermitSampleContract.decimals()).to.equal(6);
    });
  });

  describe("Permit", function () {
    it("Should set permissions for allowance via signatures", async function () {
      const wallets = await (ethers as any).getSigners();
      [wallet, other] = wallets;

      const value = ethers.utils.parseUnits("10000", 6);

      const { v, r, s } = await getPermitSignature(
        wallet,
        erc20PermitSampleContract,
        other.address,
        value
      );

      expect(
        await erc20PermitSampleContract.allowance(wallet.address, other.address)
      ).to.be.eq(0);
      await erc20PermitSampleContract[
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"
      ](wallet.address, other.address, value, constants.MaxUint256, v, r, s);
      expect(
        await erc20PermitSampleContract.allowance(wallet.address, other.address)
      ).to.be.eq(value);

      await expect(
        erc20PermitSampleContract
          .connect(other)
          .transferFrom(wallet.address, other.address, value)
      ).to.not.be.reverted;
    });
  });
});
