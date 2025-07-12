// --- server.js ---

// 1. Importations et Initialisation
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Permet à n'importe quel frontend de se connecter (pour hackathon)
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// 2. Données en Mémoire (pour le Hackathon - non persistant)
let users = {}; // { userId: { socketId: '...', fanTokenOwned: true/false, chzBalance: 0 } }

let userActiveEmotions = {};
let emotionCounts = { rage: 0, shock: 0, love: 0, hype: 0 };

let currentBet = null;
let betIdCounter = 0;
let chatMessages = []; // Chat général

// NOUVEAU: Gestion des salons privés et des invitations
// Map pour stocker les salons privés. Clé: roomId (ex: "user1_user2"), Valeur: { participants: Set<string>, messages: [] }
const privateRooms = new Map();
// Map pour stocker les invitations en attente. Clé: invitedUserId, Valeur: { inviterId: string, roomId: string }
const pendingPrivateRoomInvitations = new Map();

// collectiveActionVote peut maintenant contenir un timerId et un id unique
// { id: '...', action: '...', yes: 0, no: 0, voters: [], proposer: '...', startTime: Date.now(), timerId: null, status: 'active' | 'success' | 'expired' }
let collectiveActionVote = null;
let lastCollectiveAction = null; // Nouvelle variable pour stocker la dernière action terminée

// Fonction utilitaire pour nettoyer l'objet collectiveActionVote avant de l'envoyer au client
// Cela évite le RangeError: Maximum call stack size exceeded en retirant le timerId (objet Node.js)
function getCleanCollectiveActionVote(actionVote) {
    if (!actionVote) return null;
    // Utilisez la déstructuration pour extraire timerId et obtenir le reste de l'objet
    const { timerId, ...cleanActionVote } = actionVote;
    return cleanActionVote;
}

// Fonction utilitaire pour générer un roomId unique et consistent pour un chat privé entre deux utilisateurs
function generatePrivateRoomId(user1Id, user2Id) {
    // Assure un nom de salle unique et consistent quelle que soit l'ordre des IDs
    const sortedIds = [user1Id, user2Id].sort();
    return `private_${sortedIds[0]}_${sortedIds[1]}`;
}

// 3. Simulation Blockchain (MOCK - pour le Hackathon)
const MOCK_FAN_TOKEN_ADDRESS = "0xMockFanTokenAddress"; // Adresse fictive
const MOCK_CHZ_CONTRACT_ADDRESS = "0xMockChilizContractAddress"; // Adresse fictive

async function checkFanTokenOwnership(userAddress) {
    console.log(`[MOCK] Vérification Fan Token pour ${userAddress}`);
    // Pour le hackathon, user123, admin ET user456 possèdent un Fan Token
    return userAddress === 'user123' || userAddress === 'admin' || userAddress === 'user456';
}

async function depositCHZ(userAddress, amount) {
    console.log(`[MOCK] Dépôt de ${amount} CHZ par ${userAddress}`);
    if (users[userAddress]) {
        users[userAddress].chzBalance += amount;
        console.log(`[MOCK] Nouveau solde CHZ pour ${userAddress}: ${users[userAddress].chzBalance}`);
        return true;
    }
    return false;
}

async function withdrawCHZ(userAddress, amount) {
    console.log(`[MOCK] Retrait de ${amount} CHZ par ${userAddress}`);
    if (users[userAddress] && users[userAddress].chzBalance >= amount) {
        users[userAddress].chzBalance -= amount;
        console.log(`[MOCK] Nouveau solde CHZ pour ${userAddress}: ${users[userAddress].chzBalance}`);
        return true;
    }
    return false;
}


// 4. Logique de Jeu et Temps Réel (Socket.IO)

io.on('connection', async (socket) => {
    console.log(`Un utilisateur connecté: ${socket.id}`);

    // --- Événement de Connexion / Authentification (Simplifié pour Hackathon) ---
    socket.on('login', async (data) => {
        const { userId } = data;
        if (!userId) {
            socket.emit('login_error', { message: 'ID utilisateur manquant.' });
            return;
        }

        const hasFanToken = await checkFanTokenOwnership(userId);

        if (!hasFanToken) {
            socket.emit('login_error', { message: 'Vous devez posséder un Fan Token pour accéder.' });
            console.log(`Accès refusé pour ${userId}: pas de Fan Token.`);
            return;
        }

        // Si l'utilisateur est déjà connecté avec un autre socket, déconnecte l'ancien
        if (users[userId] && users[userId].socketId && io.sockets.sockets.get(users[userId].socketId)) {
            const oldSocket = io.sockets.sockets.get(users[userId].socketId);
            if (oldSocket.privateRoomId) { // S'il était dans un salon privé
                oldSocket.leave(oldSocket.privateRoomId);
                const room = privateRooms.get(oldSocket.privateRoomId);
                if (room) {
                    room.participants.delete(userId);
                    io.to(oldSocket.privateRoomId).emit('new_private_message', { userId: 'Système', message: `${userId} s'est déconnecté du salon.` });
                    if (room.participants.size === 0) {
                        privateRooms.delete(oldSocket.privateRoomId);
                        console.log(`Salon privé ${oldSocket.privateRoomId} supprimé car vide.`);
                    }
                }
            }
            oldSocket.disconnect(true); // Déconnecte l'ancien socket
            console.log(`Ancien socket de ${userId} déconnecté.`);
        }

        if (!users[userId]) {
            users[userId] = { socketId: socket.id, fanTokenOwned: true, chzBalance: 100 };
        } else {
            users[userId].socketId = socket.id;
        }
        
        socket.userId = userId;
        socket.emit('login_success', { userId: userId, chzBalance: users[userId].chzBalance, message: 'Bienvenue !' });
        console.log(`Utilisateur ${userId} connecté et authentifié. Solde CHZ: ${users[userId].chzBalance}`);

        // Assurez-vous que l'objet de suivi des émotions de l'utilisateur existe
        if (!userActiveEmotions[userId]) {
            userActiveEmotions[userId] = {};
        }

        socket.emit('current_emotions', emotionCounts);
        if (currentBet) {
            socket.emit('new_bet_proposal', currentBet);
        }
        socket.emit('chat_history', chatMessages);
        
        // Envoyer l'état actuel de l'action collective ou la dernière action terminée au nouvel utilisateur
        if (collectiveActionVote) {
             socket.emit('collective_action_update', getCleanCollectiveActionVote(collectiveActionVote));
        } else if (lastCollectiveAction) { // Si pas d'action en cours, envoyer la dernière terminée
             socket.emit('collective_action_update', getCleanCollectiveActionVote(lastCollectiveAction));
        } else {
            // Si aucune action n'est active ni terminée, envoyer null pour effacer l'interface
            socket.emit('collective_action_update', null);
        }

        // Vérifier si des invitations privées sont en attente pour cet utilisateur
        if (pendingPrivateRoomInvitations.has(userId)) {
            const invite = pendingPrivateRoomInvitations.get(userId);
            socket.emit('private_room_invite', { inviterId: invite.inviterId, roomId: invite.roomId });
            console.log(`Invitation en attente pour ${userId} de ${invite.inviterId} envoyée.`);
        }
    });

    // --- Émotions en Temps Réel ---
    socket.on('send_emotion', (data) => {
        const { emotionType } = data;
        const userId = socket.userId;

        if (!userId || !users[userId]) {
            socket.emit('emotion_error', { message: 'Vous devez être connecté pour envoyer une émotion.' });
            return;
        }

        // CORRECTION: Assurez-vous que l'objet de suivi des émotions de l'utilisateur existe
        if (!userActiveEmotions[userId]) {
            userActiveEmotions[userId] = {};
        }

        if (emotionCounts.hasOwnProperty(emotionType)) {
            if (!userActiveEmotions[userId][emotionType]) {
                emotionCounts[emotionType]++;
                console.log(`Émotion "${emotionType}" incrémentée par ${userId}.`);
            }
            userActiveEmotions[userId][emotionType] = Date.now();
            
            io.emit('emotion_update', emotionCounts);
            console.log(`Émotion "${emotionType}" reçue de ${userId}. Nouvel état:`, emotionCounts);
        } else {
            socket.emit('emotion_error', { message: 'Type d\'émotion invalide.' });
        }
    });

    // --- Paris Aléatoires en Temps Réel ---
    socket.on('place_bet', (data) => {
        const { betId, option, amount } = data;
        const userId = socket.userId;

        if (!userId || !users[userId]) {
            socket.emit('bet_error', { message: 'Vous devez être connecté pour parier.' });
            return;
        }
        if (!currentBet || currentBet.id !== betId) {
            socket.emit('bet_error', { message: 'Ce pari n\'est plus actif ou n\'existe pas.' });
            return;
        }
        if (users[userId].chzBalance < amount) {
            socket.emit('bet_error', { message: 'Solde CHZ insuffisant.' });
            return;
        }
        if (!currentBet.options.includes(option)) {
            socket.emit('bet_error', { message: 'Option de pari invalide.' });
            return;
        }
        if (amount <= 0) {
            socket.emit('bet_error', { message: 'Le montant du pari doit être positif.' });
            return;
        }

        users[userId].chzBalance -= amount;
        currentBet.totalPot += amount;

        if (!currentBet.bets[userId]) {
            currentBet.bets[userId] = [];
        }
        currentBet.bets[userId].push({ option, amount });

        io.emit('bet_update', { betId: currentBet.id, totalPot: currentBet.totalPot });
        socket.emit('your_balance_update', { chzBalance: users[userId].chzBalance });
        console.log(`${userId} a parié ${amount} CHZ sur "${option}" pour le pari ${betId}. Pot total: ${currentBet.totalPot}`);
    });

    // --- Chat Général ---
    socket.on('send_message', (data) => {
        const { message } = data;
        const userId = socket.userId || 'Anonyme';
        const chatEntry = { userId, message, timestamp: Date.now() };
        chatMessages.push(chatEntry);
        io.emit('new_message', chatEntry);
        console.log(`[CHAT] ${userId}: ${message}`);
    });

    // NOUVEAU: Envoyer une invitation à un salon privé
    socket.on('send_private_invite', ({ targetUserId }) => {
        const inviterId = socket.userId;

        if (!inviterId || !users[inviterId]) {
            socket.emit('private_room_error', { message: 'Vous devez être connecté pour envoyer une invitation.' });
            return;
        }
        if (!targetUserId || targetUserId.trim() === '') {
            socket.emit('private_room_error', { message: 'ID de l\'utilisateur cible manquant.' });
            return;
        }
        if (inviterId === targetUserId) {
            socket.emit('private_room_error', { message: 'Vous ne pouvez pas vous inviter vous-même.' });
            return;
        }
        if (!users[targetUserId] || !users[targetUserId].socketId || !io.sockets.sockets.get(users[targetUserId].socketId)) {
            socket.emit('private_room_error', { message: `L'utilisateur ${targetUserId} n'est pas connecté ou n'existe pas.` });
            return;
        }

        const roomId = generatePrivateRoomId(inviterId, targetUserId);

        // Vérifier si un salon existe déjà entre ces deux utilisateurs
        if (privateRooms.has(roomId)) {
            const room = privateRooms.get(roomId);
            // Si les deux sont déjà dans le salon, les faire rejoindre/rejoindre
            // Ou si l'inviteur est déjà dedans et l'invité n'y est pas encore (cas où l'invité s'est déconnecté et reconnecté)
            if (room.participants.has(inviterId) && room.participants.has(targetUserId)) {
                const targetSocket = io.sockets.sockets.get(users[targetUserId].socketId);
                socket.join(roomId);
                targetSocket.join(roomId);
                socket.privateRoomId = roomId;
                targetSocket.privateRoomId = roomId;

                socket.emit('private_room_joined', { roomName: roomId, chatHistory: room.messages });
                targetSocket.emit('private_room_joined', { roomName: roomId, chatHistory: room.messages });
                io.to(roomId).emit('new_private_message', { userId: 'Système', message: `${inviterId} et ${targetUserId} ont rejoint le salon privé.` });
                console.log(`${inviterId} et ${targetUserId} ont rejoint le salon privé existant ${roomId}.`);
                return;
            }
        }

        // Stocker l'invitation en attente pour l'utilisateur cible
        pendingPrivateRoomInvitations.set(targetUserId, { inviterId, roomId });

        // Envoyer l'invitation à l'utilisateur cible
        const targetSocket = io.sockets.sockets.get(users[targetUserId].socketId);
        if (targetSocket) {
            targetSocket.emit('private_room_invite', { inviterId, roomId });
            socket.emit('private_room_message', { userId: 'Système', message: `Invitation envoyée à ${targetUserId}.` });
            console.log(`Invitation de ${inviterId} à ${targetUserId} pour le salon ${roomId} envoyée.`);
        } else {
            socket.emit('private_room_error', { message: `L'utilisateur ${targetUserId} est hors ligne.` });
            pendingPrivateRoomInvitations.delete(targetUserId); // Supprimer l'invitation si l'utilisateur est hors ligne
        }
    });

    // NOUVEAU: Accepter une invitation à un salon privé
    socket.on('accept_private_invite', ({ inviterId, roomId }) => {
        const invitedId = socket.userId;

        if (!invitedId || !users[invitedId]) {
            socket.emit('private_room_error', { message: 'Vous devez être connecté pour accepter une invitation.' });
            return;
        }

        // Vérifier si l'invitation existe et correspond
        const storedInvite = pendingPrivateRoomInvitations.get(invitedId);
        if (!storedInvite || storedInvite.inviterId !== inviterId || storedInvite.roomId !== roomId) {
            socket.emit('private_room_error', { message: 'Invitation invalide ou expirée.' });
            return;
        }

        // Supprimer l'invitation en attente
        pendingPrivateRoomInvitations.delete(invitedId);

        // Récupérer le socket de l'inviteur
        const inviterSocket = io.sockets.sockets.get(users[inviterId].socketId);
        if (!inviterSocket) {
            socket.emit('private_room_error', { message: 'L\'inviteur n\'est plus connecté.' });
            return;
        }

        // Créer le salon si inexistant, ou récupérer l'existant
        if (!privateRooms.has(roomId)) {
            privateRooms.set(roomId, { participants: new Set(), messages: [] });
            console.log(`Salon privé ${roomId} créé.`);
        }
        const room = privateRooms.get(roomId);

        // Faire joindre les deux utilisateurs au salon
        socket.join(roomId);
        inviterSocket.join(roomId);
        socket.privateRoomId = roomId; // Stocke le roomId sur le socket
        inviterSocket.privateRoomId = roomId;

        room.participants.add(invitedId);
        room.participants.add(inviterId);

        // Émettre l'événement de succès de jonction aux deux utilisateurs
        socket.emit('private_room_joined', { roomName: roomId, chatHistory: room.messages });
        inviterSocket.emit('private_room_joined', { roomName: roomId, chatHistory: room.messages });

        // Envoyer un message système dans le salon
        io.to(roomId).emit('new_private_message', { userId: 'Système', message: `${invitedId} a rejoint le salon privé avec ${inviterId}.` });
        console.log(`${invitedId} a accepté l'invitation de ${inviterId} et a rejoint le salon ${roomId}.`);
    });

    // NOUVEAU: Refuser une invitation à un salon privé
    socket.on('decline_private_invite', ({ inviterId, roomId }) => {
        const invitedId = socket.userId;

        if (!invitedId || !users[invitedId]) {
            return; // L'utilisateur n'est pas connecté, ignorer
        }

        const storedInvite = pendingPrivateRoomInvitations.get(invitedId);
        if (storedInvite && storedInvite.inviterId === inviterId && storedInvite.roomId === roomId) {
            pendingPrivateRoomInvitations.delete(invitedId);
            const inviterSocket = io.sockets.sockets.get(users[inviterId].socketId);
            if (inviterSocket) {
                inviterSocket.emit('private_room_message', { userId: 'Système', message: `${invitedId} a refusé votre invitation.` });
            }
            console.log(`${invitedId} a refusé l'invitation de ${inviterId}.`);
        }
    });

    // NOUVEAU: Envoyer un message dans un salon privé
    socket.on('send_private_message', (data) => {
        const { message } = data;
        const userId = socket.userId;
        const roomId = socket.privateRoomId; // Récupère le salon privé du socket

        if (!userId || !users[userId]) {
            socket.emit('private_room_error', { message: 'Vous devez être connecté pour envoyer un message.' });
            return;
        }
        if (!roomId || !privateRooms.has(roomId)) {
            socket.emit('private_room_error', { message: 'Vous n\'êtes pas dans un salon privé actif.' });
            return;
        }
        if (!message || message.trim() === '') {
            socket.emit('private_room_error', { message: 'Le message ne peut pas être vide.' });
            return;
        }

        const chatEntry = { userId, message, timestamp: Date.now() };
        privateRooms.get(roomId).messages.push(chatEntry);

        // Émettre le message uniquement aux clients dans ce salon
        io.to(roomId).emit('new_private_message', chatEntry);
        console.log(`[PRIVATE CHAT - ${roomId}] ${userId}: ${message}`);
    });


    // --- Actions Collectives ---
    socket.on('propose_collective_action', (data) => {
        const { action } = data;
        const userId = socket.userId;

        if (!userId || !users[userId]) {
            socket.emit('action_error', { message: 'Vous devez être connecté pour proposer une action.' });
            return;
        }

        // Règle d'exclusivité : une seule action collective à la fois
        if (collectiveActionVote) {
            socket.emit('action_error', { message: 'Une action collective est déjà en cours de vote.' });
            return;
        }

        const ACTION_VOTE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

        collectiveActionVote = {
            id: `action_${Date.now()}`, // ID unique pour cette action
            action,
            yes: 0,
            no: 0,
            voters: [],
            proposer: userId,
            startTime: Date.now(),
            status: 'active', // Nouvelle propriété: l'action est active
            // Démarre le timer d'expiration et stocke son ID
            timerId: setTimeout(() => resolveCollectiveAction(collectiveActionVote.id), ACTION_VOTE_DURATION_MS)
        };

        // Émet la proposition d'action collective (nettoyée)
        io.emit('collective_action_proposal', getCleanCollectiveActionVote(collectiveActionVote));
        console.log(`Nouvelle action collective proposée par ${userId}: "${action}"`);
    });

    socket.on('vote_collective_action', (data) => {
        const { vote } = data;
        const userId = socket.userId;

        if (!userId || !users[userId]) {
            socket.emit('action_error', { message: 'Vous devez être connecté pour voter.' });
            return;
        }

        if (!collectiveActionVote) {
            socket.emit('action_error', { message: 'Aucune action collective en cours de vote.' });
            return;
        }
        if (collectiveActionVote.voters.includes(userId)) {
            socket.emit('action_error', { message: 'Vous avez déjà voté pour cette action.' });
            return;
        }

        if (vote === 'yes') {
            collectiveActionVote.yes++;
        } else if (vote === 'no') {
            collectiveActionVote.no++;
        } else {
            socket.emit('action_error', { message: 'Vote invalide. Utilisez "yes" ou "no".' });
            return;
        }
        collectiveActionVote.voters.push(userId);

        // Calcul du quorum : 50% des utilisateurs connectés
        const connectedUsersCount = Object.keys(users).length;
        const requiredYesVotes = Math.ceil(connectedUsersCount / 2); // Arrondi au supérieur

        if (collectiveActionVote.yes >= requiredYesVotes) {
            console.log(`Action collective "${collectiveActionVote.action}" réussie avec ${collectiveActionVote.yes} votes OUI sur ${connectedUsersCount} connectés !`);
            io.emit('collective_action_success', {
                action: collectiveActionVote.action,
                message: `L'action collective "${collectiveActionVote.action}" a été lancée !`
            });
            clearTimeout(collectiveActionVote.timerId); // Annule le timer d'expiration

            // Marque comme succès et stocke comme dernière action
            collectiveActionVote.status = 'success';
            lastCollectiveAction = { ...collectiveActionVote }; // Copie l'état final

            collectiveActionVote = null; // Réinitialise l'action collective en cours

            // Émet la dernière action terminée pour affichage
            io.emit('collective_action_update', getCleanCollectiveActionVote(lastCollectiveAction));
        } else {
            // Met à jour le nombre de votes (nettoyé)
            io.emit('collective_action_update', getCleanCollectiveActionVote(collectiveActionVote));
            console.log(`${userId} a voté "${vote}" pour l'action "${collectiveActionVote.action}". Votes OUI: ${collectiveActionVote.yes}/${requiredYesVotes}`);
        }
    });

    // --- Déconnexion ---
    socket.on('disconnect', () => {
        console.log(`Utilisateur déconnecté: ${socket.id}`);
        const userId = socket.userId;

        if (userId && users[userId]) {
            // Si l'utilisateur était dans un salon privé, le retirer du salon
            if (socket.privateRoomId) {
                const room = privateRooms.get(socket.privateRoomId);
                if (room) {
                    room.participants.delete(userId);
                    io.to(socket.privateRoomId).emit('new_private_message', { userId: 'Système', message: `${userId} a quitté le salon.` });
                    if (room.participants.size === 0) {
                        privateRooms.delete(socket.privateRoomId);
                        console.log(`Salon privé ${socket.privateRoomId} supprimé car vide.`);
                    }
                }
            }
            // En production, vous pourriez vouloir supprimer l'utilisateur du tableau 'users'
            // ou gérer les impacts sur le quorum des actions collectives si un votant se déconnecte.
            // Pour l'instant, le calcul du quorum se fera sur les utilisateurs *actuellement* connectés.
            // delete users[userId]; // Décommenter si vous voulez que les utilisateurs soient "oubliés" à la déconnexion
        }
    });
});

// --- Logique de décroissance des émotions ---
const EMOTION_DECAY_TIME_MS = 5 * 60 * 1000; // 5 minutes en millisecondes
const EMOTION_CHECK_INTERVAL_MS = 30 * 1000; // Vérifie toutes les 30 secondes

setInterval(() => {
    let needsEmotionUpdate = false;
    const now = Date.now();

    for (const userId in userActiveEmotions) {
        const userEmotions = userActiveEmotions[userId];
        for (const emotionType in userEmotions) {
            const lastActivationTime = userEmotions[emotionType];

            if (now - lastActivationTime > EMOTION_DECAY_TIME_MS) {
                if (emotionCounts[emotionType] > 0) {
                    emotionCounts[emotionType]--;
                    needsEmotionUpdate = true;
                    console.log(`Émotion "${emotionType}" décrémentée (décroissance) pour ${userId}.`);
                }
                delete userEmotions[emotionType];
            }
        }
        if (Object.keys(userEmotions).length === 0) {
            delete userActiveEmotions[userId];
        }
    }

    if (needsEmotionUpdate) {
        io.emit('emotion_update', emotionCounts);
    }
}, EMOTION_CHECK_INTERVAL_MS);

// NOUVELLE FONCTION : Résolution de l'action collective par expiration
function resolveCollectiveAction(actionId) {
    // Vérifie si l'action collective est toujours active et correspond à celle qui a déclenché le timer
    if (collectiveActionVote && collectiveActionVote.id === actionId) {
        console.log(`L'action collective "${collectiveActionVote.action}" a expiré.`);
        io.emit('collective_action_expired', {
            action: collectiveActionVote.action,
            message: `L'action collective "${collectiveActionVote.action}" n'a pas atteint le quorum à temps et a expiré.`
        });
        
        // Marque comme expirée et stocke comme dernière action
        collectiveActionVote.status = 'expired';
        lastCollectiveAction = { ...collectiveActionVote }; // Copie l'état final

        collectiveActionVote = null; // Réinitialise l'action collective en cours

        // Émet la dernière action terminée pour affichage
        io.emit('collective_action_update', getCleanCollectiveActionVote(lastCollectiveAction));
    }
}


// --- Génération de Paris Aléatoires (Scheduler) ---
function generateRandomBet() {
    betIdCounter++;
    const questions = [
        "Quel sera le prochain événement marquant dans les 5 prochaines minutes ?",
        "Quelle émotion dominera le public dans les 5 prochaines minutes ?",
        "Y aura-t-il un but/point dans les 5 prochaines minutes ?",
        "Le public va-t-il lancer une ola dans les 5 prochaines minutes ?"
    ];
    const options = [
        ["But/Point", "Faute/Arrêt", "Hors-jeu/Hors-limites"],
        ["Rage", "Hype", "Love", "Shock"],
        ["Oui", "Non"],
        ["Oui", "Non"]
    ];

    const randomIndex = Math.floor(Math.random() * questions.length);
    currentBet = {
        id: `bet_${betIdCounter}`,
        question: questions[randomIndex],
        options: options[randomIndex],
        endTime: Date.now() + 30 * 1000,
        totalPot: 0,
        bets: {}
    };

    io.emit('new_bet_proposal', currentBet);
    console.log(`Nouveau pari proposé: ${currentBet.question}`);

    setTimeout(() => {
        resolveBet(currentBet.id);
    }, 30 * 1000);
}

function resolveBet(betId) {
    if (!currentBet || currentBet.id !== betId) {
        return;
    }

    console.log(`Résolution du pari: ${currentBet.question}`);
    io.emit('bet_ended', { betId: currentBet.id, message: 'Le temps est écoulé pour ce pari !' });

    const winningOption = currentBet.options[Math.floor(Math.random() * currentBet.options.length)];
    console.log(`Option gagnante (simulée): "${winningOption}"`);

    let winningBettorsData = {}; // { userId: total_stake_on_winning_option }
    let totalWinningStake = 0;

    // 1. Identifier les parieurs gagnants et leur mise totale sur l'option gagnante
    for (const userId in currentBet.bets) {
        currentBet.bets[userId].forEach(bet => {
            if (bet.option === winningOption) {
                if (!winningBettorsData[userId]) {
                    winningBettorsData[userId] = 0;
                }
                winningBettorsData[userId] += bet.amount;
                totalWinningStake += bet.amount;
            }
        });
    }

    let totalWinningsDistributed = 0;
    let winningsPerUser = {}; // Pour stocker les gains finaux par utilisateur

    // 2. Répartir le pot commun proportionnellement
    if (totalWinningStake > 0) {
        for (const userId in winningBettorsData) {
            const userStake = winningBettorsData[userId];
            // Calcul proportionnel: (mise_utilisateur / mise_totale_gagnante) * pot_total
            const winnings = (userStake / totalWinningStake) * currentBet.totalPot;
            
            if (users[userId]) {
                users[userId].chzBalance += winnings;
                winningsPerUser[userId] = winnings;
                totalWinningsDistributed += winnings;
                io.to(users[userId].socketId).emit('your_balance_update', { chzBalance: users[userId].chzBalance });
                console.log(`${userId} a gagné ${winnings.toFixed(2)} CHZ. Nouveau solde: ${users[userId].chzBalance}`);
            }
        }
    } else {
        console.log("Aucun parieur n'a misé sur l'option gagnante. Le pot n'est pas distribué.");
    }

    // Calcul de la commission (ou "burn")
    // La commission est ce qui reste du pot si les gains distribués ne sont pas exactement le pot total
    // (cela peut arriver avec des arrondis ou si personne n'a gagné)
    const commission = currentBet.totalPot - totalWinningsDistributed;
    if (commission > 0) {
        console.log(`Commission/Burn (simulé): ${commission.toFixed(2)} CHZ`);
    } else if (commission < 0) {
        // Cela ne devrait pas arriver avec la logique actuelle, mais pour la robustesse
        console.warn(`Attention: Plus de CHZ distribués que dans le pot! Différence: ${commission.toFixed(2)}`);
    }


    io.emit('bet_results', {
        betId: currentBet.id,
        winningOption: winningOption,
        message:
 `Le pari sur "${currentBet.question}" est terminé. Option gagnante: "${winningOption}"!`,
        winningBets: winningsPerUser // Envoyer les gains par utilisateur
    });

    currentBet = null;
}

setInterval(generateRandomBet, 60 * 1000); // Génère un nouveau pari toutes les minutes

// 5. Démarrage du Serveur
server.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
    console.log(`Accédez à http://localhost:${PORT}`);
    generateRandomBet(); // Génère le premier pari au démarrage
});
