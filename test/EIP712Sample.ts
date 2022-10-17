import { expect } from "chai";
import { ethers } from "hardhat";
import { TypedDataDomain, TypedDataField } from "ethers";
import { EIP712Sample } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Record, Number, Boolean, Static } from "runtypes";
import { splitSignature } from "ethers/lib/utils";

const Message = Record({
  paramOne: Number,
  paramTwo: Boolean,
});

export type Message = Static<typeof Message>;

describe("ERC712Sample", function () {
  let wallet: SignerWithAddress;
  let other: SignerWithAddress;
  let eip712SampleContract: EIP712Sample;
  let domain: TypedDataDomain;
  let types: globalThis.Record<string, TypedDataField[]>;
  let msg: Message;
  let typesInvalid: globalThis.Record<string, TypedDataField[]>;

  before(async () => {
    const wallets = await (ethers as any).getSigners();
    [wallet, other] = wallets;

    types = {
      Message: [
        { name: "paramOne", type: "uint256" },
        { name: "paramTwo", type: "bool" },
      ],
    };

    typesInvalid = {
      MessageInvalid: [
        { name: "paramOne", type: "uint256" },
        { name: "paramTwo", type: "bool" },
      ],
    };

    msg = {
      paramOne: 1,
      paramTwo: true,
    };
  });

  beforeEach(async () => {
    const ERC712Sample = await ethers.getContractFactory("ERC712Sample");
    const erc712Sample = await ERC712Sample.deploy();

    eip712SampleContract = (await erc712Sample.deployed()) as EIP712Sample;
    domain = {
      name: "ERC712Sample",
      chainId: 31337,
      verifyingContract: eip712SampleContract.address,
    };
  });

  describe("EIP712Signatures", function () {
    it("Sets the signature count for valid signature", async function () {
      const wallets = await (ethers as any).getSigners();
      [wallet, other] = wallets;

      const signatures = await wallet._signTypedData(domain, types, msg);
      const { v, r, s } = splitSignature(signatures);

      expect(await eip712SampleContract.signers(wallet.address)).to.equal(0);
      await eip712SampleContract.connect(other).castSig(msg.paramOne, true, v, r, s);
      expect(await eip712SampleContract.signers(wallet.address)).to.equal(1);
      await eip712SampleContract.connect(other).castSig(msg.paramOne, true, v, r, s);
      expect(await eip712SampleContract.signers(wallet.address)).to.equal(2);
    });

    it("Does not set the signature count for invalid signature", async function () {
      const wallets = await (ethers as any).getSigners();
      [wallet, other] = wallets;

      const signatures = await wallet._signTypedData(domain, typesInvalid, msg);
      const { v, r, s } = splitSignature(signatures);

      expect(await eip712SampleContract.signers(wallet.address)).to.equal(0);
      await eip712SampleContract.connect(other).castSig(msg.paramOne, true, v, r, s);
      expect(await eip712SampleContract.signers(wallet.address)).to.equal(0);
      await eip712SampleContract.connect(other).castSig(msg.paramOne, true, v, r, s);
      expect(await eip712SampleContract.signers(wallet.address)).to.equal(0);

     
    });
  });
});
