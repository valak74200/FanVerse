import { useEffect, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'

export const useWebSocket = () => {
  const socketRef = useRef(null)
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector(state => state.user)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return

    try {
      // In a real app, this would be your WebSocket server URL
      const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001'
      
      socketRef.current = new WebSocket(socketUrl)

      const socket = socketRef.current

      socket.onopen = () => {
        console.log('WebSocket connected')
        reconnectAttempts.current = 0
        
        // Join stadium room
        socket.send(JSON.stringify({ 
          type: 'join:stadium', 
          data: { userId: profile?.id } 
        }))
      }

      socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        
        // Auto-reconnect logic
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.current++
            connect()
          }, Math.pow(2, reconnectAttempts.current) * 1000) // Exponential backoff
        }
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          switch (message.type) {
            case 'emotion:update':
              // Handle emotion updates from server
              console.log('Emotion update received:', message.data)
              break
            case 'users:online':
              // Handle online users update
              console.log('Online users update:', message.data)
              break
            case 'stadium:event':
              // Handle stadium events
              console.log('Stadium event:', message.data)
              break
            default:
              console.log('Unknown message type:', message.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

    } catch (error) {
      console.error('WebSocket connection failed:', error)
    }
  }, [dispatch, profile?.id])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
  }, [])

  const emit = useCallback((type: string, data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, data }))
    } else {
      console.warn('WebSocket not connected, cannot emit:', type)
    }
  }, [])

  const emitEmotion = useCallback((emotion: string) => {
    emit('emotion:trigger', {
      emotion,
      userId: profile?.id,
      timestamp: Date.now(),
    })
  }, [emit, profile?.id])

  const emitUserUpdate = useCallback((userData: any) => {
    emit('user:update', {
      ...userData,
      userId: profile?.id,
    })
  }, [emit, profile?.id])

  useEffect(() => {
    if (profile?.id) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [profile?.id, connect, disconnect])

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
    connect,
    disconnect,
    emit,
    emitEmotion,
    emitUserUpdate,
  }
}

export default useWebSocket
