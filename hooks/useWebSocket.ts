import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '@/store'
import { updateEmotionFromServer, bulkUpdateEmotions } from '@/store/slices/emotionSlice'
import { updateOnlineUsers } from '@/store/slices/userSlice'
import { updateSpectatorCount, addEvent, removeEvent } from '@/store/slices/stadiumSlice'

interface WebSocketEvents {
  'emotion:update': { emotion: string; count: number; intensity: number }
  'emotion:bulk': Record<string, { count: number; intensity: number }>
  'users:online': any[]
  'stadium:spectator_count': number
  'stadium:event': { type: 'add' | 'remove'; event: string }
  'match:goal': { team: string; player: string; minute: number }
  'match:card': { team: string; player: string; type: 'yellow' | 'red'; minute: number }
}

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector(state => state.user)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    // In a real app, this would be your WebSocket server URL
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001'
    
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('WebSocket connected')
      reconnectAttempts.current = 0
      
      // Join stadium room
      socket.emit('join:stadium', { userId: profile?.id })
    })

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      
      // Auto-reconnect logic
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        return
      }
      
      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.current++
          connect()
        }, Math.pow(2, reconnectAttempts.current) * 1000) // Exponential backoff
      }
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })

    // Emotion updates
    socket.on('emotion:update', (data: WebSocketEvents['emotion:update']) => {
      dispatch(updateEmotionFromServer({
        emotion: data.emotion as any,
        count: data.count,
        intensity: data.intensity,
      }))
    })

    socket.on('emotion:bulk', (data: WebSocketEvents['emotion:bulk']) => {
      dispatch(bulkUpdateEmotions(data as any))
    })

    // User updates
    socket.on('users:online', (users: WebSocketEvents['users:online']) => {
      dispatch(updateOnlineUsers(users))
    })

    // Stadium updates
    socket.on('stadium:spectator_count', (count: WebSocketEvents['stadium:spectator_count']) => {
      dispatch(updateSpectatorCount(count))
    })

    socket.on('stadium:event', (data: WebSocketEvents['stadium:event']) => {
      if (data.type === 'add') {
        dispatch(addEvent(data.event))
      } else {
        dispatch(removeEvent(data.event))
      }
    })

    // Match events
    socket.on('match:goal', (data: WebSocketEvents['match:goal']) => {
      // Handle goal events - could trigger automatic crowd reactions
      console.log('Goal scored:', data)
    })

    socket.on('match:card', (data: WebSocketEvents['match:card']) => {
      // Handle card events
      console.log('Card shown:', data)
    })

  }, [dispatch, profile?.id])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
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
    isConnected: socketRef.current?.connected || false,
    connect,
    disconnect,
    emit,
    emitEmotion,
    emitUserUpdate,
  }
}

export default useWebSocket