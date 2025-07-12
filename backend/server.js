// --- DÉPENDANCES ---
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

// --- CONFIGURATION ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Pour le développement, autorise toutes les origines
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// --- CONNEXION À LA BASE DE DONNÉES ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// --- SCHÉMAS ET MODÈLES MONGOOSE ---
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    chzBalance: { type: Number, default: 100 }
});
const User = mongoose.model('User', UserSchema);

const ChatMessageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    roomId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

// =======================================================
// MODIFICATION 1: Mise à jour du schéma des émotions
// =======================================================
const EmotionSchema = new mongoose.Schema({
    emotionType: { 
        type: String, 
        required: true, 
        enum: ['anger', 'surprise', 'joy', 'hype', 'fear', 'sadness'] 
    },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' } // Les émotions expirent après 5 minutes
});
const Emotion = mongoose.model('Emotion', EmotionSchema);

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


// --- LOGIQUE SERVEUR GLOBALE ---

// Logique des paris
const BET_DURATION_MS = 2 * 60 * 1000; // 2 minutes
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

    socket.on('authenticate', async ({ userId }) => {
        try {
            let user = await User.findOne({ userId });
            if (!user) {
                user = new User({ userId, chzBalance: 100 });
                await user.save();
                console.log(`Nouvel utilisateur créé : ${userId}`);
            }
            
            socket.userId = userId;
            socket.chzBalance = user.chzBalance;
            connectedUsers.set(userId, socket);

            socket.emit('authenticated', { userId: user.userId, chzBalance: user.chzBalance });
            console.log(`Utilisateur authentifié : ${userId} sur socket ${socket.id}`);
        } catch (error) {
            socket.emit('login_error', { message: 'Erreur lors de l\'authentification.' });
            console.error('Erreur d\'authentification:', error);
        }
    });

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
                { $inc: { chzBalance: -amount } },
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
    
    // --- Actions Collectives ---
    socket.on('create_action', async ({ action }) => {
        if (!socket.userId) return;
        const newAction = new CollectiveAction({ action, proposer: socket.userId, voters: [socket.userId], yesVotes: 1 });
        await newAction.save();
        io.emit('new_action', newAction);
        setTimeout(() => resolveAction(newAction._id), 60000); // Vote dure 1 minute
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

// =======================================================
// MODIFICATION 2: Mise à jour de l'agrégateur d'émotions
// =======================================================
setInterval(async () => {
    try {
        const results = await Emotion.aggregate([
            { $group: { _id: '$emotionType', count: { $sum: 1 } } }
        ]);
        
        // Initialiser tous les compteurs à zéro
        const initialCounts = {
            anger: 0,
            surprise: 0,
            joy: 0,
            hype: 0,
            fear: 0,
            sadness: 0
        };

        // Remplir avec les résultats de la base de données
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
}, 3000); // Met à jour les compteurs toutes les 3 secondes


// --- DÉMARRAGE DU SERVEUR ---
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
    // Démarrer le cycle de paris peu après le lancement du serveur
    setTimeout(generateNewBet, 5000);
});
