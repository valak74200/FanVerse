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

const EmotionSchema = new mongoose.Schema({
    emotionType: { type: String, required: true, enum: ['rage', 'shock', 'love', 'hype'] },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' }
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


// =======================================================
// SECTION PARIS (LOGIQUE SERVEUR GLOBALE)
// =======================================================
// --- CORRECTION : Durée des paris réduite à 2 minutes ---
const BET_DURATION_MS = 2 * 60 * 1000; // 2 minutes
const DELAY_BETWEEN_BETS_MS_MIN = 1 * 60 * 1000; // 1 minute
const DELAY_BETWEEN_BETS_MS_MAX = 8 * 60 * 1000; // 8 minutes

let currentBet = null;
let betTimeout;

function getRandomDelay() {
    return Math.floor(Math.random() * (DELAY_BETWEEN_BETS_MS_MAX - DELAY_BETWEEN_BETS_MS_MIN + 1)) + DELAY_BETWEEN_BETS_MS_MIN;
}

function generateNewBet() {
    if (currentBet && currentBet.status === 'open') return;

    const betQuestions = [
        { question: "Quel sera le prochain événement marquant dans les 2 prochaines minutes ?", options: ["But/Point", "Faute/Arrêt", "Hors-jeu/Hors-limites"] },
        { question: "Quelle émotion dominera le public dans les 2 prochaines minutes ?", options: ["Rage", "Hype", "Love", "Shock"] },
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

// --- CORRECTION : Logique de résolution des paris entièrement revue ---
async function resolveBet() {
    if (!currentBet) return;
    currentBet.status = 'closed';
    console.log(`[PARI] Fin des paris pour : "${currentBet.question}"`);
    io.emit('bet_closed', { message: 'Les paris sont terminés ! Annonce des résultats imminente...' });

    const winningOption = currentBet.options[Math.floor(Math.random() * currentBet.options.length)];
    console.log(`[PARI] L'option gagnante est : "${winningOption}"`);

    for (const userId in currentBet.bets) {
        const bet = currentBet.bets[userId];
        
        if (bet.option === winningOption) {
            const winnings = bet.amount * 2;
            try {
                // On met à jour l'utilisateur en ajoutant les gains et on récupère le document mis à jour
                const user = await User.findOneAndUpdate(
                    { userId: userId },
                    { $inc: { chzBalance: winnings } },
                    { new: true } // Important: renvoie le document après la mise à jour
                );

                if (user) {
                    const resultMessage = `Vous avez gagné ${winnings} CHZ ! Votre nouveau solde est de ${user.chzBalance.toFixed(2)} CHZ.`;
                    console.log(`[DB] ${userId} a gagné. Solde mis à jour à ${user.chzBalance}`);
                    const userSocket = findSocketByUserId(userId);
                    if (userSocket) {
                        userSocket.chzBalance = user.chzBalance; // Mettre à jour le solde sur la socket aussi
                        userSocket.emit('bet_result', { 
                            winningOption, 
                            winnings: winnings, 
                            message: resultMessage, 
                            newBalance: user.chzBalance 
                        });
                    }
                }
            } catch (error) {
                 console.error(`Erreur lors du crédit des gains pour ${userId}:`, error);
            }
        } else {
            // Pour les perdants, on a déjà déduit le montant. On envoie juste le message.
            try {
                const user = await User.findOne({ userId });
                 if (user) {
                    const resultMessage = `Vous avez perdu ${bet.amount} CHZ. Votre nouveau solde est de ${user.chzBalance.toFixed(2)} CHZ.`;
                    const userSocket = findSocketByUserId(userId);
                    if (userSocket) {
                        userSocket.emit('bet_result', { 
                            winningOption, 
                            winnings: -bet.amount, 
                            message: resultMessage, 
                            newBalance: user.chzBalance 
                        });
                    }
                 }
            } catch(error) {
                console.error(`Erreur lors de la récupération de l'utilisateur perdant ${userId}:`, error);
            }
        }
    }
    
    currentBet = null; // Réinitialiser le pari
    const nextBetDelay = getRandomDelay();
    console.log(`[PARI] Prochain pari programmé dans ${(nextBetDelay / 60000).toFixed(1)} minutes...`);
    setTimeout(generateNewBet, nextBetDelay);
}


function findSocketByUserId(userId) {
    for (const [id, socket] of io.sockets.sockets) {
        if (socket.userId === userId) return socket;
    }
    return null;
}


// --- LOGIQUE DE CONNEXION SOCKET.IO ---
io.on('connection', (socket) => {
    console.log(`Un utilisateur connecté: ${socket.id}`);

    // 1. AUTHENTIFICATION
    socket.on('authenticate', async ({ userId }) => {
        if (!userId) {
            return socket.emit('login_error', { message: 'User ID manquant.' });
        }
        try {
            console.log(`[MOCK] Vérification Fan Token pour ${userId}`);
            let user = await User.findOne({ userId });
            if (!user) {
                user = new User({ userId, chzBalance: 100 });
                await user.save();
            }

            socket.userId = userId;
            socket.chzBalance = user.chzBalance; // Stocker le solde sur l'objet socket
            socket.join('general');

            socket.emit('authenticated', {
                userId: user.userId,
                chzBalance: user.chzBalance
            });
            console.log(`Utilisateur ${userId} connecté et authentifié. Solde CHZ: ${user.chzBalance}`);

            // Informer le nouvel utilisateur du pari en cours
            if (currentBet && currentBet.status === 'open') {
                const timePassed = Date.now() - currentBet.createdAt;
                const remainingDuration = currentBet.duration - timePassed;

                if (remainingDuration > 0) {
                    console.log(`[INFO] Un utilisateur vient de se connecter, envoi du pari en cours: "${currentBet.question}"`);
                    socket.emit('new_bet', {
                        question: currentBet.question,
                        options: currentBet.options,
                        duration: remainingDuration // On envoie le temps restant !
                    });
                }
            }

        } catch (error) {
            console.error("Erreur d'authentification:", error);
            socket.emit('login_error', { message: 'Erreur interne du serveur.' });
        }
    });

    // 2. CHAT
    socket.on('send_message', async (data) => {
        if (socket.userId && data.message) {
            const newMessage = new ChatMessage({ userId: socket.userId, message: data.message, roomId: 'general' });
            await newMessage.save();
            io.to('general').emit('new_message', { userId: socket.userId, message: data.message });
        }
    });

    // 3. ÉMOTIONS
    socket.on('send_emotion', async ({ emotionType }) => {
        if (socket.userId && ['rage', 'shock', 'love', 'hype'].includes(emotionType)) {
            const newEmotion = new Emotion({ emotionType, userId: socket.userId });
            await newEmotion.save();
            await syncEmotions();
        }
    });

    // 4. ACTIONS COLLECTIVES
    const ACTION_DURATION = 60000;
    socket.on('create_action', async ({ action }) => {
        if (!socket.userId || !action) return;
        const activeAction = await CollectiveAction.findOne({ status: 'active' });
        if (activeAction) return socket.emit('action_error', { message: 'Une action est déjà en cours.' });

        const newAction = new CollectiveAction({ action, proposer: socket.userId });
        await newAction.save();
        io.emit('new_action', newAction);

        setTimeout(async () => {
            const finishedAction = await CollectiveAction.findById(newAction._id);
            if (finishedAction && finishedAction.status === 'active') { 
                finishedAction.status = finishedAction.yesVotes > finishedAction.noVotes ? 'success' : 'failed';
                await finishedAction.save();
                io.emit('action_result', { actionId: finishedAction._id, status: finishedAction.status, yes: finishedAction.yesVotes, no: finishedAction.noVotes });
            }
        }, ACTION_DURATION);
    });

    socket.on('vote_action', async ({ actionId, vote }) => {
        if (!socket.userId || !actionId || !['yes', 'no'].includes(vote)) return;
        const action = await CollectiveAction.findById(actionId);
        if (!action || action.status !== 'active' || action.voters.includes(socket.userId)) return;

        action.voters.push(socket.userId);
        if (vote === 'yes') action.yesVotes++;
        else action.noVotes++;
        await action.save();

        io.emit('action_update', { _id: action._id, yesVotes: action.yesVotes, noVotes: action.noVotes });

        const totalUsers = io.sockets.adapter.rooms.get('general')?.size || 0;
        const victoryThreshold = totalUsers / 2;
        let actionEnded = false;

        if (action.yesVotes > victoryThreshold) { action.status = 'success'; actionEnded = true; }
        else if (action.noVotes > victoryThreshold) { action.status = 'failed'; actionEnded = true; }
        else if (totalUsers > 0 && action.voters.length === totalUsers) { action.status = action.yesVotes > action.noVotes ? 'success' : 'failed'; actionEnded = true; }

        if (actionEnded) {
            io.emit('action_result', { actionId: action._id, status: action.status, yes: action.yesVotes, no: action.noVotes });
            await action.save();
        }
    });

    // 5. GESTION DES PARIS (HANDLER SPÉCIFIQUE AU CLIENT)
    // --- CORRECTION : Logique de pari revue pour déduire le solde immédiatement ---
    socket.on('place_bet', async ({ optionIndex, amount }) => {
        const userId = socket.userId;
        if (!userId) return;

        if (!currentBet || currentBet.status !== 'open') {
            return socket.emit('bet_error', { message: 'Aucun pari n\'est actuellement ouvert.' });
        }
        if (currentBet.bets[userId]) {
            return socket.emit('bet_error', { message: 'Vous avez déjà parié sur cette question.' });
        }
        
        const optionText = currentBet.options[optionIndex];
        if (typeof optionText === 'undefined') {
            return socket.emit('bet_error', { message: 'Option de pari invalide.' });
        }
        
        try {
            // On vérifie le solde et on le déduit en une seule opération atomique
            const user = await User.findOneAndUpdate(
                { userId: userId, chzBalance: { $gte: amount } }, // Condition: l'utilisateur doit avoir assez de CHZ
                { $inc: { chzBalance: -amount } }, // Opération: déduire le montant
                { new: true }
            );

            if (!user) {
                // Si user est null, la condition n'a pas été remplie (solde insuffisant)
                return socket.emit('bet_error', { message: 'Solde CHZ insuffisant.' });
            }

            // Si la mise à jour a réussi
            socket.chzBalance = user.chzBalance; // Mettre à jour le solde sur la socket
            console.log(`[DB] ${userId} a parié ${amount}. Nouveau solde: ${user.chzBalance}`);
            currentBet.bets[userId] = { option: optionText, amount };
    
            // Informer le client que le pari est accepté et lui donner son nouveau solde
            socket.emit('bet_accepted', { 
                message: `Votre pari de ${amount} CHZ sur "${optionText}" a été accepté !`,
                newBalance: user.chzBalance
            });

        } catch (error) {
            console.error(`Erreur lors du placement du pari pour ${userId}:`, error);
            socket.emit('bet_error', { message: 'Erreur serveur lors du placement du pari.' });
        }
    });

    // 6. DÉCONNEXION
    socket.on('disconnect', () => {
        console.log(`Utilisateur déconnecté: ${socket.id}`);
    });
});


// --- FONCTIONS UTILITAIRES ---
async function syncEmotions() {
    try {
        const counts = await Emotion.aggregate([{ $group: { _id: '$emotionType', count: { $sum: 1 } } }]);
        const emotionCounts = { rage: 0, shock: 0, love: 0, hype: 0 };
        counts.forEach(item => { emotionCounts[item._id] = item.count; });
        io.emit('emotion_update', emotionCounts);
    } catch (error) {
        console.error("Erreur de synchronisation des émotions:", error);
    }
}

async function cleanupStaleActions() {
    console.log('Vérification des actions périmées au démarrage...');
    const ACTION_DURATION = 60000;
    const staleTime = new Date(Date.now() - ACTION_DURATION);
    try {
        const result = await CollectiveAction.updateMany(
            { status: 'active', createdAt: { $lt: staleTime } },
            { $set: { status: 'failed' } }
        );
        if (result.modifiedCount > 0) console.log(`${result.modifiedCount} action(s) périmée(s) ont été nettoyée(s).`);
    } catch (error) {
        console.error('Erreur lors du nettoyage des actions périmées:', error);
    }
}

// Synchroniser les émotions périodiquement
setInterval(syncEmotions, 5000);


// --- DÉMARRAGE DU SERVEUR ---
server.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
    cleanupStaleActions();
    
    // On lance le premier cycle de paris pour démarrer la machine
    console.log('Lancement du premier cycle de paris...');
    generateNewBet(); 
});
