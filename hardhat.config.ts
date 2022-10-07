import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@nomiclabs/hardhat-ethers'
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv'
import { ethers } from 'hardhat'

dotenv.config()

const balance = '100000000000000000000000000'

// uncomment if you have set secrets
// const accounts =
//   [
//         `0x${process.env.ACCOUNT_ONE}`,
//         `0x${process.env.ACCOUNT_TWO}`,
//         `0x${process.env.ACCOUNT_THREE}`,
//         `0x${process.env.ACCOUNT_FOUR}`,
//         `0x${process.env.ACCOUNT_FIVE}`,
//         `0x${process.env.ACCOUNT_SIX}`,
//       ]

const accounts = [
  `0xfee7e465e0ad62432ed944ed350c1e22a3eef570f35b58f87c9be4e24ef2e15a`,
  `0xe27cc62cc1942ea6045f3b6108b5bd82b060848fdb5ee53ca9ba2b4211af1b94`,
  `0xdeacd7baa598477585e8093a15f06b2bdb47048a887a4cd421fb1d6eb3a40a6d`,
  `0xde74a0ba709c8e3429d1b80edc82ddcd9117692ad596ec3091185bf20184ef67`,
  `0x6fe0320beb191a98c08eeee3e2f271d8276f3f060f8141cd1ceb88a38e86b361`,
  `0xe9572c11a026ffbfbaa1d3cb74fe599d5b10e486c1c86a11d2650aee1f75a518`,
]

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: accounts[0],
          balance: balance,
        },
        {
          privateKey: accounts[1],
          balance: balance,
        },
        {
          privateKey: accounts[2],
          balance: balance,
        },

        {
          privateKey: accounts[3],
          balance: balance,
        },
        {
          privateKey: accounts[4],
          balance: balance,
        },
        {
          privateKey: accounts[5],
          balance: balance,
        },
      ],
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      accounts: accounts,
    },

    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: accounts,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

export default config