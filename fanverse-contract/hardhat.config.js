require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    spicy: {
      url: "https://spicy-rpc.chiliz.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 88882
    },
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  defaultNetwork: "spicy"
};