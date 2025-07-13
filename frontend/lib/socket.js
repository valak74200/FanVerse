import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.userId = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.socket) {
      this.socket.disconnect();
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    this.socket = io(API_URL, {
      transports: ['polling', 'websocket'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 10,
      forceNew: true,
      upgrade: true
    });

    this.userId = userId;
    this.setupEventListeners();
    
    // Authentification automatique
    this.socket.emit('authenticate', { userId });
    
    return new Promise((resolve, reject) => {
      this.socket.on('authenticated', (data) => {
        this.isConnected = true;
        console.log('✅ Socket connecté et authentifié:', data);
        resolve(data);
      });

      this.socket.on('login_error', (error) => {
        console.error('❌ Erreur d\'authentification:', error);
        reject(error);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion socket:', error);
        reject(error);
      });
    });
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('🔌 Socket connecté');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket déconnecté:', reason);
      this.isConnected = false;
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 Socket reconnecté');
      if (this.userId) {
        this.socket.emit('authenticate', { userId: this.userId });
      }
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Erreur de reconnexion:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Reconnexion échouée après tous les essais');
    });

    this.socket.on('error', (error) => {
      console.error('❌ Erreur Socket.io:', error);
    });
  }

  // Méthodes pour les événements
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️  Socket non connecté, événement ignoré:', event);
    }
  }

  // Méthodes spécifiques aux fonctionnalités

  // === PARIS ===
  placeBet(optionIndex, amount) {
    this.emit('place_bet', { optionIndex, amount });
  }

  onNewBet(callback) {
    this.on('new_bet', callback);
  }

  onBetAccepted(callback) {
    this.on('bet_accepted', callback);
  }

  onBetError(callback) {
    this.on('bet_error', callback);
  }

  onBetClosed(callback) {
    this.on('bet_closed', callback);
  }

  onBetResult(callback) {
    this.on('bet_result', callback);
  }

  // === CHAT ===
  sendMessage(message) {
    this.emit('send_message', { message });
  }

  onNewMessage(callback) {
    this.on('new_message', callback);
  }

  // === ÉMOTIONS ===
  sendEmotion(emotionType) {
    this.emit('send_emotion', { emotionType });
  }

  onEmotionUpdate(callback) {
    this.on('emotion_update', callback);
  }

  // === ACTIONS COLLECTIVES ===
  createAction(action) {
    this.emit('create_action', { action });
  }

  voteAction(actionId, vote) {
    this.emit('vote_action', { actionId, vote });
  }

  onNewAction(callback) {
    this.on('new_action', callback);
  }

  onActionUpdate(callback) {
    this.on('action_update', callback);
  }

  onActionResult(callback) {
    this.on('action_result', callback);
  }

  onActionError(callback) {
    this.on('action_error', callback);
  }

  // === AUTHENTIFICATION ===
  onAuthenticated(callback) {
    this.on('authenticated', callback);
  }

  // === UTILITAIRES ===
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.userId = null;
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      userId: this.userId,
      socketId: this.socket?.id
    };
  }
}

// Instance singleton
const socketService = new SocketService();

export default socketService; 