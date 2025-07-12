import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private static instance: SocketService

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  connect(userId?: string, walletAddress?: string) {
    if (this.socket?.connected) return this.socket

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected to backend')
      
      // Auto-authenticate if user data available
      if (userId) {
        this.authenticate(userId, walletAddress)
      }
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected from backend')
    })

    return this.socket
  }

  authenticate(userId: string, walletAddress?: string) {
    if (this.socket) {
      this.socket.emit('authenticate', { userId, walletAddress })
    }
  }

  // Écouter les événements blockchain
  onBlockchainBetPlaced(callback: (data: any) => void) {
    this.socket?.on('blockchain_bet_placed', callback)
  }

  onBlockchainNFTMinted(callback: (data: any) => void) {
    this.socket?.on('blockchain_nft_minted', callback)
  }

  onBlockchainStatus(callback: (data: any) => void) {
    this.socket?.on('blockchain_status', callback)
  }

  // Émettre des événements
  sendEmotion(emotionType: string) {
    this.socket?.emit('send_emotion', { emotionType })
  }

  sendMessage(message: string) {
    this.socket?.emit('send_message', { message })
  }

  getMyNFTs() {
    this.socket?.emit('get_my_nfts')
  }

  getBlockchainBets() {
    this.socket?.emit('get_blockchain_bets')
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }
}

export default SocketService