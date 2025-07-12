import { useEffect, useState } from 'react'
import SocketService from '../services/socket'

export function useSocket(userId?: string, walletAddress?: string) {
  const [connected, setConnected] = useState(false)
  const socketService = SocketService.getInstance()

  useEffect(() => {
    const socket = socketService.connect(userId, walletAddress)

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    return () => {
      // Ne pas déconnecter complètement, juste nettoyer les listeners
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [userId, walletAddress])

  return {
    connected,
    socketService,
    sendEmotion: (emotion: string) => socketService.sendEmotion(emotion),
    sendMessage: (message: string) => socketService.sendMessage(message),
    getMyNFTs: () => socketService.getMyNFTs(),
    getBlockchainBets: () => socketService.getBlockchainBets()
  }
}