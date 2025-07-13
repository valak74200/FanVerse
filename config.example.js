// Configuration d'exemple pour FanVerse
// Copiez ce fichier vers config.js et modifiez les valeurs selon vos besoins

module.exports = {
  // Frontend Configuration
  frontend: {
    port: 3000,
    apiUrl: 'http://localhost:5000',
    blockchainUrl: 'http://localhost:8545',
    contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    features: {
      enable3D: true,
      enableChat: true,
      enableBetting: true
    }
  },

  // Backend Configuration
  backend: {
    port: 5000,
    corsOrigin: 'http://localhost:3000',
    database: {
      url: 'mongodb://localhost:27017/fanverse',
      name: 'fanverse'
    },
    jwt: {
      secret: 'your-jwt-secret-here',
      expiresIn: '24h'
    },
    socket: {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    }
  },

  // Blockchain Configuration
  blockchain: {
    network: 'localhost',
    url: 'http://localhost:8545',
    chainId: 31337,
    accounts: {
      // Hardhat default accounts
      deployer: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      user1: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
    },
    contracts: {
      fanverseToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      fanverseNFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      bettingContract: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
    }
  },

  // Development Configuration
  development: {
    enableHotReload: true,
    enableDebugLogs: true,
    enableMockData: true
  }
}; 