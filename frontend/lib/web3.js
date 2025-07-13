import { ethers } from 'ethers';

// Configuration du réseau Chiliz Spicy Testnet
const CHILIZ_SPICY_CONFIG = {
  chainId: '0x15b32', // 88882 en hex
  chainName: 'Chiliz Spicy Testnet',
  nativeCurrency: {
    name: 'Chiliz',
    symbol: 'CHZ',
    decimals: 18
  },
  rpcUrls: ['https://spicy-rpc.chiliz.com/'],
  blockExplorerUrls: ['https://testnet.chiliscan.com/']
};

// ABI des contrats
const EMOTION_BET_ABI = [
  "function owner() view returns (address)",
  "function getBetCount() view returns (uint256)",
  "function closed() view returns (bool)",
  "function resolved() view returns (bool)",
  "function totalPool() view returns (uint256)",
  "function winnersPool() view returns (uint256)",
  "function winningDescription() view returns (string)",
  "function placeBet(string description) payable",
  "function endBet()",
  "function resolveBet(string winningDescription)",
  "function claimWinnings()",
  "function checkWinnings(address user) view returns (uint256)",
  "function getStats() view returns (uint256, uint256, uint256, bool, string)",
  "function getAllBets() view returns (tuple(address user, string description, uint96 amount, bool claimed)[])",
  "event BetPlaced(address indexed user, string description, uint96 amount)",
  "event BetResolved(string winningDescription, uint256 totalWinners, uint256 totalPool)",
  "event WinningsClaimed(address indexed user, uint256 amount)"
];

const ATTENDANCE_NFT_ABI = [
  "function owner() view returns (address)",
  "function nextTokenId() view returns (uint256)",
  "function getTotalSupply() view returns (uint256)",
  "function getUserNFTs(address user) view returns (uint256[])",
  "function getNFTMetadata(uint256 tokenId) view returns (tuple(string eventName, string eventDate, string eventType, string rarity, string imageUrl, uint32 attendanceCount, uint64 timestamp))",
  "function mintCommonNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount) returns (uint256)",
  "function mintRareNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount) returns (uint256)",
  "function mintEpicNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount) returns (uint256)",
  "function mintLegendaryNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount) returns (uint256)",
  "event NFTMinted(address indexed to, uint256 indexed tokenId, string rarity)"
];

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.emotionBetContract = null;
    this.attendanceNFTContract = null;
    this.isConnected = false;
    this.listeners = new Map();
    
    // Adresses des contrats (à mettre à jour après déploiement)
    this.EMOTION_BET_ADDRESS = process.env.NEXT_PUBLIC_EMOTION_BET_ADDRESS || '';
    this.ATTENDANCE_NFT_ADDRESS = process.env.NEXT_PUBLIC_ATTENDANCE_NFT_ADDRESS || '';
  }

  // Événements
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Connexion au wallet
  async connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask n\'est pas installé');
      }

      // Demander l'accès au wallet
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('Aucun compte disponible');
      }

      // Vérifier/ajouter le réseau Chiliz
      await this.switchToChilizNetwork();

      // Initialiser le provider et signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = accounts[0];
      this.isConnected = true;

      // Initialiser les contrats
      await this.initializeContracts();

      // Écouter les changements de compte
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.account = accounts[0];
          this.emit('accountChanged', accounts[0]);
        }
      });

      // Écouter les changements de réseau
      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== CHILIZ_SPICY_CONFIG.chainId) {
          this.emit('wrongNetwork', chainId);
        }
      });

      this.emit('connected', {
        account: this.account,
        chainId: await this.provider.getNetwork().then(n => n.chainId)
      });

      return {
        account: this.account,
        isConnected: true
      };

    } catch (error) {
      console.error('Erreur de connexion wallet:', error);
      throw error;
    }
  }

  // Changer vers le réseau Chiliz
  async switchToChilizNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHILIZ_SPICY_CONFIG.chainId }]
      });
    } catch (error) {
      // Si le réseau n'existe pas, l'ajouter
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [CHILIZ_SPICY_CONFIG]
        });
      } else {
        throw error;
      }
    }
  }

  // Initialiser les contrats
  async initializeContracts() {
    if (!this.signer) {
      throw new Error('Signer non disponible');
    }

    if (this.EMOTION_BET_ADDRESS) {
      this.emotionBetContract = new ethers.Contract(
        this.EMOTION_BET_ADDRESS,
        EMOTION_BET_ABI,
        this.signer
      );
    }

    if (this.ATTENDANCE_NFT_ADDRESS) {
      this.attendanceNFTContract = new ethers.Contract(
        this.ATTENDANCE_NFT_ADDRESS,
        ATTENDANCE_NFT_ABI,
        this.signer
      );
    }
  }

  // Déconnexion
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.emotionBetContract = null;
    this.attendanceNFTContract = null;
    this.isConnected = false;
    this.emit('disconnected');
  }

  // Obtenir le solde CHZ
  async getBalance(address = null) {
    if (!this.provider) return '0';
    
    const targetAddress = address || this.account;
    if (!targetAddress) return '0';

    try {
      const balance = await this.provider.getBalance(targetAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);
      return '0';
    }
  }

  // === FONCTIONS EMOTION BET ===

  // Placer un pari
  async placeBet(description, amount) {
    if (!this.emotionBetContract) {
      throw new Error('Contrat EmotionBet non initialisé');
    }

    try {
      const tx = await this.emotionBetContract.placeBet(description, {
        value: ethers.parseEther(amount.toString())
      });

      this.emit('transactionPending', { type: 'placeBet', hash: tx.hash });
      
      const receipt = await tx.wait();
      this.emit('transactionConfirmed', { type: 'placeBet', receipt });
      
      return receipt;
    } catch (error) {
      console.error('Erreur lors du placement du pari:', error);
      throw error;
    }
  }

  // Réclamer les gains
  async claimWinnings() {
    if (!this.emotionBetContract) {
      throw new Error('Contrat EmotionBet non initialisé');
    }

    try {
      const tx = await this.emotionBetContract.claimWinnings();
      this.emit('transactionPending', { type: 'claimWinnings', hash: tx.hash });
      
      const receipt = await tx.wait();
      this.emit('transactionConfirmed', { type: 'claimWinnings', receipt });
      
      return receipt;
    } catch (error) {
      console.error('Erreur lors de la réclamation des gains:', error);
      throw error;
    }
  }

  // Vérifier les gains potentiels
  async checkWinnings(address = null) {
    if (!this.emotionBetContract) return '0';

    try {
      const targetAddress = address || this.account;
      const winnings = await this.emotionBetContract.checkWinnings(targetAddress);
      return ethers.formatEther(winnings);
    } catch (error) {
      console.error('Erreur lors de la vérification des gains:', error);
      return '0';
    }
  }

  // Obtenir les statistiques du pari
  async getBetStats() {
    if (!this.emotionBetContract) return null;

    try {
      const stats = await this.emotionBetContract.getStats();
      return {
        totalPool: ethers.formatEther(stats[0]),
        winnersPool: ethers.formatEther(stats[1]),
        totalBets: stats[2].toString(),
        resolved: stats[3],
        winningDescription: stats[4]
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }
  }

  // Obtenir tous les paris
  async getAllBets() {
    if (!this.emotionBetContract) return [];

    try {
      const bets = await this.emotionBetContract.getAllBets();
      return bets.map(bet => ({
        user: bet.user,
        description: bet.description,
        amount: ethers.formatEther(bet.amount),
        claimed: bet.claimed
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des paris:', error);
      return [];
    }
  }

  // === FONCTIONS ATTENDANCE NFT ===

  // Obtenir les NFTs d'un utilisateur
  async getUserNFTs(address = null) {
    if (!this.attendanceNFTContract) return [];

    try {
      const targetAddress = address || this.account;
      const tokenIds = await this.attendanceNFTContract.getUserNFTs(targetAddress);
      
      const nfts = [];
      for (const tokenId of tokenIds) {
        const metadata = await this.attendanceNFTContract.getNFTMetadata(tokenId);
        nfts.push({
          tokenId: tokenId.toString(),
          eventName: metadata.eventName,
          eventDate: metadata.eventDate,
          eventType: metadata.eventType,
          rarity: metadata.rarity,
          imageUrl: metadata.imageUrl,
          attendanceCount: metadata.attendanceCount.toString(),
          timestamp: new Date(Number(metadata.timestamp) * 1000)
        });
      }
      
      return nfts;
    } catch (error) {
      console.error('Erreur lors de la récupération des NFTs:', error);
      return [];
    }
  }

  // Obtenir le total des NFTs
  async getTotalNFTSupply() {
    if (!this.attendanceNFTContract) return '0';

    try {
      const total = await this.attendanceNFTContract.getTotalSupply();
      return total.toString();
    } catch (error) {
      console.error('Erreur lors de la récupération du total NFT:', error);
      return '0';
    }
  }

  // Mint un NFT (owner seulement)
  async mintNFT(to, eventName, eventDate, eventType, attendanceCount, rarity = 'Common') {
    if (!this.attendanceNFTContract) {
      throw new Error('Contrat AttendanceNFT non initialisé');
    }

    try {
      let tx;
      switch (rarity.toLowerCase()) {
        case 'common':
          tx = await this.attendanceNFTContract.mintCommonNFT(to, eventName, eventDate, eventType, attendanceCount);
          break;
        case 'rare':
          tx = await this.attendanceNFTContract.mintRareNFT(to, eventName, eventDate, eventType, attendanceCount);
          break;
        case 'epic':
          tx = await this.attendanceNFTContract.mintEpicNFT(to, eventName, eventDate, eventType, attendanceCount);
          break;
        case 'legendary':
          tx = await this.attendanceNFTContract.mintLegendaryNFT(to, eventName, eventDate, eventType, attendanceCount);
          break;
        default:
          throw new Error('Rareté non supportée');
      }

      this.emit('transactionPending', { type: 'mintNFT', hash: tx.hash });
      
      const receipt = await tx.wait();
      this.emit('transactionConfirmed', { type: 'mintNFT', receipt });
      
      return receipt;
    } catch (error) {
      console.error('Erreur lors du mint NFT:', error);
      throw error;
    }
  }

  // === FONCTIONS UTILITAIRES ===

  // Écouter les événements des contrats
  startListening() {
    if (this.emotionBetContract) {
      this.emotionBetContract.on('BetPlaced', (user, description, amount) => {
        this.emit('betPlaced', {
          user,
          description,
          amount: ethers.formatEther(amount)
        });
      });

      this.emotionBetContract.on('BetResolved', (winningDescription, totalWinners, totalPool) => {
        this.emit('betResolved', {
          winningDescription,
          totalWinners: ethers.formatEther(totalWinners),
          totalPool: ethers.formatEther(totalPool)
        });
      });

      this.emotionBetContract.on('WinningsClaimed', (user, amount) => {
        this.emit('winningsClaimed', {
          user,
          amount: ethers.formatEther(amount)
        });
      });
    }

    if (this.attendanceNFTContract) {
      this.attendanceNFTContract.on('NFTMinted', (to, tokenId, rarity) => {
        this.emit('nftMinted', {
          to,
          tokenId: tokenId.toString(),
          rarity
        });
      });
    }
  }

  // Arrêter l'écoute des événements
  stopListening() {
    if (this.emotionBetContract) {
      this.emotionBetContract.removeAllListeners();
    }
    if (this.attendanceNFTContract) {
      this.attendanceNFTContract.removeAllListeners();
    }
  }

  // Obtenir les informations du réseau
  async getNetworkInfo() {
    if (!this.provider) return null;

    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      
      return {
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber: blockNumber.toString()
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des infos réseau:', error);
      return null;
    }
  }

  // Formater une adresse
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Vérifier si l'utilisateur est le propriétaire du contrat
  async isOwner(contractType = 'emotionBet') {
    const contract = contractType === 'emotionBet' ? this.emotionBetContract : this.attendanceNFTContract;
    
    if (!contract || !this.account) return false;

    try {
      const owner = await contract.owner();
      return owner.toLowerCase() === this.account.toLowerCase();
    } catch (error) {
      console.error('Erreur lors de la vérification du propriétaire:', error);
      return false;
    }
  }
}

// Instance singleton
const web3Service = new Web3Service();

export default web3Service; 