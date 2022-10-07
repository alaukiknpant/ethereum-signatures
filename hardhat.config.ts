import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@nomiclabs/hardhat-ethers'
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv'

dotenv.config()



const balance = '100000000000000000000000000'
const accounts =
  [
        `0x${process.env.ACCOUNT_ONE}`,
        `0x${process.env.ACCOUNT_TWO}`,
        `0x${process.env.ACCOUNT_THREE}`,
        `0x${process.env.ACCOUNT_FOUR}`,
        `0x${process.env.ACCOUNT_FIVE}`,
        `0x${process.env.ACCOUNT_SIX}`,
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