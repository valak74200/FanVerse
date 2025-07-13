"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  MessageSquare, 
  Timer, 
  Trophy,
  Heart,
  Flame,
  Send,
  ArrowLeft,
  Activity,
  Target,
  Coins,
  Maximize,
  Bell,
  TrendingUp,
  Wifi,
  Signal,
  Battery,
  Crown,
  Shield,
  Wallet,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import socketService from "../../lib/socket"
import RealtimeStats from "../components/fanverse/chiliz/RealtimeStats"
import Waves from "../components/fanverse/chiliz/Waves"
import Image from "next/image"

// Variantes d'animation inspirées de la page d'accueil
const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const glowVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: [0, 1.2, 1], 
    opacity: [0, 0.8, 0.6],
    transition: {
      duration: 2,
      delay: 0.5,
      ease: "easeOut"
    }
  }
}

const panelVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// Types simplifiés
interface BettingData {
  question: string
  options: string[]
  duration: number
  timeRemaining: number
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: number
  emotion?: string
  fanPoints?: number
  groupId?: string
  isVoiceMessage?: boolean
  voiceDuration?: number
}

interface ChatGroup {
  id: string
  name: string
  description: string
  emoji: string
  memberCount: number
  isPrivate: boolean
  hasVoiceChat: boolean
  voiceParticipants: string[]
  lastMessage?: ChatMessage
  createdBy: string
  admins: string[]
  createdAt: number
}

interface EmotionData {
  anger: number
  surprise: number
  joy: number
  hype: number
  fear: number
  sadness: number
  total: number
}

interface User {
  id: string
  name: string
  chzBalance: number
  psgTokens: number
  isOnline: boolean
  walletAddress?: string
  walletConnected?: boolean
}

// Composant Header amélioré pour la tribune
const Header = ({ user, onBack, onWalletClick }: { user: User | null, onBack: () => void, onWalletClick: () => void }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'bet', message: 'Nouveau pari disponible', time: '2 min', icon: Trophy, color: 'text-primary' },
    { id: 2, type: 'win', message: 'Vous avez gagné 25 CHZ !', time: '5 min', icon: Target, color: 'text-green-400' },
    { id: 3, type: 'chat', message: '3 nouveaux messages', time: '10 min', icon: MessageSquare, color: 'text-blue-400' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date())
    }
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Gérer le scroll pour changer l'apparence
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWalletConnect = async () => {
    try {
      console.log('🔗 Tentative de connexion au wallet...')
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        console.log('✅ Wallet connecté')
      } else {
        console.log('❌ MetaMask non détecté')
        onWalletClick()
      }
    } catch (error) {
      console.error('❌ Erreur de connexion wallet:', error)
      onWalletClick()
    }
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400'
      case 'connecting': return 'text-yellow-400'
      case 'disconnected': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connecté'
      case 'connecting': return 'Connexion...'
      case 'disconnected': return 'Déconnecté'
      default: return 'Inconnu'
    }
  }

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-primary/40 shadow-2xl shadow-primary/20' 
          : 'bg-black/90 backdrop-blur-xl border-b border-primary/30'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Effets de fond animés */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent-comp/10 pointer-events-none"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Particules flottantes */}
      <motion.div
        className="absolute top-2 left-1/4 w-1 h-1 bg-primary/60 rounded-full pointer-events-none"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-2 right-1/3 w-1 h-1 bg-accent-comp/60 rounded-full pointer-events-none"
        animate={{
          y: [0, 10, 0],
          x: [0, -5, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="relative px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Section gauche */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <motion.button
              onClick={onBack}
              className="flex items-center space-x-2 text-white hover:text-primary transition-all duration-300 group bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20 hover:border-primary/40"
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              <span className="hidden md:inline font-medium">Retour</span>
            </motion.button>
            
            <motion.div 
              className="h-8 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Logo FanVerse */}
              <div className="relative">
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-primary/30 overflow-hidden"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Image 
                    src="/images/logo_fanverse.jpg" 
                    alt="FanVerse Logo" 
                    width={40} 
                    height={40} 
                    className="object-cover w-full h-full"
                  />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.6, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-primary to-accent-comp bg-clip-text text-transparent">
                  Tribune FanVerse
                </h1>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-muted-foreground">
                    {currentTime.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center space-x-1">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'connected' ? 'bg-green-500' :
                        connectionStatus === 'connecting' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      animate={connectionStatus === 'connected' ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                      } : connectionStatus === 'connecting' ? {
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      } : {}}
                      transition={{
                        duration: connectionStatus === 'connecting' ? 1 : 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className={`font-medium ${getConnectionStatusColor()}`}>
                      {getConnectionStatusText()}
                    </span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-accent-comp font-medium">Live</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section droite */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Statistiques rapides */}
            <motion.div 
              className="hidden lg:flex items-center space-x-4 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-white">1,247</span>
                <span className="text-xs text-muted-foreground">en ligne</span>
              </div>
              <div className="w-px h-4 bg-primary/30" />
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-accent-comp" />
                <span className="text-sm font-medium text-white">89%</span>
                <span className="text-xs text-muted-foreground">activité</span>
              </div>
            </motion.div>

            {/* Profil utilisateur */}
            {user && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-white">{user.name}</div>
                    <div className="text-xs flex items-center space-x-2">
                      <span className="text-primary font-bold">{user.chzBalance.toFixed(2)} CHZ</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-accent-comp font-bold">{user.psgTokens} PSG</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-accent-comp/30 rounded-full flex items-center justify-center border-2 border-primary/50">
                      <span className="text-lg font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <motion.div 
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                        user.isOnline ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      animate={user.isOnline ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion.button>

                {/* Menu utilisateur */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute right-0 top-14 w-64 bg-black/95 backdrop-blur-xl border border-primary/30 rounded-xl shadow-2xl shadow-primary/20 p-4 z-50"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 pb-3 border-b border-primary/20">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-accent-comp/30 rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-white">{user.name}</div>
                            <div className="text-sm text-muted-foreground">Membre depuis Oct 2024</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-primary/10 rounded-lg">
                            <span className="text-sm text-white">Solde CHZ</span>
                            <span className="font-bold text-primary">{user.chzBalance.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-accent-comp/10 rounded-lg">
                            <span className="text-sm text-white">Tokens PSG</span>
                            <span className="font-bold text-accent-comp">{user.psgTokens}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-primary/20">
                          <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-primary/10 rounded-lg transition-colors">
                            Paramètres
                          </button>
                          <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-primary/10 rounded-lg transition-colors">
                            Historique
                          </button>
                          <button className="w-full text-left p-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={handleNotificationClick}
                className="relative p-3 rounded-full bg-black/50 backdrop-blur-sm border border-primary/20 text-white hover:text-primary hover:border-primary/40 transition-all duration-300 group"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Bell className="w-5 h-5 group-hover:animate-bounce" />
                {notifications.length > 0 && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <span className="text-xs font-bold text-white">{notifications.length}</span>
                  </motion.div>
                )}
              </motion.button>

              {/* Dropdown notifications */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute right-0 top-14 w-80 bg-black/95 backdrop-blur-xl border border-primary/30 rounded-xl shadow-2xl shadow-primary/20 p-4 z-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start space-x-3 p-3 bg-black/30 border border-primary/20 rounded-lg hover:bg-black/50 transition-colors group"
                        >
                          <div className={`p-2 rounded-lg bg-black/50 ${notification.color}`}>
                            <notification.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">Il y a {notification.time}</p>
                          </div>
                          <button
                            onClick={() => clearNotification(notification.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                      
                      {notifications.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Aucune notification</p>
                        </div>
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-primary/20">
                        <button
                          onClick={() => setNotifications([])}
                          className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          Tout effacer
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bouton Wallet */}
            <motion.button
              onClick={handleWalletConnect}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary/80 to-accent-comp/80 hover:from-primary hover:to-accent-comp text-white px-4 py-3 rounded-full font-bold transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 border border-primary/30 group"
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 10px 25px -5px rgba(255, 99, 71, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Wallet className="w-4 h-4" />
              </motion.div>
              <span className="hidden md:inline">Wallet</span>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

// Composant de Paris connecté avec backend
const BettingPanel = ({ user, onUserUpdate }: { user: User | null, onUserUpdate: (user: User) => void }) => {
  const [bettingData, setBettingData] = useState<BettingData | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState(10)
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [betStatus, setBetStatus] = useState<'idle' | 'betting' | 'closed' | 'waiting'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info')
  const [totalPot, setTotalPot] = useState(0)
  const [userBets, setUserBets] = useState<{[key: string]: {option: string, amount: number}}>({})
  const [betsHistory, setBetsHistory] = useState<Array<{
    id: string
    question: string
    option: string
    amount: number
    timestamp: number
    status: 'pending' | 'won' | 'lost'
    winnings?: number
    potentialWinnings?: number
  }>>([])

  // Écouter les événements de paris du backend
  useEffect(() => {
    if (!socketService.socket) return

    // Nouveau pari reçu
    socketService.socket.on('new_bet', (bet: any) => {
      console.log('🎲 Nouveau pari reçu:', bet)
      setBettingData({
        question: bet.question,
        options: bet.options,
        duration: bet.duration,
        timeRemaining: bet.timeRemaining || bet.duration
      })
      setBetStatus('betting')
      setSelectedOption(null)
      setStatusMessage('')
      setTotalPot(bet.totalPot || 0)
    })

    // Mise à jour du pot en temps réel
    socketService.socket.on('bet_pot_update', (data: any) => {
      console.log('💰 Mise à jour du pot:', data)
      setTotalPot(data.totalPot)
    })

    // Pari accepté
    socketService.socket.on('bet_accepted', (data: any) => {
      console.log('✅ Pari accepté:', data)
      setBetStatus('waiting')
      setStatusMessage(data.message)
      setMessageType('success')
      setIsPlacingBet(false)
      
      // Mettre à jour le solde utilisateur et le pot
      if (user) {
        onUserUpdate({
          ...user,
          chzBalance: data.newBalance
        })
      }
      if (data.totalPot) {
        setTotalPot(data.totalPot)
      }
    })

    // Erreur de pari
    socketService.socket.on('bet_error', (data: any) => {
      console.log('❌ Erreur pari:', data)
      setStatusMessage(data.message)
      setMessageType('error')
      setIsPlacingBet(false)
    })

    // Paris fermés
    socketService.socket.on('bet_closed', (data: any) => {
      console.log('🔒 Paris fermés:', data)
      setBetStatus('closed')
      setStatusMessage(data.message)
      setMessageType('info')
      if (bettingData) {
        setBettingData(prev => prev ? { ...prev, timeRemaining: 0 } : null)
      }
    })

    // Résultat du pari
    socketService.socket.on('bet_result', (data: any) => {
      console.log('🎯 Résultat pari:', data)
      setStatusMessage(data.message)
      setMessageType(data.winnings > 0 ? 'success' : 'error')
      
      // Mettre à jour le solde utilisateur
      if (user) {
        onUserUpdate({
          ...user,
          chzBalance: data.newBalance
        })
      }

      // Ajouter à l'historique
      if (bettingData) {
        const historyEntry = {
          id: Date.now().toString(),
          question: bettingData.question,
          option: data.winningOption,
          amount: betAmount,
          timestamp: Date.now(),
          status: data.winnings > 0 ? 'won' as const : 'lost' as const,
          winnings: data.winnings
        }
        setBetsHistory(prev => [historyEntry, ...prev.slice(0, 4)])
      }

      // Retour à l'état idle après 5 secondes
      setTimeout(() => {
        setBetStatus('idle')
        setBettingData(null)
        setStatusMessage('En attente du prochain pari...')
        setMessageType('info')
      }, 5000)
    })

    return () => {
      socketService.socket?.off('new_bet')
      socketService.socket?.off('bet_pot_update')
      socketService.socket?.off('bet_accepted')
      socketService.socket?.off('bet_error')
      socketService.socket?.off('bet_closed')
      socketService.socket?.off('bet_result')
    }
  }, [user, bettingData, betAmount, onUserUpdate])

  // Timer pour le temps restant
  useEffect(() => {
    if (!bettingData || bettingData.timeRemaining <= 0 || betStatus !== 'betting') return

    const timer = setInterval(() => {
      setBettingData(prev => {
        if (!prev) return null
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1000)
        return { ...prev, timeRemaining: newTimeRemaining }
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [bettingData, betStatus])

  const handlePlaceBet = () => {
    if (!bettingData || selectedOption === null || !user || isPlacingBet) return
    
    if (betAmount > user.chzBalance) {
      setStatusMessage('Solde insuffisant')
      setMessageType('error')
      return
    }

    if (betAmount <= 0) {
      setStatusMessage('Montant invalide')
      setMessageType('error')
      return
    }

    setIsPlacingBet(true)
    setStatusMessage('Placement du pari...')
    setMessageType('info')
    
    // Envoyer le pari au backend
    socketService.socket?.emit('place_bet', {
      optionIndex: selectedOption,
      amount: betAmount
    })
  }

  // Calculer les gains potentiels (multiplicateur x2 comme dans le backend)
  const calculatePotentialWinnings = () => {
    return betAmount * 2
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = bettingData ? ((bettingData.duration - bettingData.timeRemaining) / bettingData.duration) * 100 : 0

  return (
    <motion.div 
      className="relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Effet de lueur d'arrière-plan */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-xl blur-xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="hud-panel-enhanced p-6 space-y-6 relative">
        {/* Header avec effet néon */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <h2 className="text-white font-bold text-xl bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              Paris Live
            </h2>
          </div>
          <motion.div 
            className="flex items-center space-x-2 text-primary font-bold"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">ACTIF</span>
          </motion.div>
        </motion.div>

        {/* Question avec effet de brillance */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="text-white font-bold text-lg mb-4 p-4 bg-gradient-to-r from-primary/10 to-accent-comp/10 rounded-lg border border-primary/20 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="relative z-10">{bettingData?.question || 'Aucun pari en cours'}</span>
          </div>
        </motion.div>

        {/* Timer avec barre de progression animée */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Temps restant</span>
            <motion.span 
              className="text-primary font-bold text-lg font-mono"
              animate={bettingData && bettingData.timeRemaining < 30000 ? {
                scale: [1, 1.1, 1],
                color: ['#ff6b35', '#ff0000', '#ff6b35']
              } : {}}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {bettingData ? formatTime(bettingData.timeRemaining) : '--:--'}
            </motion.span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden border border-primary/20">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-accent-comp to-primary rounded-full"
              style={{ width: `${progress}%` }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(255, 99, 71, 0.5)',
                  '0 0 20px rgba(255, 99, 71, 0.8)',
                  '0 0 10px rgba(255, 99, 71, 0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Options de pari avec hover effects */}
        {bettingData && (
          <motion.div 
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {bettingData.options.map((option, index) => (
              <motion.button
                key={option}
                onClick={() => setSelectedOption(index)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 relative overflow-hidden group ${
                  selectedOption === index
                    ? 'border-primary bg-primary/20 text-white shadow-lg shadow-primary/30'
                    : 'border-primary/30 bg-black/30 text-muted-foreground hover:border-primary/60 hover:bg-primary/10 hover:text-white'
                }`}
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: selectedOption === index 
                    ? "0 10px 25px -5px rgba(255, 99, 71, 0.4)"
                    : "0 5px 15px -3px rgba(255, 99, 71, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              >
                {/* Effet de brillance au hover */}
                <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10 font-bold">{option}</span>
              <div className="text-xs text-primary mt-1 relative z-10">
                Cote: {(2.5 + Math.random() * 2).toFixed(2)}
              </div>
            </motion.button>
          ))}
        </motion.div>
        )}

        {/* Montant du pari */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <label className="text-muted-foreground text-sm">Montant (CHZ)</label>
          <div className="flex items-center space-x-3">
            <motion.input
              type="number"
              value={betAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBetAmount(Number(e.target.value))}
              className="flex-1 bg-black/50 border border-primary/30 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              min="1"
              max="1000"
              whileFocus={{ scale: 1.02 }}
            />
            <div className="text-muted-foreground text-sm">
              Solde: {user?.chzBalance || 0} CHZ
            </div>
          </div>

          {/* Informations du pot et gains potentiels */}
          <div className="bg-black/30 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Pot total estimé:</span>
              <span className="text-primary font-bold">{totalPot.toFixed(2)} CHZ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Gains potentiels:</span>
              <span className="text-green-400 font-bold">+{calculatePotentialWinnings().toFixed(2)} CHZ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Multiplicateur:</span>
              <span className="text-accent-comp font-bold">x2.00</span>
            </div>
          </div>

          {/* Message de statut */}
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center p-3 rounded-lg bg-black/50 ${
                messageType === 'success' ? 'text-green-400' :
                messageType === 'error' ? 'text-red-400' :
                'text-blue-400'
              }`}
            >
              {statusMessage}
            </motion.div>
          )}
        </motion.div>

        {/* Bouton de pari avec animation */}
        {bettingData && betStatus === 'betting' && (
          <motion.button
            onClick={handlePlaceBet}
            disabled={selectedOption === null || isPlacingBet || bettingData.timeRemaining === 0}
            className="w-full py-4 bg-gradient-to-r from-primary via-accent-comp to-primary text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            whileHover={!isPlacingBet && selectedOption !== null ? { 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(255, 99, 71, 0.4)"
            } : {}}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {isPlacingBet && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-comp/20 to-primary/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            <span className="relative z-10">
              {isPlacingBet ? 'Placement en cours...' : 'Placer le pari'}
            </span>
          </motion.button>
        )}

        {/* État d'attente ou idle */}
        {(!bettingData || betStatus === 'idle') && (
          <div className="text-center py-8 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <Timer className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">En attente du prochain pari</p>
            <p className="text-sm text-muted-foreground">Les paris sont générés automatiquement</p>
          </div>
        )}

        {/* État de pari fermé */}
        {bettingData && betStatus === 'closed' && (
          <div className="text-center py-8 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-lg font-medium mb-2">Paris fermés</p>
            <p className="text-sm text-muted-foreground">Résultats en cours...</p>
          </div>
        )}

        {/* État d'attente de résultat */}
        {bettingData && betStatus === 'waiting' && (
          <div className="text-center py-8 text-blue-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="w-8 h-8 text-blue-500" />
              </motion.div>
            </div>
            <p className="text-lg font-medium mb-2">Pari enregistré</p>
            <p className="text-sm text-muted-foreground">En attente des résultats...</p>
          </div>
        )}

        {/* Historique des paris */}
        {betsHistory.length > 0 && (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <h3 className="text-white font-bold text-sm">Mes derniers paris</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {betsHistory.map((bet, index) => (
                <motion.div
                  key={bet.id}
                  className="p-3 bg-black/30 rounded-lg border border-primary/20 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{bet.option}</span>
                    <span className="text-primary font-bold">{bet.amount} CHZ</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-muted-foreground text-xs">
                      Gains: {bet.winnings ? `+${bet.winnings.toFixed(2)} CHZ` : 'En attente'}
                    </span>
                    <motion.span 
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        bet.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        bet.status === 'won' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}
                      animate={bet.status === 'pending' ? {
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {bet.status === 'pending' ? 'En cours' : 
                       bet.status === 'won' ? 'Gagné' : 'Perdu'}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Modal de création de groupe
const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onCreateGroup: (group: ChatGroup) => void 
}) => {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupEmoji, setGroupEmoji] = useState('💬')
  const [isPrivate, setIsPrivate] = useState(false)
  const [hasVoiceChat, setHasVoiceChat] = useState(true)

  const emojiOptions = ['💬', '⚽', '🔥', '🎯', '🏆', '⭐', '🎉', '💪', '❤️', '🔴', '🔵', '🟡', '🟢', '🟣', '🦁', '🛡️']

  const handleCreateGroup = () => {
    if (groupName.trim() && groupDescription.trim()) {
      const newGroup: ChatGroup = {
        id: `group-${Date.now()}`,
        name: groupName.trim(),
        description: groupDescription.trim(),
        emoji: groupEmoji,
        memberCount: 1,
        isPrivate,
        hasVoiceChat,
        voiceParticipants: [],
        createdBy: 'Vous',
        admins: ['Vous'],
        createdAt: Date.now()
      }
      onCreateGroup(newGroup)
      
      // Reset form
      setGroupName('')
      setGroupDescription('')
      setGroupEmoji('💬')
      setIsPrivate(false)
      setHasVoiceChat(true)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-black/90 backdrop-blur-xl rounded-2xl border border-primary/20 p-6 max-w-md w-full mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Créer un groupe</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Nom du groupe */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nom du groupe
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Supporters Lyon"
              className="w-full bg-muted/20 border border-primary/20 rounded-lg px-4 py-2 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              maxLength={30}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Décrivez votre groupe..."
              className="w-full bg-muted/20 border border-primary/20 rounded-lg px-4 py-2 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              rows={3}
              maxLength={100}
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Emoji du groupe
            </label>
            <div className="grid grid-cols-8 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setGroupEmoji(emoji)}
                  className={`p-2 rounded-lg text-xl transition-all ${
                    groupEmoji === emoji
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-muted/20 border border-muted/30 hover:bg-muted/30'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Groupe privé</div>
                <div className="text-xs text-muted-foreground">
                  Nécessite une invitation pour rejoindre
                </div>
              </div>
              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-12 h-6 rounded-full transition-all ${
                  isPrivate ? 'bg-primary' : 'bg-muted/30'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                  isPrivate ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Chat vocal</div>
                <div className="text-xs text-muted-foreground">
                  Permet les discussions vocales
                </div>
              </div>
              <button
                onClick={() => setHasVoiceChat(!hasVoiceChat)}
                className={`w-12 h-6 rounded-full transition-all ${
                  hasVoiceChat ? 'bg-primary' : 'bg-muted/30'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                  hasVoiceChat ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-muted/20 hover:bg-muted/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || !groupDescription.trim()}
              className="flex-1 bg-primary hover:bg-primary/80 disabled:bg-muted disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Composant Chat FanVerse avec chat général et groupes
const ChatPanel = () => {
  const [currentChatType, setCurrentChatType] = useState<'general' | 'groups'>('general')
  const [currentGroup, setCurrentGroup] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('Connexion...')
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Groupes de chat disponibles
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([
    {
      id: 'psg-hardcore',
      name: 'PSG Hardcore',
      description: 'Pour les vrais supporters PSG',
      emoji: '🔴',
      memberCount: 2847,
      isPrivate: false,
      hasVoiceChat: true,
      voiceParticipants: ['AlexPSG92', 'MarineFan', 'PierreUltra'],
      createdBy: 'UltrasPSG',
      admins: ['UltrasPSG', 'VirageAuteuil'],
      createdAt: Date.now() - 86400000
    },
    {
      id: 'match-live',
      name: 'Match Live',
      description: 'Commentaires en direct',
      emoji: '⚽',
      memberCount: 1523,
      isPrivate: false,
      hasVoiceChat: true,
      voiceParticipants: ['SophieRouge', 'JulienBleu'],
      createdBy: 'AdminFanVerse',
      admins: ['AdminFanVerse'],
      createdAt: Date.now() - 3600000
    },
    {
      id: 'predictions',
      name: 'Prédictions',
      description: 'Pronostics et analyses',
      emoji: '🎯',
      memberCount: 892,
      isPrivate: false,
      hasVoiceChat: false,
      voiceParticipants: [],
      createdBy: 'TacticPro',
      admins: ['TacticPro'],
      createdAt: Date.now() - 7200000
    },
    {
      id: 'marseille-fans',
      name: 'OM Supporters',
      description: 'Groupe pour les fans de l\'OM',
      emoji: '🔵',
      memberCount: 1456,
      isPrivate: false,
      hasVoiceChat: true,
      voiceParticipants: ['MarcelOM', 'VelodromeFan'],
      createdBy: 'OMForever',
      admins: ['OMForever'],
      createdAt: Date.now() - 14400000
    },
    {
      id: 'lyon-supporters',
      name: 'OL Family',
      description: 'Communauté des supporters lyonnais',
      emoji: '🦁',
      memberCount: 743,
      isPrivate: false,
      hasVoiceChat: true,
      voiceParticipants: ['LyonPride'],
      createdBy: 'GoneLyon',
      admins: ['GoneLyon'],
      createdAt: Date.now() - 21600000
    }
  ])

  // Utilisateurs FanVerse (tous les supporters)
  const fanVerseUsers = [
    'AlexPSG92', 'MarineFan', 'PierreUltra', 'SophieRouge', 'JulienBleu',
    'CamilleSupporter', 'ThomasVirage', 'LauraFidele', 'MaximeTribune', 'EmilyParis',
    'MarcelOM', 'VelodromeFan', 'OMForever', 'MarseilleUltra', 'PhocéenFan',
    'LyonPride', 'GoneLyon', 'RhôneFan', 'OLSupporter', 'LyonnaisFidele',
    'NantaisFan', 'CanariesSupporter', 'LensFan', 'RCLensUltra', 'SangEtOrFan'
  ]

  // Messages généraux FanVerse (tous les supporters français)
  const generalMessages = [
    'Salut la communauté FanVerse ! 👋',
    'Quel match incroyable ce soir ! ⚽',
    'La Ligue 1 est de plus en plus compétitive ! 🏆',
    'Vive le football français ! 🇫🇷',
    'Qui regarde le match ce soir ? 📺',
    'Quelle ambiance dans les stades ! 🏟️',
    'Les supporters français sont les meilleurs ! 🎉',
    'Allez l\'équipe de France ! 🇫🇷',
    'Le football unit tous les fans ! ⚽',
    'Respect à tous les supporters ! 🤝',
    'Vamos la Ligue 1 ! 🔥',
    'Quel talent dans notre championnat ! ⭐',
    'Fierté du football français ! 💪',
    'Supporters unis dans la passion ! ❤️',
    'Le spectacle est au rendez-vous ! 🎭'
  ]

  // Messages spécifiques par groupe
  const groupMessages = {
    'psg-hardcore': [
      'ALLEZ PARIS ! 🔴🔵',
      'ICI C\'EST PARIS ! 🗼',
      'Mbappé en feu ! ⚡',
      'Le Parc résonne ! 🎵',
      'Fier d\'être Parisien ! 👑'
    ],
    'match-live': [
      'BUUUUT ! Incroyable ! ⚽',
      'Quelle parade ! 🧤',
      'Corner dangereux ! 📐',
      'Changement tactique ! 🔄',
      'Temps additionnel ! ⏱️'
    ],
    'predictions': [
      'Je pense 4-3-3 ce soir 📊',
      'Défense à 3 possible 🛡️',
      'Milieu renforcé 💪',
      'Rotation attendue 🔄',
      'Tactique offensive ! ⚡'
    ],
    'marseille-fans': [
      'ALLEZ L\'OM ! 🔵⚪',
      'Droit au but ! ⚽',
      'Vélodrome en feu ! 🔥',
      'Marseille forever ! 💙',
      'Phocéens unis ! 🤝'
    ],
    'lyon-supporters': [
      'ALLEZ LYON ! 🦁',
      'Groupama Stadium ! 🏟️',
      'OL jusqu\'au bout ! 💪',
      'Fierté lyonnaise ! ❤️',
      'Rhône et Saône ! 🌊'
    ]
  }

  const emotions = ['😍', '🔥', '⚡', '💪', '❤️', '🎉', '😤', '🙌']

  useEffect(() => {
    const checkConnection = () => {
      setTimeout(() => {
        setIsConnected(true)
        setConnectionStatus('Connecté')
        
        // Message de bienvenue selon le type de chat
        const welcomeMessage: ChatMessage = {
          id: '0',
          user: 'FanVerse',
          message: currentChatType === 'general' 
            ? 'Bienvenue dans le chat général FanVerse ! Tous les supporters sont les bienvenus ! 🎉'
            : `Bienvenue dans le groupe ${chatGroups.find(g => g.id === currentGroup)?.name} ! 🎉`,
          timestamp: Date.now(),
          emotion: '🎉',
          fanPoints: 0,
          groupId: currentChatType === 'groups' ? currentGroup || undefined : undefined
        }
        setMessages([welcomeMessage])
      }, 1000)
    }

    const addFakeMessage = () => {
      if (!isConnected) return
      
      let randomUser: string
      let randomMessage: string
      let messagePool: string[]
      
      if (currentChatType === 'general') {
        randomUser = fanVerseUsers[Math.floor(Math.random() * fanVerseUsers.length)]
        messagePool = generalMessages
      } else if (currentGroup) {
        randomUser = fanVerseUsers[Math.floor(Math.random() * fanVerseUsers.length)]
        messagePool = groupMessages[currentGroup as keyof typeof groupMessages] || generalMessages
      } else {
        return
      }
      
      randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)]
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      const randomFanPoints = Math.floor(Math.random() * 50) + 10
      
      const newFakeMessage: ChatMessage = {
        id: Date.now().toString(),
        user: randomUser,
        message: randomMessage,
        timestamp: Date.now(),
        emotion: randomEmotion,
        fanPoints: randomFanPoints,
        groupId: currentChatType === 'groups' ? currentGroup || undefined : undefined
      }
      
      setMessages(prev => [...prev, newFakeMessage])
    }

    checkConnection()
    
    // Ajouter des messages automatiques toutes les 3-8 secondes
    const messageInterval = setInterval(() => {
      addFakeMessage()
    }, Math.random() * 5000 + 3000)

    return () => {
      clearInterval(messageInterval)
    }
  }, [isConnected, currentChatType, currentGroup])

  const handleSendMessage = () => {
    if (newMessage.trim() && isConnected) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: 'Vous',
        message: newMessage.trim(),
        timestamp: Date.now(),
        emotion: '💬',
        fanPoints: 5,
        groupId: currentChatType === 'groups' ? currentGroup || undefined : undefined
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const toggleVoiceChat = () => {
    setIsVoiceActive(!isVoiceActive)
    if (!isVoiceActive) {
      console.log('🎤 Connexion au chat vocal...')
    } else {
      console.log('🎤 Déconnexion du chat vocal...')
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    console.log(isMuted ? '🔊 Micro activé' : '🔇 Micro coupé')
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    console.log('🎙️ Enregistrement vocal commencé...')
    setTimeout(() => {
      setIsRecording(false)
      const voiceMessage: ChatMessage = {
        id: Date.now().toString(),
        user: 'Vous',
        message: 'Message vocal',
        timestamp: Date.now(),
        emotion: '🎙️',
        fanPoints: 10,
        groupId: currentChatType === 'groups' ? currentGroup || undefined : undefined,
        isVoiceMessage: true,
        voiceDuration: 3
      }
      setMessages(prev => [...prev, voiceMessage])
    }, 3000)
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }

  useEffect(() => {
    // Scroll seulement si l'utilisateur est proche du bas
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100
        if (isNearBottom) {
          scrollToBottom()
        }
      }
    }
  }, [messages])

  const currentGroupData = chatGroups.find(g => g.id === currentGroup)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-xl rounded-2xl border border-primary/20 p-6 flex flex-col"
      style={{ height: '600px' }}
    >
      {/* Header avec navigation */}
      <div className="bg-black/20 rounded-lg border border-primary/10 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex bg-black/30 rounded-lg p-1 border border-primary/20">
            <button
              onClick={() => {
                setCurrentChatType('general')
                setCurrentGroup(null)
                setMessages([])
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                currentChatType === 'general'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-white hover:bg-muted/20'
              }`}
            >
              <span>🌍</span>
              <span>Général</span>
            </button>
            <button
              onClick={() => {
                setCurrentChatType('groups')
                setCurrentGroup('psg-hardcore')
                setMessages([])
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                currentChatType === 'groups'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-white hover:bg-muted/20'
              }`}
            >
              <span>👥</span>
              <span>Groupes</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {connectionStatus}
              </span>
            </div>
          </div>
        </div>
        
        {/* Titre du chat actuel */}
        <div className="flex items-center space-x-3">
          {currentChatType === 'general' ? (
            <>
              <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-accent-comp/30 rounded-full flex items-center justify-center text-2xl border-2 border-primary/50">
                🌍
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Chat FanVerse</h3>
                <p className="text-sm text-muted-foreground flex items-center space-x-2">
                  <span>Tous les supporters français</span>
                  <span>•</span>
                  <span className="text-accent-comp font-medium">{fanVerseUsers.length} connectés</span>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-accent-comp/30 rounded-full flex items-center justify-center text-2xl border-2 border-primary/50">
                {currentGroupData?.emoji}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{currentGroupData?.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center space-x-2">
                  <span>{currentGroupData?.description}</span>
                  <span>•</span>
                  <span className="text-accent-comp font-medium">{currentGroupData?.memberCount} membres</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sélecteur de groupes */}
      {currentChatType === 'groups' && (
        <div className="mb-3">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20">
            {chatGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  setCurrentGroup(group.id)
                  setMessages([])
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                  currentGroup === group.id
                    ? 'bg-primary/20 border border-primary/30 text-primary'
                    : 'bg-muted/20 border border-muted/30 text-muted-foreground hover:bg-muted/30'
                }`}
              >
                <span>{group.emoji}</span>
                <span className="text-sm font-medium">{group.name}</span>
                {group.hasVoiceChat && group.voiceParticipants.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">{group.voiceParticipants.length}</span>
                  </div>
                )}
              </button>
            ))}
            <button
              onClick={() => setShowGroupModal(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-accent-comp/20 border border-accent-comp/30 text-accent-comp hover:bg-accent-comp/30 transition-all flex-shrink-0"
            >
              <span>➕</span>
              <span className="text-sm font-medium">Créer</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat vocal controls pour les groupes */}
      {currentChatType === 'groups' && currentGroupData?.hasVoiceChat && (
        <div className="bg-muted/10 rounded-lg p-2 mb-3 border border-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">🎧 Chat vocal</div>
              {currentGroupData.voiceParticipants.length > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">
                    {currentGroupData.voiceParticipants.length}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleVoiceChat}
                className={`p-1.5 rounded-md transition-all text-sm ${
                  isVoiceActive
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                }`}
              >
                🎧
              </button>
              {isVoiceActive && (
                <button
                  onClick={toggleMute}
                  className={`p-1.5 rounded-md transition-all text-sm ${
                    isMuted
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 bg-black/20 rounded-lg border border-primary/10">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-4xl mb-2">💬</div>
              <p>Aucun message pour le moment</p>
              <p className="text-xs mt-1">Soyez le premier à écrire !</p>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start space-x-3 ${
                  message.user === 'Vous' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                  message.user === 'Vous' 
                    ? 'bg-primary/30 border-2 border-primary/50' 
                    : 'bg-gradient-to-br from-primary/20 to-accent-comp/20 border border-primary/30'
                }`}>
                  {message.emotion}
                </div>
                <div className={`flex-1 min-w-0 ${message.user === 'Vous' ? 'text-right' : ''}`}>
                  <div className={`flex items-center space-x-2 mb-1 ${
                    message.user === 'Vous' ? 'justify-end' : ''
                  }`}>
                    <span className={`text-sm font-bold ${
                      message.user === 'Vous' ? 'text-primary' : 'text-white'
                    }`}>
                      {message.user}
                    </span>
                    {message.fanPoints && (
                      <span className="text-xs bg-accent-comp/20 text-accent-comp px-2 py-1 rounded-full">
                        +{message.fanPoints} FP
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  {message.isVoiceMessage ? (
                    <div className={`inline-flex items-center space-x-2 bg-primary/10 rounded-lg px-3 py-2 border border-primary/20 ${
                      message.user === 'Vous' ? 'bg-primary/20' : ''
                    }`}>
                      <div className="text-primary">🎙️</div>
                      <div className="flex-1">
                        <div className="text-sm text-white">Message vocal</div>
                        <div className="text-xs text-muted-foreground">
                          {message.voiceDuration}s
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary/80 transition-colors">
                        ▶️
                      </button>
                    </div>
                  ) : (
                    <div className={`inline-block max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.user === 'Vous'
                        ? 'bg-primary/20 text-white border border-primary/30'
                        : 'bg-muted/20 text-white border border-muted/30'
                    }`}>
                      <p className="text-sm break-words">{message.message}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input zone */}
      <div className="bg-black/20 rounded-lg border border-primary/10 p-3">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={`💬 ${currentChatType === 'general' ? 'Écrivez dans le chat général FanVerse' : `Écrivez dans ${currentGroupData?.name}`}...`}
              className="w-full bg-muted/30 border border-primary/20 rounded-lg px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-muted/40 transition-all"
              disabled={!isConnected}
              maxLength={500}
            />
            {newMessage.length > 400 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                {500 - newMessage.length}
              </div>
            )}
          </div>
          
          {currentChatType === 'groups' && currentGroupData?.hasVoiceChat && (
            <button
              onMouseDown={startVoiceRecording}
              disabled={!isConnected || isRecording}
              className={`p-3 rounded-lg transition-all flex items-center justify-center ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/30'
                  : 'bg-accent-comp/20 text-accent-comp hover:bg-accent-comp/30 border border-accent-comp/30'
              }`}
              title={isRecording ? 'Enregistrement en cours...' : 'Maintenir pour enregistrer'}
            >
              🎙️
            </button>
          )}
          
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !newMessage.trim()}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              newMessage.trim() && isConnected
                ? 'bg-primary hover:bg-primary/80 text-white shadow-lg hover:shadow-primary/25'
                : 'bg-muted/30 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <span>Envoyer</span>
            <span className="text-sm">↵</span>
          </button>
        </div>
        
        {/* Indicateurs de statut */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connecté' : 'Déconnecté'}</span>
            </div>
            {currentChatType === 'groups' && currentGroupData?.hasVoiceChat && (
              <div className="flex items-center space-x-1">
                <span>🎧</span>
                <span>{currentGroupData.voiceParticipants.length} en vocal</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>Appuyez sur Entrée pour envoyer</span>
          </div>
        </div>
      </div>

      {/* Modal création de groupe */}
      <CreateGroupModal 
        isOpen={showGroupModal} 
        onClose={() => setShowGroupModal(false)}
        onCreateGroup={(newGroup) => {
          setChatGroups(prev => [...prev, newGroup])
          setCurrentGroup(newGroup.id)
          setShowGroupModal(false)
        }}
      />
    </motion.div>
  )
}



// Composant Émotions corrigé
const EmotionPanel = ({ onNftGenerated }: { onNftGenerated: () => void }) => {
  const [emotions, setEmotions] = useState<EmotionData>({
    anger: 0,
    surprise: 0,
    joy: 0,
    hype: 0,
    fear: 0,
    sadness: 0,
    total: 0
  })
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [lastClickTime, setLastClickTime] = useState<{[key: string]: number}>({})
  const [isOnCooldown, setIsOnCooldown] = useState<{[key: string]: boolean}>({})
  const [nftGenerated, setNftGenerated] = useState(false)
  const [showNftModal, setShowNftModal] = useState(false)
  const [emotionBarProgress, setEmotionBarProgress] = useState(0)

  const emotionConfig = [
    { id: 'hype', name: 'HYPE', icon: '🔥', color: 'from-red-500 to-orange-500' },
    { id: 'joy', name: 'JOY', icon: '😂', color: 'from-yellow-500 to-orange-500' },
    { id: 'anger', name: 'ANGER', icon: '😡', color: 'from-red-700 to-red-900' },
    { id: 'surprise', name: 'SURPRISE', icon: '😮', color: 'from-blue-500 to-purple-500' },
    { id: 'fear', name: 'FEAR', icon: '😨', color: 'from-purple-600 to-indigo-700' },
    { id: 'sadness', name: 'SADNESS', icon: '😢', color: 'from-blue-600 to-indigo-800' }
  ]

  const CLICK_COOLDOWN = 3000 // 3 secondes de cooldown

  useEffect(() => {
    // Écouter les mises à jour d'émotions
    socketService.onEmotionUpdate((emotionData: any) => {
      console.log('😊 Mise à jour émotions:', emotionData)
      
      // Calculer le total
      const total = Object.values(emotionData).reduce((sum: number, count: any) => sum + (count || 0), 0)
      
      setEmotions({
        ...emotionData,
        total
      })
      
      // Calculer le pourcentage de progression basé sur l'émotion dominante
      const dominantEmotion = getDominantEmotion({ ...emotionData, total })
      const progress = dominantEmotion.percentage
      setEmotionBarProgress(progress)
      
      // Vérifier si on peut générer un NFT (100% de progression)
      if (progress >= 100 && !nftGenerated) {
        setNftGenerated(true)
        onNftGenerated()
        console.log('🎉 NFT généré ! La barre d\'émotions est pleine à 100%!')
      }
    })

    return () => {
      socketService.off('emotion_update')
    }
  }, [nftGenerated])
  
  const handleEmotionClick = (emotionId: string) => {
    const now = Date.now()
    const lastClick = lastClickTime[emotionId] || 0
    
    // Vérifier le cooldown
    if (now - lastClick < CLICK_COOLDOWN) {
      console.log(`⏰ Cooldown actif pour ${emotionId}. Attendez ${Math.ceil((CLICK_COOLDOWN - (now - lastClick)) / 1000)}s`)
      return
    }

    setSelectedEmotion(emotionId)
    setLastClickTime(prev => ({ ...prev, [emotionId]: now }))
    setIsOnCooldown(prev => ({ ...prev, [emotionId]: true }))
    
    socketService.sendEmotion(emotionId)
    
    // Animation feedback
    setTimeout(() => setSelectedEmotion(null), 1000)
    
    // Retirer le cooldown visuel après 3 secondes
    setTimeout(() => {
      setIsOnCooldown(prev => ({ ...prev, [emotionId]: false }))
    }, CLICK_COOLDOWN)
  }

  const getIntensityColor = (percentage: number) => {
    if (percentage > 80) return 'text-red-500'
    if (percentage > 60) return 'text-yellow-500'
    if (percentage > 40) return 'text-blue-500'
    return 'text-green-500'
  }

  // Calculer le pourcentage d'intensité basé sur l'émotion dominante
  const getDominantEmotion = (emotionData = emotions) => {
    if (emotionData.total === 0) return { emotion: 'hype', percentage: 0 }
    
    const emotionValues = [
      { emotion: 'hype', count: emotionData.hype },
      { emotion: 'joy', count: emotionData.joy },
      { emotion: 'anger', count: emotionData.anger },
      { emotion: 'surprise', count: emotionData.surprise },
      { emotion: 'fear', count: emotionData.fear },
      { emotion: 'sadness', count: emotionData.sadness }
    ]
    
    const dominant = emotionValues.reduce((max, current) => 
      current.count > max.count ? current : max
    )
    
    return {
      emotion: dominant.emotion,
      percentage: Math.round((dominant.count / emotionData.total) * 100)
    }
  }

  const dominantEmotion = getDominantEmotion()
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Émotions Collectives</h2>
        <div className="flex items-center space-x-4">
          <div className="text-accent-comp font-bold">{emotions.total} réactions</div>
          <div className="flex items-center space-x-2 text-green-400">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-bold">Live</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {emotionConfig.map((emotion) => {
          const count = emotions[emotion.id as keyof EmotionData] || 0
          const isSelected = selectedEmotion === emotion.id
          const onCooldown = isOnCooldown[emotion.id]
          
          return (
          <motion.button
            key={emotion.id}
            onClick={() => handleEmotionClick(emotion.id)}
              disabled={onCooldown}
              whileHover={!onCooldown ? { scale: 1.05 } : {}}
              whileTap={!onCooldown ? { scale: 0.95 } : {}}
              className={`relative p-4 rounded-xl transition-all duration-300 overflow-hidden ${
                isSelected ? 'scale-110 shadow-2xl' : 'hover:shadow-lg'
              } ${onCooldown ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            style={{
                background: `linear-gradient(135deg, ${emotion.color.replace('from-', '').replace(' to-', ', ')})`,
              }}
            >
              <div className="text-3xl mb-2">{emotion.icon}</div>
              <div className="text-white font-bold text-xs mb-1">{emotion.name}</div>
              <div className="text-white font-bold text-lg">{count}</div>
              
              {onCooldown && (
                <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                  <div className="text-white text-xs font-bold">Cooldown</div>
            </div>
              )}
            
              {isSelected && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </motion.button>
          )
        })}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold">Intensité Collective</span>
          <div className="flex items-center space-x-2">
            <span className={`font-bold text-xl ${getIntensityColor(dominantEmotion.percentage)}`}>
              {dominantEmotion.percentage}%
            </span>
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              dominantEmotion.percentage > 80 ? 'bg-red-500' :
              dominantEmotion.percentage > 60 ? 'bg-yellow-500' :
              dominantEmotion.percentage > 40 ? 'bg-blue-500' : 'bg-green-500'
            }`}></div>
          </div>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-4 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-primary via-accent-comp to-primary h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${dominantEmotion.percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Émotion dominante: <span className="text-white font-bold">{dominantEmotion.emotion.toUpperCase()}</span>
        </div>
      </div>
      
      {/* Barre de progression NFT */}
      <div className="space-y-3 border-t border-primary/20 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold">🎨 Progression NFT</span>
          <div className="flex items-center space-x-2">
            <span className="text-accent-comp font-bold">{emotionBarProgress.toFixed(0)}%</span>
            {nftGenerated && <span className="text-green-400 text-sm">✓ Généré!</span>}
          </div>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-3 rounded-full ${nftGenerated ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-primary to-accent-comp'}`}
            initial={{ width: 0 }}
            animate={{ width: `${emotionBarProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="text-center text-xs text-muted-foreground">
          {nftGenerated ? 'NFT généré avec succès!' : `${(100 - emotionBarProgress).toFixed(0)}% restants pour débloquer un NFT`}
        </div>
      </div>
    </div>
  )
}

// Composant Modal NFT
const NFTModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [nftData, setNftData] = useState({
    name: "PSG Match Emotion NFT",
    description: "NFT généré grâce à l'émotion collective des fans",
    image: "🏆⚽",
    rarity: "Rare",
    attributes: [
      { trait_type: "Match", value: "PSG vs OM" },
      { trait_type: "Date", value: new Date().toLocaleDateString() },
      { trait_type: "Emotion Level", value: "Maximum" },
      { trait_type: "Fans Count", value: "10,000+" }
    ]
  })

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gradient-to-br from-card via-card/95 to-card/90 border border-primary/30 rounded-2xl p-8 max-w-md w-full"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white">NFT Généré!</h2>
            <p className="text-muted-foreground">
              Félicitations! L'émotion collective a atteint son maximum et a généré un NFT unique.
            </p>
            
            <div className="bg-black/30 rounded-xl p-6 space-y-4">
              <div className="text-4xl">{nftData.image}</div>
              <h3 className="text-xl font-bold text-white">{nftData.name}</h3>
              <p className="text-sm text-muted-foreground">{nftData.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rareté:</span>
                  <span className="text-accent-comp font-bold">{nftData.rarity}</span>
                </div>
                {nftData.attributes.map((attr, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{attr.trait_type}:</span>
                    <span className="text-white">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Collecter NFT
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-muted hover:bg-muted/80 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Composant Marketplace PSG
const PSGMarketplace = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [userPSGTokens, setUserPSGTokens] = useState(250) // Simulation des tokens PSG

  const merchItems = [
    {
      id: 1,
      name: "Maillot PSG Domicile 2024",
      price: 150,
      image: "👕",
      description: "Maillot officiel PSG saison 2024",
      category: "Maillots",
      inStock: true,
      requiredTokens: 100
    },
    {
      id: 2,
      name: "Écharpe PSG Ultras",
      price: 50,
      image: "🧣",
      description: "Écharpe officielle des supporters",
      category: "Accessoires",
      inStock: true,
      requiredTokens: 25
    },
    {
      id: 3,
      name: "Casquette PSG Limited",
      price: 75,
      image: "🧢",
      description: "Casquette édition limitée",
      category: "Accessoires",
      inStock: false,
      requiredTokens: 40
    },
    {
      id: 4,
      name: "Ballon PSG Signature",
      price: 100,
      image: "⚽",
      description: "Ballon officiel avec signatures",
      category: "Collectibles",
      inStock: true,
      requiredTokens: 80
    }
  ]

  const canPurchase = (item: any) => {
    return userPSGTokens >= item.requiredTokens && item.inStock
  }

  const handlePurchase = (item: any) => {
    if (canPurchase(item)) {
      setUserPSGTokens(prev => prev - item.requiredTokens)
      alert(`Achat réussi ! ${item.name} acheté pour ${item.requiredTokens} PSG tokens`)
    }
  }

  return (
    <div className="hud-panel-enhanced p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">🛍️ Marketplace PSG</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Vos PSG Tokens:</span>
            <span className="text-accent-comp font-bold">{userPSGTokens}</span>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold">Boutique Officielle</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {merchItems.map((item) => (
          <motion.div
            key={item.id}
            className={`bg-black/30 rounded-xl p-4 border transition-all duration-300 ${
              canPurchase(item) ? 'border-primary/30 hover:border-primary/50' : 'border-muted/20'
            }`}
            whileHover={canPurchase(item) ? { scale: 1.02 } : {}}
          >
            <div className="text-center space-y-3">
              <div className="text-4xl">{item.image}</div>
              <h3 className="text-white font-bold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-accent-comp font-bold">{item.requiredTokens} PSG</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  item.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {item.inStock ? 'En stock' : 'Épuisé'}
                </span>
              </div>

              <button
                onClick={() => handlePurchase(item)}
                disabled={!canPurchase(item)}
                className={`w-full py-2 px-4 rounded-lg font-bold transition-colors ${
                  canPurchase(item)
                    ? 'bg-primary hover:bg-primary/80 text-white'
                    : 'bg-muted/30 text-muted-foreground cursor-not-allowed'
                }`}
              >
                {!item.inStock ? 'Épuisé' : 
                 userPSGTokens < item.requiredTokens ? 'Tokens insuffisants' : 'Acheter'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-primary">ℹ️</span>
          <span className="text-white font-bold">Comment obtenir des PSG Tokens ?</span>
        </div>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Participer aux émotions collectives</li>
          <li>• Parier sur les matchs</li>
          <li>• Être actif dans le chat</li>
          <li>• Générer des NFT</li>
        </ul>
      </div>
    </div>
  )
}

// Composant Stade 3D simplifié
const Stadium3D = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Stade 3D</h2>
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold">Live</span>
        </div>
      </div>
      
      <div className={`transition-all duration-500 ${isFullscreen ? 'h-[600px]' : 'h-96'}`}>
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-comp/20 rounded-lg border border-primary/30">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-6xl">🏟️</div>
              <div className="text-white font-bold text-2xl">Vue 3D du Stade</div>
              <div className="text-muted-foreground">Expérience immersive</div>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Maximize className="w-4 h-4" />
                  <span>{isFullscreen ? 'Réduire' : 'Plein écran'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
        <div className="text-white font-bold text-sm">Parc des Princes</div>
        <div className="text-muted-foreground text-xs">47,929 spectateurs</div>
        <div className="text-accent-comp text-xs">Ambiance: 🔥 Explosive</div>
      </div>
    </div>
  )
}



const WalletModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isMetaMaskDetected, setIsMetaMaskDetected] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ethereum = (window as any).ethereum
      setIsMetaMaskDetected(!!(ethereum && ethereum.isMetaMask))
    }
  }, [])

  const connectMetaMask = async () => {
    setIsConnecting(true)
    setErrorMessage('')
    
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask n\'est pas installé. Veuillez installer MetaMask depuis https://metamask.io')
      }

      const ethereum = (window as any).ethereum
      console.log('🦊 Ethereum object:', ethereum)
      console.log('🔍 isMetaMask:', ethereum.isMetaMask)
      
      if (!ethereum.isMetaMask) {
        console.warn('⚠️  MetaMask flag non détecté, tentative de connexion quand même...')
      }

      console.log('🔐 Demande d\'accès aux comptes MetaMask...')
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      console.log('📋 Comptes reçus:', accounts)
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Aucun compte MetaMask trouvé ou accès refusé')
      }

      setWalletAddress(accounts[0])
      console.log('✅ MetaMask connecté avec succès:', accounts[0])
      
      try {
        const chainId = await ethereum.request({ method: 'eth_chainId' })
        console.log('🔗 Réseau connecté:', chainId)
      } catch (chainError) {
        console.warn('⚠️  Impossible de récupérer le chainId:', chainError)
      }
      
    } catch (error: any) {
      console.error('❌ Erreur MetaMask détaillée:', {
        error,
        type: typeof error,
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      })
      
      let message = 'Erreur inconnue'
      
      if (error?.message) {
        message = error.message
      } else if (error?.toString && typeof error.toString === 'function') {
        const stringified = error.toString()
        if (stringified !== '[object Object]') {
          message = stringified
        }
      } else if (error?.code) {
        message = `Erreur code: ${error.code}`
      } else if (typeof error === 'string') {
        message = error
      } else if (Object.keys(error || {}).length === 0) {
        message = 'Erreur vide - MetaMask pourrait ne pas être installé ou accessible'
      }
      
      console.log('📝 Message d\'erreur extrait:', message)
      
      if (message.includes('User rejected') || message.includes('rejected')) {
        setErrorMessage('Connexion annulée par l\'utilisateur')
      } else if (message.includes('MetaMask n\'est pas installé') || message.includes('not installed')) {
        setErrorMessage('MetaMask n\'est pas installé')
      } else if (message.includes('Erreur vide')) {
        setErrorMessage('Impossible de se connecter à MetaMask. Vérifiez qu\'il est installé et déverrouillé.')
      } else {
        setErrorMessage(`Erreur: ${message}`)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const connectWalletConnect = () => {
    setErrorMessage('')
    alert('WalletConnect sera bientôt disponible')
  }

  const handleClose = () => {
    setErrorMessage('')
    onClose()
  }

  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-primary/20 p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Connecter Wallet</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={connectMetaMask}
            disabled={isConnecting || !isMetaMaskDetected}
            className={`w-full p-4 rounded-xl transition-all duration-300 flex items-center space-x-4 ${
              isMetaMaskDetected 
                ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-500/30 hover:border-orange-500/50' 
                : 'bg-gray-500/20 border border-gray-500/30 cursor-not-allowed'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isMetaMaskDetected ? 'bg-orange-500' : 'bg-gray-500'
            }`}>
              <span className="text-white font-bold">🦊</span>
            </div>
            <div className="text-left flex-1">
              <div className="text-white font-bold">MetaMask</div>
              <div className="text-sm text-muted-foreground">
                {isConnecting ? 'Connexion...' : 
                 isMetaMaskDetected ? 'Connecter avec MetaMask' : 'MetaMask non détecté'}
              </div>
            </div>
            {!isMetaMaskDetected && (
              <div className="text-red-400 text-sm">❌</div>
            )}
          </button>

          <button
            onClick={connectWalletConnect}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">🔗</span>
            </div>
            <div className="text-left">
              <div className="text-white font-bold">WalletConnect</div>
              <div className="text-sm text-muted-foreground">Connecter avec WalletConnect</div>
            </div>
          </button>
        </div>
        
        {/* Affichage des erreurs */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="text-red-400 font-bold text-sm mb-2">❌ Erreur</div>
            <div className="text-white text-sm">{errorMessage}</div>
            {errorMessage.includes('MetaMask n\'est pas installé') && (
              <a 
                href="https://metamask.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Installer MetaMask
              </a>
            )}
          </div>
        )}

        {/* Wallet connecté */}
        {walletAddress && (
          <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="text-green-400 font-bold text-sm mb-2">✅ Wallet connecté</div>
            <div className="text-white text-sm font-mono mb-2">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                className="text-blue-400 hover:text-blue-300 text-xs underline"
              >
                Copier l'adresse
              </button>
              <button
                onClick={() => {
                  setWalletAddress('')
                  setErrorMessage('')
                }}
                className="text-red-400 hover:text-red-300 text-xs underline"
              >
                Déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant principal
export default function TribunePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showNftModal, setShowNftModal] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationId: number
    const handleMouseMove = (e: MouseEvent) => {
      // Utiliser requestAnimationFrame pour optimiser les performances
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      
      animationId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`
        }
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        setIsConnecting(true)
        console.log('🔄 Tentative de connexion au backend...')
        
        // Attendre un peu pour s'assurer que le backend est prêt
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const userData = await socketService.connect('user_' + Date.now())
        setUser({
          id: userData.userId,
          name: userData.userId,
          chzBalance: userData.chzBalance,
          psgTokens: 250, // Solde initial PSG tokens
          isOnline: true
        })
        console.log('🎉 Connexion établie avec succès')
      } catch (error: any) {
        console.error('❌ Erreur de connexion détaillée:', {
          error,
          type: typeof error,
          message: error?.message,
          keys: Object.keys(error || {})
        })
        
        // Simuler un utilisateur par défaut en cas d'erreur
        setUser({
          id: 'user_demo',
          name: 'Fan Demo',
          chzBalance: 100,
          psgTokens: 150,
          isOnline: false
        })
        console.log('🔄 Utilisateur de démonstration créé')
      } finally {
        // S'assurer que le chargement se termine toujours
        setTimeout(() => {
          setIsConnecting(false)
        }, 500)
      }
    }

    initializeConnection()

    // Timeout de sécurité pour éviter un chargement infini
    const safetyTimeout = setTimeout(() => {
      console.log('⚠️ Timeout de sécurité - arrêt du chargement')
      setIsConnecting(false)
      if (!user) {
        setUser({
          id: 'user_timeout',
          name: 'Fan Timeout',
          chzBalance: 50,
          psgTokens: 75,
          isOnline: false
        })
      }
    }, 10000) // 10 secondes max

    return () => {
      clearTimeout(safetyTimeout)
      socketService.disconnect()
    }
  }, [])

  const handleBack = () => {
    router.push('/')
  }

  // Debug pour vérifier l'état
  console.log('🔍 État de connexion:', { isConnecting, user: user?.name })

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
        <Waves 
          lineColor="rgba(255, 99, 71, 0.3)"
          backgroundColor="transparent"
          waveSpeedX={0.008}
          waveSpeedY={0.003}
          waveAmpX={25}
          waveAmpY={12}
          xGap={15}
          yGap={25}
          friction={0.92}
          tension={0.008}
          maxCursorMove={80}
          style={{ zIndex: 1 }}
        />
        <motion.div 
          className="relative z-10 text-center space-y-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="text-8xl mb-6"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🔄
          </motion.div>
          <motion.div 
            className="text-white font-bold text-3xl bg-gradient-to-r from-white via-primary to-accent-comp bg-clip-text text-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Connexion en cours...
          </motion.div>
          <motion.div 
            className="text-muted-foreground text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Connexion au serveur FanVerse
          </motion.div>
          
          {/* Barre de progression animée */}
          <motion.div 
            className="w-64 h-2 bg-black/50 rounded-full overflow-hidden mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent-comp"
              animate={{ 
                x: ['-100%', '100%'],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: 'transparent' }}>
      <Waves 
        lineColor="rgba(255, 99, 71, 0.15)"
        backgroundColor="linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)"
        waveSpeedX={0.004}
        waveSpeedY={0.001}
        waveAmpX={20}
        waveAmpY={10}
        xGap={18}
        yGap={35}
        friction={0.94}
        tension={0.004}
        maxCursorMove={100}
        style={{ zIndex: -1 }}
      />
      
      {/* Curseur personnalisé lumineux optimisé */}
      <motion.div
        ref={cursorRef}
        className="fixed w-6 h-6 rounded-full bg-primary/30 backdrop-blur-sm border border-primary/50 pointer-events-none z-50"
        style={{
          left: 0,
          top: 0,
          willChange: 'transform'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10 flex-grow flex flex-col">
        <Header user={user} onBack={handleBack} onWalletClick={() => setShowWalletModal(true)} />
        
        <main className="flex-grow relative">
          {/* Éléments flottants décoratifs améliorés */}
          <motion.div
            className="absolute top-20 left-20 w-40 h-40 bg-gradient-conic from-primary/20 to-transparent rounded-full blur-2xl pointer-events-none"
            variants={floatingVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-conic from-accent-comp/20 to-transparent rounded-full blur-2xl pointer-events-none"
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 1, duration: 5 }}
          />
          
          {/* Particules flottantes */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full blur-sm pointer-events-none"
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/3 w-3 h-3 bg-accent-comp/40 rounded-full blur-sm pointer-events-none"
            animate={{
              y: [20, -20, 20],
              x: [10, -10, 10],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/50 rounded-full blur-sm pointer-events-none"
            animate={{
              y: [-15, 15, -15],
              x: [-5, 5, -5],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
            {/* Sidebar gauche - Interaction */}
            <motion.div 
              className="w-full lg:w-96 p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-y-auto"
              initial="hidden"
              animate="visible"
            >
              <motion.div custom={0} variants={panelVariants}>
                <BettingPanel user={user} onUserUpdate={setUser} />
              </motion.div>
              <motion.div custom={1} variants={panelVariants}>
                <ChatPanel />
              </motion.div>
            </motion.div>
            
            {/* Contenu principal - Visualisation */}
            <motion.div 
              className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6"
              initial="hidden"
              animate="visible"
            >
              <motion.div custom={2} variants={panelVariants}>
                <RealtimeStats />
              </motion.div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <motion.div custom={3} variants={panelVariants}>
                  <Stadium3D />
                </motion.div>
                <motion.div custom={4} variants={panelVariants}>
                  <PSGMarketplace />
                </motion.div>
              </div>
              <motion.div custom={5} variants={panelVariants}>
                <EmotionPanel onNftGenerated={() => setShowNftModal(true)} />
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
      
      {/* Modal Wallet */}
      <AnimatePresence>
        {showWalletModal && (
          <WalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
        )}
      </AnimatePresence>
      
      {/* Modal NFT */}
      <AnimatePresence>
        {showNftModal && (
          <NFTModal isOpen={showNftModal} onClose={() => setShowNftModal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
} 