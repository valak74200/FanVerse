// --- DÉPENDANCES ---
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const { ethers } = require('ethers');
const cors = require('cors');

// --- CONFIGURATION ---
const app = express();
const server = http.createServer(app);

// Change le port pour éviter les conflits
const PORT = process.env.PORT || 3001; // ✅ CHANGÉ: 3001 au lieu de 3000
const MONGO_URI = process.env.MONGO_URI;

// --- CONFIGURATION BLOCKCHAIN ---
const BLOCKCHAIN_CONFIG = {
    rpcUrl: process.env.CHILIZ_RPC_URL || 'https://spicy-rpc.chiliz.com',
    chainId: parseInt(process.env.CHAIN_ID) || 88882,
    emotionBetAddress: process.env.EMOTION_BET_ADDRESS,
    attendanceNFTAddress: process.env.ATTENDANCE_NFT_ADDRESS,
    privateKey: process.env.PRIVATE_KEY
};

// --- ABI DES CONTRATS ---
const EMOTION_BET_ABI = [
    "function owner() view returns (address)",
    "function bets(uint256) view returns (address user, string description, uint96 amount)",
    "function closed() view returns (bool)",
    "function placeBet(string description) payable",
    "function endBet()",
    "function getAllBets() view returns (tuple(address user, string description, uint96 amount)[])",
    "function getBetCount() view returns (uint256)",
    "event BetPlaced(address indexed user, string description, uint96 amount)"
];

const ATTENDANCE_NFT_ABI = [
    "function owner() view returns (address)",
    "function nextTokenId() view returns (uint256)",
    "function getUserNFTs(address user) view returns (uint256[])",
    "function getNFTMetadata(uint256 tokenId) view returns (tuple(string eventName, string eventDate, string eventType, string rarity, string imageUrl, uint32 attendanceCount, uint64 timestamp))",
    "function getTotalSupply() view returns (uint256)",
    "function mintCommonNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount) returns (uint256)",
    "function mintRareNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount) returns (uint256)",
    "function mintEpicNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount) returns (uint256)",
    "function mintLegendaryNFT(address to, string eventName, string eventDate, string eventType, uint32 attendanceCount) returns (uint256)",
    "event NFTMinted(address indexed to, uint256 indexed tokenId, string rarity)"
];

// --- INITIALISATION BLOCKCHAIN ---
let provider, wallet, emotionBetContract, attendanceNFTContract;
let blockchainConnected = false;

async function initializeBlockchain() {
    try {
        if (!BLOCKCHAIN_CONFIG.privateKey || !BLOCKCHAIN_CONFIG.emotionBetAddress || !BLOCKCHAIN_CONFIG.attendanceNFTAddress) {
            console.log('⚠️  Configuration blockchain incomplète - mode développement uniquement');
            return;
        }

        provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);
        wallet = new ethers.Wallet(BLOCKCHAIN_CONFIG.privateKey, provider);
        
        // Connexion aux contrats
        emotionBetContract = new ethers.Contract(
            BLOCKCHAIN_CONFIG.emotionBetAddress,
            EMOTION_BET_ABI,
            wallet
        );
        
        attendanceNFTContract = new ethers.Contract(
            BLOCKCHAIN_CONFIG.attendanceNFTAddress,
            ATTENDANCE_NFT_ABI,
            wallet
        );

        // Vérifier la connexion
        const network = await provider.getNetwork();
        console.log(`✅ Blockchain connectée - Réseau: ${network.name} (${network.chainId})`);
        console.log(`📄 EmotionBet: ${BLOCKCHAIN_CONFIG.emotionBetAddress}`);
        console.log(`🎨 AttendanceNFT: ${BLOCKCHAIN_CONFIG.attendanceNFTAddress}`);
        
        blockchainConnected = true;
        setupBlockchainEventListeners();
        
    } catch (error) {
        console.error('❌ Erreur initialisation blockchain:', error.message);
        blockchainConnected = false;
    }
}

function setupBlockchainEventListeners() {
    if (!blockchainConnected) return;

    console.log('📡 Configuration des listeners blockchain...');

    try {
        // Supprimer les anciens listeners pour éviter les doublons
        if (emotionBetContract) {
            emotionBetContract.removeAllListeners();
        }
        if (attendanceNFTContract) {
            attendanceNFTContract.removeAllListeners();
        }

        // Configuration des listeners avec meilleure gestion d'erreur
        emotionBetContract.on('BetPlaced', (user, description, amount, event) => {
            console.log('🎲 Pari blockchain placé:', {
                user: user.substring(0, 8) + '...',
                description,
                amount: ethers.formatEther(amount),
                txHash: event.transactionHash?.substring(0, 10) + '...'
            });
            
            // Broadcaster aux clients connectés
            io.emit('blockchain_bet_placed', {
                user,
                description,
                amount: ethers.formatEther(amount),
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber
            });
            
            // Sauvegarder en base de données
            saveBlockchainBet(user, description, amount, event.transactionHash);
        });

        attendanceNFTContract.on('NFTMinted', (to, tokenId, rarity, event) => {
            console.log('🎨 NFT blockchain minté:', {
                to: to.substring(0, 8) + '...',
                tokenId: tokenId.toString(),
                rarity,
                txHash: event.transactionHash?.substring(0, 10) + '...'
            });
            
            // Broadcaster aux clients connectés
            io.emit('blockchain_nft_minted', {
                to,
                tokenId: tokenId.toString(),
                rarity,
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber
            });
            
            // Sauvegarder en base de données
            saveBlockchainNFT(to, tokenId, rarity, event.transactionHash);
        });

        // Gestion globale des erreurs du provider avec filtrage
        provider.on('error', (error) => {
            // Ignorer les erreurs "filter not found" - c'est normal
            if (error.code === 'UNKNOWN_ERROR' && 
                error.error?.message === 'filter not found') {
                return; // Ignorer silencieusement
            }
            
            // Log seulement les vraies erreurs
            console.error('❌ Erreur provider blockchain:', {
                code: error.code,
                message: error.message
            });
        });

        // Gestion de la reconnexion automatique
        provider.on('network', (newNetwork, oldNetwork) => {
            if (oldNetwork) {
                console.log('🔄 Réseau blockchain changé:', {
                    from: oldNetwork.chainId,
                    to: newNetwork.chainId
                });
                
                // Reconfigurer les listeners après changement de réseau
                setTimeout(() => {
                    setupBlockchainEventListeners();
                }, 2000);
            }
        });

        console.log('✅ Listeners blockchain configurés (erreurs filtres ignorées)');

    } catch (error) {
        console.error('❌ Erreur configuration listeners:', error.message);
    }
}

// --- CONNEXION À LA BASE DE DONNÉES ---
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connecté');
        initializeBlockchain(); // Initialiser blockchain après DB
    })
    .catch(err => console.error('❌ Erreur connexion MongoDB:', err));

// --- SCHÉMAS ET MODÈLES MONGOOSE ---
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    chzBalance: { type: Number, default: 100 },
    walletAddress: { type: String, default: null }, // Adresse MetaMask
    totalNFTs: { type: Number, default: 0 },
    totalBets: { type: Number, default: 0 }
});
const User = mongoose.model('User', UserSchema);

const ChatMessageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    roomId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

const EmotionSchema = new mongoose.Schema({
    emotionType: { 
        type: String, 
        required: true, 
        enum: ['anger', 'surprise', 'joy', 'hype', 'fear', 'sadness'] 
    },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' }
});
const Emotion = mongoose.model('Emotion', EmotionSchema);

// --- NOUVEAUX SCHÉMAS POUR LA BLOCKCHAIN ---
const BlockchainBetSchema = new mongoose.Schema({
    user: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: String, required: true }, // En ETH string
    transactionHash: { type: String, required: true, unique: true },
    blockNumber: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'confirmed' }
});
const BlockchainBet = mongoose.model('BlockchainBet', BlockchainBetSchema);

const BlockchainNFTSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    tokenId: { type: String, required: true },
    rarity: { type: String, required: true },
    transactionHash: { type: String, required: true, unique: true },
    blockNumber: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'confirmed' }
});
const BlockchainNFT = mongoose.model('BlockchainNFT', BlockchainNFTSchema);

const CollectiveActionSchema = new mongoose.Schema({
    action: { type: String, required: true },
    proposer: { type: String, required: true },
    yesVotes: { type: Number, default: 0 },
    noVotes: { type: Number, default: 0 },
    voters: [{ type: String }],
    status: { type: String, enum: ['active', 'success', 'failed'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
});
const CollectiveAction = mongoose.model('CollectiveAction', CollectiveActionSchema);

// --- FONCTIONS BLOCKCHAIN ---
async function saveBlockchainBet(user, description, amount, transactionHash) {
    try {
        const bet = new BlockchainBet({
            user,
            description,
            amount: ethers.formatEther(amount),
            transactionHash,
            blockNumber: 0 // Sera mis à jour plus tard
        });
        await bet.save();
        console.log('💾 Pari blockchain sauvegardé en DB');
    } catch (error) {
        console.error('❌ Erreur sauvegarde pari blockchain:', error);
    }
}

async function saveBlockchainNFT(owner, tokenId, rarity, transactionHash) {
    try {
        const nft = new BlockchainNFT({
            owner,
            tokenId: tokenId.toString(),
            rarity,
            transactionHash,
            blockNumber: 0 // Sera mis à jour plus tard
        });
        await nft.save();
        console.log('💾 NFT blockchain sauvegardé en DB');
    } catch (error) {
        console.error('❌ Erreur sauvegarde NFT blockchain:', error);
    }
}

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.static('public'));

// ✅ CONFIGURATION CORS ULTRA-PERMISSIVE POUR DÉVELOPPEMENT
app.use(cors({
    origin: [
        'http://localhost:3001',
        'http://localhost:5500' // <-- Ajoute ton frontend ici !
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ✅ PRÉFLIGHT OPTIONS pour toutes les routes
app.options('*', cors());

// ✅ SOCKET.IO CORS
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:3001',
            'http://localhost:5500' // <-- Ajoute ton frontend ici aussi !
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// --- ROUTES API BLOCKCHAIN ---

// Obtenir tous les paris blockchain
app.get('/api/blockchain/bets', async (req, res) => {
    try {
        if (!blockchainConnected) {
            return res.status(503).json({ success: false, error: 'Blockchain non connectée' });
        }
        
        const bets = await emotionBetContract.getAllBets();
        const formattedBets = bets.map((bet, index) => ({
            id: index,
            user: bet.user,
            description: bet.description,
            amount: ethers.formatEther(bet.amount),
            amountWei: bet.amount.toString()
        }));
        
        res.json({ success: true, data: formattedBets });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Obtenir le statut des paris blockchain
app.get('/api/blockchain/bets/status', async (req, res) => {
    try {
        if (!blockchainConnected) {
            return res.status(503).json({ success: false, error: 'Blockchain non connectée' });
        }
        
        const closed = await emotionBetContract.closed();
        const count = await emotionBetContract.getBetCount();
        
        res.json({ 
            success: true, 
            data: { 
                closed, 
                count: count.toString(),
                contractAddress: BLOCKCHAIN_CONFIG.emotionBetAddress
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Obtenir les NFTs d'un utilisateur
app.get('/api/blockchain/nfts/*', async (req, res) => {
    const address = req.params[0]; // Récupère l'adresse depuis l'URL
    
    try {
        if (!blockchainConnected) {
            return res.status(503).json({ success: false, error: 'Blockchain non connectée' });
        }

        if (!address || !ethers.isAddress(address)) {
            return res.status(400).json({ success: false, error: 'Adresse invalide' });
        }

        const tokenIds = await attendanceNFTContract.getUserNFTs(address);
        const nfts = [];

        for (let tokenId of tokenIds) {
            try {
                const metadata = await attendanceNFTContract.getNFTMetadata(tokenId);
                nfts.push({
                    id: tokenId.toString(),
                    eventName: metadata.eventName,
                    eventDate: metadata.eventDate,
                    eventType: metadata.eventType,
                    rarity: metadata.rarity,
                    imageUrl: metadata.imageUrl,
                    attendanceCount: metadata.attendanceCount.toString(),
                    timestamp: metadata.timestamp.toString()
                });
            } catch (metadataError) {
                console.error(`Erreur métadonnées NFT ${tokenId}:`, metadataError.message);
            }
        }

        res.json({ success: true, data: { address, nfts, count: nfts.length } });
    } catch (error) {
        console.error('Erreur récupération NFTs:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Obtenir le total supply des NFTs
app.get('/api/blockchain/nfts/supply', async (req, res) => {
    try {
        if (!blockchainConnected) {
            return res.status(503).json({ success: false, error: 'Blockchain non connectée' });
        }
        
        const totalSupply = await attendanceNFTContract.getTotalSupply();
        res.json({ 
            success: true, 
            data: { 
                totalSupply: totalSupply.toString(),
                contractAddress: BLOCKCHAIN_CONFIG.attendanceNFTAddress
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mint un NFT (owner seulement)
app.post('/api/blockchain/nfts/mint', async (req, res) => {
    try {
        if (!blockchainConnected) {
            return res.status(503).json({ success: false, error: 'Blockchain non connectée' });
        }
        
        const { to, eventName, eventDate, eventType, attendanceCount, rarity = 'Common' } = req.body;
        
        if (!to || !eventName || !eventDate || !eventType || !attendanceCount) {
            return res.status(400).json({ success: false, error: 'Paramètres manquants' });
        }
        
        let tx;
        switch (rarity.toLowerCase()) {
            case 'common':
                tx = await attendanceNFTContract.mintCommonNFT(to, eventName, eventDate, eventType, attendanceCount);
                break;
            case 'rare':
                tx = await attendanceNFTContract.mintRareNFT(to, eventName, eventDate, eventType, attendanceCount);
                break;
            case 'epic':
                tx = await attendanceNFTContract.mintEpicNFT(to, eventName, eventDate, eventType, attendanceCount);
                break;
            case 'legendary':
                tx = await attendanceNFTContract.mintLegendaryNFT(to, eventName, eventDate, eventType, attendanceCount);
                break;
            default:
                return res.status(400).json({ success: false, error: 'Rareté non supportée' });
        }
        
        const receipt = await tx.wait();
        
        res.json({
            success: true,
            data: {
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Obtenir les informations du réseau
app.get('/api/blockchain/network', async (req, res) => {
    try {
        if (!blockchainConnected) {
            return res.status(503).json({ success: false, error: 'Blockchain non connectée' });
        }
        
        const network = await provider.getNetwork();
        const blockNumber = await provider.getBlockNumber();
        
        res.json({
            success: true,
            data: {
                chainId: network.chainId.toString(),
                name: network.name,
                currentBlock: blockNumber,
                rpcUrl: BLOCKCHAIN_CONFIG.rpcUrl,
                contracts: {
                    emotionBet: BLOCKCHAIN_CONFIG.emotionBetAddress,
                    attendanceNFT: BLOCKCHAIN_CONFIG.attendanceNFTAddress
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Obtenir les paris et NFTs depuis la base de données
app.get('/api/blockchain/history/bets', async (req, res) => {
    try {
        const bets = await BlockchainBet.find().sort({ timestamp: -1 }).limit(50);
        res.json({ success: true, data: bets });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/blockchain/history/nfts', async (req, res) => {
    try {
        const nfts = await BlockchainNFT.find().sort({ timestamp: -1 }).limit(50);
        res.json({ success: true, data: nfts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- LOGIQUE SERVEUR EXISTANTE ---
const BET_DURATION_MS = 2 * 60 * 1000;
const DELAY_BETWEEN_BETS_MS_MIN = 1 * 60 * 1000;
const DELAY_BETWEEN_BETS_MS_MAX = 8 * 60 * 1000;
let currentBet = null;
let betTimeout;

function getRandomDelay() {
    return Math.floor(Math.random() * (DELAY_BETWEEN_BETS_MS_MAX - DELAY_BETWEEN_BETS_MS_MIN + 1)) + DELAY_BETWEEN_BETS_MS_MIN;
}

function generateNewBet() {
    if (currentBet && currentBet.status === 'open') return;

    const betQuestions = [
        { question: "Quel sera le prochain événement marquant dans les 2 prochaines minutes ?", options: ["But/Point", "Faute/Arrêt", "Hors-jeu/Hors-limites"] },
        { question: "Quelle émotion dominera le public dans les 2 prochaines minutes ?", options: ["Joy", "Anger", "Surprise", "Hype"] },
        { question: "Le public va-t-il lancer une ola dans les 2 prochaines minutes ?", options: ["Oui", "Non"] }
    ];
    const randomBet = betQuestions[Math.floor(Math.random() * betQuestions.length)];
    
    currentBet = {
        ...randomBet,
        status: 'open',
        bets: {},
        createdAt: Date.now(),
        duration: BET_DURATION_MS
    };

    console.log(`[PARI] Nouveau pari généré : "${currentBet.question}". Durée : ${BET_DURATION_MS / 60000} minutes.`);
    io.emit('new_bet', { 
        question: currentBet.question, 
        options: currentBet.options,
        duration: currentBet.duration 
    });

    betTimeout = setTimeout(resolveBet, currentBet.duration);
}

async function resolveBet() {
    if (!currentBet) return;
    currentBet.status = 'closed';
    console.log(`[PARI] Fin des paris pour : "${currentBet.question}"`);
    io.emit('bet_closed', { message: 'Les paris sont terminés ! Annonce des résultats imminente...' });

    const winningOption = currentBet.options[Math.floor(Math.random() * currentBet.options.length)];
    console.log(`[PARI] L'option gagnante est : "${winningOption}"`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    for (const userId in currentBet.bets) {
        const bet = currentBet.bets[userId];
        let user = null;
        let resultMessage = '';
        let winningsAmount = 0;

        try {
            if (bet.option === winningOption) {
                winningsAmount = bet.amount * 2;
                user = await User.findOneAndUpdate(
                    { userId: userId },
                    { $inc: { chzBalance: winningsAmount } },
                    { new: true }
                );
                if (user) {
                    resultMessage = `Vous avez gagné ${winningsAmount.toFixed(2)} CHZ ! Votre nouveau solde est de ${user.chzBalance.toFixed(2)} CHZ.`;
                    console.log(`[DB] GAGNANT ${userId}. Solde mis à jour à ${user.chzBalance}`);
                }
            } else {
                winningsAmount = -bet.amount;
                user = await User.findOne({ userId });
                if (user) {
                    resultMessage = `Vous avez perdu ${bet.amount.toFixed(2)} CHZ. L'option gagnante était "${winningOption}". Votre solde est de ${user.chzBalance.toFixed(2)} CHZ.`;
                    console.log(`[DB] PERDANT ${userId}. Solde restant : ${user.chzBalance}`);
                }
            }

            if (user) {
                const userSocket = findSocketByUserId(userId);
                if (userSocket) {
                    console.log(`[EMIT] Envoi du résultat à ${userId}.`);
                    userSocket.emit('bet_result', {
                        winningOption,
                        winnings: winningsAmount,
                        message: resultMessage,
                        newBalance: user.chzBalance
                    });
                } else {
                    console.log(`[WARN] Impossible de trouver la socket pour ${userId} pour envoyer le résultat.`);
                }
            } else {
                console.error(`[ERREUR] Impossible de trouver l'utilisateur ${userId} dans la DB après le pari.`);
            }

        } catch (error) {
            console.error(`[ERREUR FATALE] Erreur lors du traitement du résultat pour ${userId}:`, error);
        }
    }

    currentBet = null;
    const nextBetDelay = getRandomDelay();
    console.log(`[PARI] Prochain pari programmé dans ${(nextBetDelay / 60000).toFixed(1)} minutes...`);
    setTimeout(generateNewBet, nextBetDelay);
}

// --- GESTION DES CONNEXIONS SOCKET.IO ---
const connectedUsers = new Map();

function findSocketByUserId(userId) {
    return connectedUsers.get(userId);
}

io.on('connection', (socket) => {
    console.log(`Nouvelle connexion : ${socket.id}`);

    // Envoyer le statut blockchain au nouveau client
    socket.emit('blockchain_status', {
        connected: blockchainConnected,
        contracts: blockchainConnected ? {
            emotionBet: BLOCKCHAIN_CONFIG.emotionBetAddress,
            attendanceNFT: BLOCKCHAIN_CONFIG.attendanceNFTAddress
        } : null
    });

    socket.on('authenticate', async ({ userId, walletAddress }) => {
        try {
            let user = await User.findOne({ userId });
            if (!user) {
                user = new User({ 
                    userId, 
                    chzBalance: 100,
                    walletAddress: walletAddress || null 
                });
                await user.save();
                console.log(`Nouvel utilisateur créé : ${userId} avec wallet ${walletAddress || 'N/A'}`);
            } else if (walletAddress && user.walletAddress !== walletAddress) {
                // Mettre à jour l'adresse wallet si elle a changé
                user.walletAddress = walletAddress;
                await user.save();
                console.log(`Wallet mis à jour pour ${userId}: ${walletAddress}`);
            }
            
            socket.userId = userId;
            socket.chzBalance = user.chzBalance;
            socket.walletAddress = user.walletAddress;
            connectedUsers.set(userId, socket);

            socket.emit('authenticated', { 
                userId: user.userId, 
                chzBalance: user.chzBalance,
                walletAddress: user.walletAddress,
                blockchainConnected
            });
            console.log(`Utilisateur authentifié : ${userId} sur socket ${socket.id}`);
        } catch (error) {
            socket.emit('login_error', { message: 'Erreur lors de l\'authentification.' });
            console.error('Erreur d\'authentification:', error);
        }
    });

    // Nouveau: Obtenir les NFTs de l'utilisateur connecté
    socket.on('get_my_nfts', async () => {
        if (!socket.walletAddress || !blockchainConnected) {
            return socket.emit('nfts_error', { message: 'Wallet non connecté ou blockchain indisponible' });
        }
        
        try {
            const nftIds = await attendanceNFTContract.getUserNFTs(socket.walletAddress);
            const nfts = await Promise.all(
                nftIds.map(async (id) => {
                    const metadata = await attendanceNFTContract.getNFTMetadata(id);
                    return {
                        id: id.toString(),
                        eventName: metadata.eventName,
                        eventDate: metadata.eventDate,
                        eventType: metadata.eventType,
                        rarity: metadata.rarity,
                        imageUrl: metadata.imageUrl,
                        attendanceCount: metadata.attendanceCount.toString(),
                        timestamp: metadata.timestamp.toString()
                    };
                })
            );
            
            socket.emit('my_nfts', { nfts });
        } catch (error) {
            socket.emit('nfts_error', { message: 'Erreur lors de la récupération des NFTs' });
            console.error('Erreur get_my_nfts:', error);
        }
    });

    // Nouveau: Obtenir les paris blockchain
    socket.on('get_blockchain_bets', async () => {
        if (!blockchainConnected) {
            return socket.emit('blockchain_bets_error', { message: 'Blockchain non connectée' });
        }
        
        try {
            const bets = await emotionBetContract.getAllBets();
            const formattedBets = bets.map((bet, index) => ({
                id: index,
                user: bet.user,
                description: bet.description,
                amount: ethers.formatEther(bet.amount)
            }));
            
            socket.emit('blockchain_bets', { bets: formattedBets });
        } catch (error) {
            socket.emit('blockchain_bets_error', { message: 'Erreur lors de la récupération des paris' });
            console.error('Erreur get_blockchain_bets:', error);
        }
    });

    // Événements existants
    socket.on('send_message', async ({ message }) => {
        if (!socket.userId) return;
        try {
            const chatMessage = new ChatMessage({ userId: socket.userId, message, roomId: 'general' });
            await chatMessage.save();
            io.emit('new_message', { userId: socket.userId, message });
        } catch (error) {
            console.error('Erreur d\'enregistrement du message:', error);
        }
    });

    socket.on('send_emotion', async ({ emotionType }) => {
        if (!socket.userId) return;
        try {
            const emotion = new Emotion({ userId: socket.userId, emotionType });
            await emotion.save();
        } catch (error) {
            console.error(`Erreur d'enregistrement de l'émotion ${emotionType}:`, error.message);
        }
    });

    socket.on('place_bet', async ({ optionIndex, amount }) => {
        if (!socket.userId || !currentBet || currentBet.status !== 'open') {
            return socket.emit('bet_error', { message: 'Les paris sont fermés.' });
        }
        if (currentBet.bets[socket.userId]) {
            return socket.emit('bet_error', { message: 'Vous avez déjà parié.' });
        }
        if (amount > socket.chzBalance) {
            return socket.emit('bet_error', { message: 'Solde insuffisant.' });
        }

        try {
            const user = await User.findOneAndUpdate(
                { userId: socket.userId, chzBalance: { $gte: amount } },
                { $inc: { chzBalance: -amount, totalBets: 1 } },
                { new: true }
            );

            if (user) {
                socket.chzBalance = user.chzBalance;
                currentBet.bets[socket.userId] = { option: currentBet.options[optionIndex], amount };
                socket.emit('bet_accepted', {
                    message: `Pari de ${amount} CHZ sur "${currentBet.options[optionIndex]}" accepté.`,
                    newBalance: user.chzBalance
                });
            } else {
                socket.emit('bet_error', { message: 'Transaction échouée. Solde insuffisant.' });
            }
        } catch (error) {
            console.error('Erreur lors du placement du pari:', error);
            socket.emit('bet_error', { message: 'Erreur serveur lors du pari.' });
        }
    });
    
    socket.on('create_action', async ({ action }) => {
        if (!socket.userId) return;
        const newAction = new CollectiveAction({ action, proposer: socket.userId, voters: [socket.userId], yesVotes: 1 });
        await newAction.save();
        io.emit('new_action', newAction);
        setTimeout(() => resolveAction(newAction._id), 60000);
    });

    socket.on('vote_action', async ({ actionId, vote }) => {
        if (!socket.userId) return;
        const action = await CollectiveAction.findById(actionId);
        if (!action || action.status !== 'active' || action.voters.includes(socket.userId)) {
            return socket.emit('action_error', { message: 'Vote impossible.' });
        }

        action.voters.push(socket.userId);
        if (vote === 'yes') action.yesVotes++;
        else action.noVotes++;
        
        await action.save();
        io.emit('action_update', action);
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            connectedUsers.delete(socket.userId);
            console.log(`Utilisateur déconnecté : ${socket.userId}`);
        } else {
            console.log(`Connexion anonyme fermée : ${socket.id}`);
        }
    });
});

async function resolveAction(actionId) {
    const action = await CollectiveAction.findById(actionId);
    if (!action || action.status !== 'active') return;

    action.status = action.yesVotes > action.noVotes ? 'success' : 'failed';
    await action.save();
    
    io.emit('action_result', {
        actionId: action._id,
        status: action.status,
        yes: action.yesVotes,
        no: action.noVotes
    });
}

// --- MISE À JOUR DES ÉMOTIONS ---
setInterval(async () => {
    try {
        const results = await Emotion.aggregate([
            { $group: { _id: '$emotionType', count: { $sum: 1 } } }
        ]);
        
        const initialCounts = {
            anger: 0,
            surprise: 0,
            joy: 0,
            hype: 0,
            fear: 0,
            sadness: 0
        };

        const finalCounts = results.reduce((acc, current) => {
            if (acc.hasOwnProperty(current._id)) {
                acc[current._id] = current.count;
            }
            return acc;
        }, initialCounts);

        io.emit('emotion_update', finalCounts);
    } catch (error) {
        console.error('Erreur lors de l\'agrégation des émotions:', error);
    }
}, 3001);

// --- PAGE D'ACCUEIL AVEC DOCUMENTATION ---
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FanVerse Backend API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
                .section { margin: 30px 0; }
                .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #007bff; }
                .method { font-weight: bold; color: #007bff; }
                .blockchain { border-left-color: #28a745; }
                .blockchain .method { color: #28a745; }
                .status { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                .connected { background: #28a745; color: white; }
                .disconnected { background: #dc3545; color: white; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏆 FanVerse Backend API</h1>
                <p>Backend intégré avec EmotionBet et AttendanceNFT</p>
                <div class="status ${blockchainConnected ? 'connected' : 'disconnected'}">
                    Blockchain: ${blockchainConnected ? 'CONNECTÉE' : 'DÉCONNECTÉE'}
                </div>
            </div>
            
            <div class="section">
                <h2>📋 Endpoints Classiques</h2>
                
                <div class="endpoint">
                    <span class="method">WebSocket</span> /socket.io - Connexion temps réel
                </div>
                
                <div class="endpoint">
                    <span class="method">GET</span> /api/network - Informations réseau
                </div>
            </div>

            <div class="section">
                <h2>🔗 Endpoints Blockchain</h2>
                
                <div class="endpoint blockchain">
                    <span class="method">GET</span> /api/blockchain/bets - Tous les paris EmotionBet
                </div>
                
                <div class="endpoint blockchain">
                    <span class="method">GET</span> /api/blockchain/bets/status - Statut des paris
                </div>
                
                <div class="endpoint blockchain">
                    <span class="method">GET</span> /api/blockchain/nfts/:address - NFTs d'un utilisateur
                </div>
                
                <div class="endpoint blockchain">
                    <span class="method">GET</span> /api/blockchain/nfts/supply - Total supply NFT
                </div>
                
                <div class="endpoint blockchain">
                    <span class="method">POST</span> /api/blockchain/nfts/mint - Mint un NFT
                </div>
                
                <div class="endpoint blockchain">
                    <span class="method">GET</span> /api/blockchain/network - Informations réseau blockchain
                </div>
                
                <div class="endpoint blockchain">
                    <span class="method">GET</span> /api/blockchain/history/bets - Historique des paris
                </div>
                
                <div class="endpoint blockchain">
                    <span class="method">GET</span> /api/blockchain/history/nfts - Historique des NFTs
                </div>
            </div>

            <div class="section">
                <h2>🎯 Événements WebSocket</h2>
                
                <div class="endpoint">
                    <strong>Émis par le serveur:</strong><br>
                    • <code>blockchain_status</code> - Statut de la connexion blockchain<br>
                    • <code>blockchain_bet_placed</code> - Nouveau pari sur EmotionBet<br>
                    • <code>blockchain_nft_minted</code> - Nouveau NFT minté<br>
                    • <code>my_nfts</code> - NFTs de l'utilisateur<br>
                    • <code>blockchain_bets</code> - Paris blockchain
                </div>
                
                <div class="endpoint">
                    <strong>Reçus du client:</strong><br>
                    • <code>authenticate</code> - Authentification avec wallet<br>
                    • <code>get_my_nfts</code> - Demander ses NFTs<br>
                    • <code>get_blockchain_bets</code> - Demander les paris blockchain
                </div>
            </div>

            <div class="section">
                <h2>🎮 Configuration</h2>
                <p><strong>Contrats:</strong></p>
                <ul>
                    <li>EmotionBet: <code>${BLOCKCHAIN_CONFIG.emotionBetAddress || 'Non configuré'}</code></li>
                    <li>AttendanceNFT: <code>${BLOCKCHAIN_CONFIG.attendanceNFTAddress || 'Non configuré'}</code></li>
                </ul>
                <p><strong>Réseau:</strong> Chiliz Spicy Testnet (${BLOCKCHAIN_CONFIG.chainId})</p>
            </div>
        </body>
        </html>
    `);
});

// --- DÉMARRAGE DU SERVEUR ---
server.listen(PORT, () => {
    console.log(`🚀 Serveur FanVerse démarré sur le port ${PORT}`);
    console.log(`📡 WebSocket activé`);
    console.log(`🔗 Blockchain: ${blockchainConnected ? 'Connectée' : 'En attente de configuration'}`);
    
    // Démarrer le cycle de paris
    setTimeout(generateNewBet, 5000);
});

// Ajouter cette route après les autres routes API blockchain
app.post('/api/blockchain/bets/place', async (req, res) => {
    try {
        const { description, amount, userAddress } = req.body;

        // Validation des données
        if (!description || !amount || !userAddress) {
            return res.status(400).json({
                success: false,
                error: 'Tous les champs sont requis (description, amount, userAddress)'
            });
        }

        if (!blockchainConnected) {
            return res.status(503).json({
                success: false,
                error: 'Blockchain non connectée'
            });
        }

        if (!ethers.isAddress(userAddress)) {
            return res.status(400).json({
                success: false,
                error: 'Adresse utilisateur invalide'
            });
        }

        // Vérifier si le contrat est ouvert
        const closed = await emotionBetContract.closed();
        if (closed) {
            return res.status(400).json({
                success: false,
                error: 'Le contrat de paris est fermé'
            });
        }

        // Placer le pari via le backend (avec la clé privée)
        const amountWei = ethers.parseEther(amount.toString());
        
        log(`🎲 Placement pari backend: "${description}" pour ${userAddress}`, 'info');

        const tx = await emotionBetContract.placeBet(description, {
            value: amountWei,
            gasLimit: 300000 // Limite de gas explicite
        });

        log(`📤 Transaction envoyée: ${tx.hash}`, 'info');

        // Attendre la confirmation
        const receipt = await tx.wait();
        
        log(`✅ Pari placé! Block: ${receipt.blockNumber}`, 'success');

        // Sauvegarder en base de données
        await saveBlockchainBet(userAddress, description, amount, tx.hash);

        res.json({
            success: true,
            message: 'Pari placé avec succès',
            data: {
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber,
                description,
                amount,
                userAddress
            }
        });

    } catch (error) {
        console.error('Erreur placement pari:', error);
        
        // Gestion des erreurs spécifiques
        if (error.message.includes('Pari ferme')) {
            return res.status(400).json({
                success: false,
                error: 'Le contrat de paris est fermé'
            });
        }

        if (error.message.includes('insufficient funds')) {
            return res.status(400).json({
                success: false,
                error: 'Fonds insuffisants sur le compte backend'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
