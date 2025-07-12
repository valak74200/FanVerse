"use client"

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store'
import dynamic from 'next/dynamic'
import { EmotionPanel } from '@/components/stadium/EmotionPanel'
import { StadiumControls } from '@/components/stadium/StadiumControls'
import { WalletButton } from '@/components/web3/WalletButton'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setProfile } from '@/store/slices/userSlice'
import { stopAnimation } from '@/store/slices/emotionSlice'
import { useWebSocket } from '@/hooks/useWebSocket'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Wifi, 
  WifiOff, 
  Settings, 
  User,
  Trophy,
  Star,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

// Charger VirtualStadium uniquement côté client
const VirtualStadium = dynamic(() => import('@/components/stadium/VirtualStadium').then(mod => ({ default: mod.VirtualStadium })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Chargement du stade virtuel...</p>
      </div>
    </div>
  )
})

// Inner component that uses Redux hooks
function StadiumContent() {
  const dispatch = useAppDispatch()
  const { isConnected } = useWebSocket()
  const [showSidebar, setShowSidebar] = useState(false)
  
  const { profile, isAuthenticated, onlineUsers } = useAppSelector(state => state.user)
  const { spectatorCount } = useAppSelector(state => state.stadium)
  const { totalReactions } = useAppSelector(state => state.emotion)

  // Auto-login for demo purposes
  useEffect(() => {
    if (!isAuthenticated) {
      // Générer l'ID côté client uniquement pour éviter les erreurs d'hydratation
      const userId = 'demo-user-' + Math.random().toString(36).substr(2, 9)
      dispatch(setProfile({
        id: userId,
        name: 'FanVerse User',
        avatar: 'default-avatar',
        stats: {
          totalReactions: 0,
          favoriteEmotion: null,
          timeSpent: 0,
        },
      }))
    }
  }, [dispatch, isAuthenticated])

  // Emotion decay effect
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(stopAnimation())
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <header className="relative z-50 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-xl border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-purple-400 hover:text-white lg:hidden"
            >
              {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Virtual Stadium</h1>
                <p className="text-xs text-gray-400">Live Match Experience</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white">{spectatorCount.toLocaleString('en-US')}</span>
              <span className="text-xs text-gray-400">fans</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white">{totalReactions}</span>
              <span className="text-xs text-gray-400">reactions</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xs text-gray-400">
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>

          {/* User Profile and Wallet */}
          <div className="flex items-center space-x-3">
            {profile && (
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="text-white font-medium">{profile.name}</div>
                  <div className="text-gray-400 text-xs">
                    {profile.stats.totalReactions} reactions
                  </div>
                </div>
              </div>
            )}
            
            <WalletButton />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ 
            x: showSidebar ? 0 : -400,
            opacity: showSidebar ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="fixed lg:relative lg:translate-x-0 lg:opacity-100 z-40 w-80 h-full bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-r border-purple-500/30 overflow-y-auto"
        >
          <div className="p-4 space-y-4">
            <StadiumControls />
          </div>
        </motion.div>

        {/* Main Stadium View */}
        <div className="flex-1 relative">
          <VirtualStadium className="w-full h-full" />
          
          {/* Mobile overlay for sidebar */}
          {showSidebar && (
            <div 
              className="lg:hidden absolute inset-0 bg-black/50 z-30"
              onClick={() => setShowSidebar(false)}
            />
          )}
        </div>

        {/* Right Panel - Emotions */}
        <div className="hidden xl:block w-80 border-l border-gray-800 overflow-y-auto">
          <div className="p-4">
            <EmotionPanel />
          </div>
        </div>
      </div>

      {/* Mobile Emotion Panel */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 z-50">
        <Card className="bg-black/90 backdrop-blur-xl border-purple-500/30 p-4">
          <EmotionPanel />
        </Card>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="fixed top-20 right-4 z-50">
          <Card className="bg-red-500/20 border-red-500/30 p-3">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">Connection Lost</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// Main page component with Redux Provider
export default function StadiumPage() {
  return (
    <Provider store={store}>
      <StadiumContent />
    </Provider>
  )
}