"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Wallet, 
  Camera, 
  MessageSquare, 
  Timer, 
  Trophy,
  Zap,
  Heart,
  Eye,
  Flame,
  Frown,
  Volume2,
  Settings,
  Maximize,
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  TrendingUp,
  Star,
  Shield,
  Gamepad2,
  Bell,
  Gift,
  Target,
  Coins,
  Activity,
  Headphones,
  Sparkles,
  Rocket,
  Crown,
  Medal,
  Wifi,
  Signal,
  Battery,
  Clock,
  Calendar,
  MapPin,
  Thermometer,
  Wind,
  Sun,
  CloudRain,
  Moon,
  Lightbulb,
  Volume,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Music,
  Radio,
  Tv,
  MonitorPlay,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Gamepad,
  Joystick,
  Mouse,
  Keyboard,
  Headset
} from "lucide-react"
import { useRouter } from "next/navigation"

// Types
interface User {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  level: number
  xp: number
  achievements: Achievement[]
  fanPoints: number
  streak: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
}

interface BettingCard {
  id: string
  title: string
  description: string
  timeLeft: number
  odds: string
  amount: string
  category: 'live' | 'upcoming' | 'special'
  popularity: number
  winChance: number
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: number
  emotion?: 'hype' | 'love' | 'shock' | 'rage'
  avatar?: string
  isVip?: boolean
  fanPoints?: number
}

interface MatchData {
  teamA: { name: string; logo: string; score: number; color: string; possession: number }
  teamB: { name: string; logo: string; score: number; color: string; possession: number }
  time: string
  isLive: boolean
  stadium: string
  temperature: string
  weather: string
  attendance: number
  phase: 'first-half' | 'half-time' | 'second-half' | 'extra-time' | 'penalties'
}

interface Notification {
  id: string
  type: 'goal' | 'card' | 'bet_won' | 'achievement' | 'friend_online' | 'match_start'
  title: string
  message: string
  timestamp: number
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

interface MiniGame {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  reward: number
  isActive: boolean
}

interface FloatingParticle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
}

// Enhanced Components
const NotificationCenter = ({ notifications, onMarkAsRead }: { 
  notifications: Notification[]
  onMarkAsRead: (id: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent-comp/10 hover:from-primary/20 hover:to-accent-comp/20 transition-all duration-300 border border-primary/20 hover:border-primary/40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-primary" />
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto hud-panel-enhanced p-4 space-y-3 z-50"
          >
            <h3 className="text-white font-bold text-lg mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucune notification</p>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    notification.read 
                      ? 'bg-black/20 border-muted/20' 
                      : 'bg-primary/10 border-primary/30'
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.priority === 'high' ? 'bg-red-500' :
                      notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {notification.type === 'goal' && '⚽'}
                      {notification.type === 'card' && '🟨'}
                      {notification.type === 'bet_won' && '💰'}
                      {notification.type === 'achievement' && '🏆'}
                      {notification.type === 'friend_online' && '👥'}
                      {notification.type === 'match_start' && '🚀'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm">{notification.title}</h4>
                      <p className="text-muted-foreground text-xs mt-1">{notification.message}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const AchievementSystem = ({ user }: { user: User }) => {
  const [showAchievements, setShowAchievements] = useState(false)
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600'
      case 'rare': return 'from-blue-500 to-blue-600'
      case 'epic': return 'from-purple-500 to-purple-600'
      case 'legendary': return 'from-yellow-500 to-yellow-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowAchievements(!showAchievements)}
        className="flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 hover:from-yellow-500/20 hover:to-yellow-600/20 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span className="text-yellow-500 font-bold">{user.achievements.length}</span>
      </motion.button>

      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto hud-panel-enhanced p-4 space-y-3 z-50"
          >
            <h3 className="text-white font-bold text-lg mb-4">Achievements</h3>
            <div className="grid grid-cols-1 gap-3">
              {user.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} border border-white/20`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm">{achievement.name}</h4>
                      <p className="text-white/80 text-xs">{achievement.description}</p>
                      <p className="text-white/60 text-xs mt-1 capitalize">{achievement.rarity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MiniGamesPanel = ({ games, onPlayGame }: { 
  games: MiniGame[]
  onPlayGame: (gameId: string) => void 
}) => {
  const [showGames, setShowGames] = useState(false)

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowGames(!showGames)}
        className="flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Gamepad2 className="w-5 h-5 text-purple-500" />
        <span className="text-purple-500 font-bold">Mini-Jeux</span>
      </motion.button>

      <AnimatePresence>
        {showGames && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto hud-panel-enhanced p-4 space-y-3 z-50"
          >
            <h3 className="text-white font-bold text-lg mb-4">Mini-Jeux</h3>
            <div className="space-y-3">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-black/30 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{game.icon}</div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{game.name}</h4>
                        <p className="text-muted-foreground text-xs">{game.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            game.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                            game.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {game.difficulty}
                          </span>
                          <span className="text-accent-comp text-xs font-bold">
                            +{game.reward} FP
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => onPlayGame(game.id)}
                      disabled={!game.isActive}
                      className={`px-3 py-1 rounded-lg text-sm font-bold transition-all duration-200 ${
                        game.isActive
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                          : 'bg-muted/30 text-muted-foreground cursor-not-allowed'
                      }`}
                      whileHover={game.isActive ? { scale: 1.05 } : {}}
                      whileTap={game.isActive ? { scale: 0.95 } : {}}
                    >
                      {game.isActive ? 'Jouer' : 'Bientôt'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Header = ({ matchData, user, friendsOnline, notifications, onMarkAsRead }: { 
  matchData: MatchData
  user: User
  friendsOnline: number 
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}) => {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [formattedAttendance, setFormattedAttendance] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
      setCurrentDate(now.toLocaleDateString())
    }
    
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setFormattedAttendance(matchData.attendance.toLocaleString())
  }, [matchData.attendance])

  const mockGames: MiniGame[] = [
    {
      id: '1',
      name: 'Prédiction Express',
      description: 'Prédis le prochain événement',
      icon: '🎯',
      difficulty: 'easy',
      reward: 50,
      isActive: true
    },
    {
      id: '2',
      name: 'Quiz Tactique',
      description: 'Teste tes connaissances',
      icon: '🧠',
      difficulty: 'medium',
      reward: 100,
      isActive: true
    },
    {
      id: '3',
      name: 'Penalty Shootout',
      description: 'Marque des buts virtuels',
      icon: '⚽',
      difficulty: 'hard',
      reward: 200,
      isActive: false
    }
  ]

  const handlePlayGame = (gameId: string) => {
    console.log('Playing game:', gameId)
    // Logique de mini-jeu
  }
  
  return (
    <header className="bg-black/80 backdrop-blur-xl border-b border-primary/20 px-6 py-4 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent-comp/5"></div>
      
      <div className="relative flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.push('/')}
            className="group p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent-comp/10 hover:from-primary/20 hover:to-accent-comp/20 transition-all duration-300 border border-primary/20 hover:border-primary/40"
          >
            <ArrowLeft className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-comp rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">FV</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FanVerse</h1>
              <p className="text-sm text-accent-comp">Tribune Live</p>
            </div>
          </div>
        </div>

        {/* Enhanced Match Info */}
        <div className="flex items-center space-x-8">
          <div className="hud-panel-enhanced p-6 flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">{matchData.teamA.name}</div>
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 shadow-lg`} style={{ backgroundColor: matchData.teamA.color }}></div>
              <div className="text-lg font-bold text-white">{matchData.teamA.score}</div>
              <div className="text-xs text-accent-comp">{matchData.teamA.possession}%</div>
            </div>
            
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-white mb-2">
                {matchData.teamA.score} - {matchData.teamB.score}
              </div>
              <div className="flex items-center justify-center space-x-2 text-accent-comp">
                {matchData.isLive && (
                  <motion.div 
                    className="w-3 h-3 bg-red-500 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <span className="font-mono text-lg">{matchData.time}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{matchData.stadium}</div>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground mt-1">
                <Thermometer className="w-3 h-3" />
                <span>{matchData.temperature}</span>
                <span>•</span>
                <span>{formattedAttendance} spectateurs</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">{matchData.teamB.name}</div>
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 shadow-lg`} style={{ backgroundColor: matchData.teamB.color }}></div>
              <div className="text-lg font-bold text-white">{matchData.teamB.score}</div>
              <div className="text-xs text-accent-comp">{matchData.teamB.possession}%</div>
            </div>
          </div>
        </div>

        {/* Enhanced User Info & Controls */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center space-x-2 text-green-400">
            <Wifi className="w-4 h-4" />
            <Signal className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </div>

          {/* Time */}
          <div className="text-center">
            <div className="text-white font-mono text-sm">
              {currentTime}
            </div>
            <div className="text-muted-foreground text-xs">
              {currentDate}
            </div>
          </div>

          {/* Mini Games */}
          <MiniGamesPanel games={mockGames} onPlayGame={handlePlayGame} />

          {/* Achievements */}
          <AchievementSystem user={user} />

          {/* Notifications */}
          <NotificationCenter notifications={notifications} onMarkAsRead={onMarkAsRead} />

          {/* User Profile */}
          <div className="hud-panel-enhanced p-4 flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent-comp rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{user.name[0]}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black"></div>
              {user.streak > 0 && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Flame className="w-3 h-3 text-black" />
                </div>
              )}
            </div>
            <div>
              <div className="text-white font-bold">{user.name}</div>
              <div className="text-sm text-accent-comp">Level {user.level}</div>
              <div className="text-xs text-muted-foreground">{friendsOnline} amis en ligne</div>
              <div className="text-xs text-yellow-400 font-bold">{user.fanPoints} FP</div>
            </div>
          </div>
          
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
            2.4 ETH
          </button>
        </div>
      </div>
    </header>
  )
}

const UserProfile = ({ user }: { user: User }) => {
  const xpPercentage = (user.xp % 1000) / 10
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-comp rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">{user.name[0]}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border-2 border-black">
            <span className="text-black font-bold text-sm">{user.level}</span>
          </div>
          {user.streak > 0 && (
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-black">
              <Flame className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl">{user.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-accent-comp">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>En ligne</span>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{user.fanPoints}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-bold">{user.streak}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">XP</span>
              <span className="text-accent-comp font-bold">{user.xp}/1000</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 mt-1">
              <motion.div
                className="bg-gradient-to-r from-primary to-accent-comp h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Matchs', value: '47', icon: Trophy, color: 'text-yellow-400' },
          { label: 'Gains', value: '€1,247', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Précision', value: '85%', icon: Star, color: 'text-accent-comp' }
        ].map((stat, index) => (
          <motion.div 
            key={index} 
            className="text-center p-3 bg-black/30 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center space-x-2 p-2 bg-gradient-to-r from-primary/20 to-accent-comp/20 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300"
        >
          <Gift className="w-4 h-4 text-primary" />
          <span className="text-primary font-bold text-sm">Récompenses</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center space-x-2 p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
        >
          <Settings className="w-4 h-4 text-purple-500" />
          <span className="text-purple-500 font-bold text-sm">Paramètres</span>
        </motion.button>
      </div>
    </div>
  )
}

const GroupCard = () => {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isListening, setIsListening] = useState(false)
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">PSG Ultras</h3>
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>47 en ligne</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-xs text-primary font-bold">VIP</span>
        </div>
      </div>
      
      <div className="flex -space-x-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="w-10 h-10 bg-gradient-to-br from-primary to-accent-comp rounded-full border-2 border-black shadow-lg relative"
            whileHover={{ scale: 1.1, zIndex: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
          </motion.div>
        ))}
        <div className="w-10 h-10 bg-muted/50 rounded-full border-2 border-black flex items-center justify-center">
          <span className="text-xs text-muted-foreground font-bold">+41</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-lg font-medium transition-all duration-300 ${
            isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4 mx-auto" /> : <Mic className="w-4 h-4 mx-auto" />}
        </button>
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-lg font-medium transition-all duration-300 ${
            !isVideoOn ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-accent-comp/20 text-accent-comp border border-accent-comp/30'
          }`}
        >
          {isVideoOn ? <Video className="w-4 h-4 mx-auto" /> : <VideoOff className="w-4 h-4 mx-auto" />}
        </button>
        <button
          onClick={() => setIsListening(!isListening)}
          className={`p-3 rounded-lg font-medium transition-all duration-300 ${
            isListening ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-muted/20 text-muted-foreground border border-muted/30'
          }`}
        >
          {isListening ? <Headphones className="w-4 h-4 mx-auto" /> : <VolumeX className="w-4 h-4 mx-auto" />}
        </button>
        <button className="p-3 rounded-lg font-medium transition-all duration-300 bg-purple-500/20 text-purple-400 border border-purple-500/30">
          <Music className="w-4 h-4 mx-auto" />
        </button>
      </div>
      
      <button className="w-full py-3 bg-gradient-to-r from-primary to-accent-comp hover:from-primary/80 hover:to-accent-comp/80 text-white rounded-lg font-bold transition-all duration-300 shadow-lg">
        Rejoindre le Chat Vocal
      </button>

      {/* Group Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-2 bg-black/30 rounded-lg border border-primary/20">
          <div className="text-lg font-bold text-white">2.8K</div>
          <div className="text-xs text-muted-foreground">Membres</div>
        </div>
        <div className="p-2 bg-black/30 rounded-lg border border-primary/20">
          <div className="text-lg font-bold text-accent-comp">12</div>
          <div className="text-xs text-muted-foreground">Matchs</div>
        </div>
      </div>
    </div>
  )
}

const BettingCard = ({ bet }: { bet: BettingCard }) => {
  const [timeLeft, setTimeLeft] = useState(bet.timeLeft)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'live': return 'from-red-500 to-red-600'
      case 'upcoming': return 'from-primary to-accent-comp'
      case 'special': return 'from-yellow-500 to-yellow-600'
      default: return 'from-primary to-accent-comp'
    }
  }
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-4 group">
      <div className="flex items-center justify-between">
        <div>
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(bet.category)} mb-2`}>
            {bet.category.toUpperCase()}
          </div>
          <h3 className="text-white font-bold">{bet.title}</h3>
        </div>
        <div className="flex items-center space-x-2 text-primary">
          <Timer className="w-4 h-4" />
          <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm">{bet.description}</p>
      
      {/* Betting Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-2 bg-black/30 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground">Popularité</div>
          <div className="text-lg font-bold text-accent-comp">{bet.popularity}%</div>
        </div>
        <div className="text-center p-2 bg-black/30 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground">Chance</div>
          <div className="text-lg font-bold text-green-400">{bet.winChance}%</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-green-400">{bet.odds}</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-primary to-accent-comp hover:from-primary/80 hover:to-accent-comp/80 text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
        >
          Parier {bet.amount}
        </motion.button>
      </div>
    </div>
  )
}

const WalletPanel = () => {
  const [selectedAmount, setSelectedAmount] = useState('0.1')
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'win', amount: '+0.25 ETH', time: '2min ago' },
    { id: '2', type: 'bet', amount: '-0.1 ETH', time: '5min ago' },
    { id: '3', type: 'reward', amount: '+0.05 ETH', time: '1h ago' }
  ])
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Portefeuille</h3>
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold">Connecté</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-black/30 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground">Adresse</div>
          <div className="text-white font-mono">0x742d...5678</div>
        </div>
        
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1">2.4 ETH</div>
          <div className="text-lg text-accent-comp">$4,320 USD</div>
          <div className="text-sm text-green-400">+2.3% (24h)</div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {['0.1', '0.5', '1.0'].map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`p-3 rounded-lg font-bold transition-all duration-300 ${
                selectedAmount === amount
                  ? 'bg-gradient-to-r from-primary to-accent-comp text-white shadow-lg'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {amount} ETH
            </button>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Transactions récentes</span>
            <span className="text-accent-comp font-bold">Voir tout</span>
          </div>
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  tx.type === 'win' ? 'bg-green-500' : 
                  tx.type === 'bet' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <span className="text-white text-sm">{tx.amount}</span>
              </div>
              <span className="text-muted-foreground text-xs">{tx.time}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Paris actifs</span>
          <span className="text-accent-comp font-bold">3 en cours</span>
        </div>
      </div>
    </div>
  )
}

const Stadium3D = () => {
  const [activeCamera, setActiveCamera] = useState('drone')
  const [isVRMode, setIsVRMode] = useState(false)
  const [weather, setWeather] = useState('sunny')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Fixed player positions to avoid hydration mismatch
  const playerPositions = [
    // Team A (red)
    { x: 15, y: 45 }, { x: 25, y: 30 }, { x: 25, y: 60 }, { x: 35, y: 25 },
    { x: 35, y: 55 }, { x: 45, y: 40 }, { x: 55, y: 30 }, { x: 55, y: 60 },
    { x: 65, y: 35 }, { x: 75, y: 45 }, { x: 85, y: 50 },
    // Team B (blue)
    { x: 20, y: 50 }, { x: 30, y: 35 }, { x: 30, y: 65 }, { x: 40, y: 30 },
    { x: 40, y: 60 }, { x: 50, y: 45 }, { x: 60, y: 35 }, { x: 60, y: 65 },
    { x: 70, y: 40 }, { x: 80, y: 50 }, { x: 90, y: 45 }
  ]
  
  const cameraViews = [
    { id: 'drone', name: 'Drone', icon: Camera, color: 'from-blue-500 to-blue-600' },
    { id: 'ground', name: 'Terrain', icon: Eye, color: 'from-green-500 to-green-600' },
    { id: 'tactical', name: 'Tactique', icon: Zap, color: 'from-purple-500 to-purple-600' },
    { id: 'corner', name: 'Corner', icon: Trophy, color: 'from-yellow-500 to-yellow-600' }
  ]
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Stade 3D Immersif</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-accent-comp" />
            <span className="text-accent-comp font-bold">Mode Gaming</span>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold">Live</span>
          </div>
        </div>
      </div>
      
      <div className={`relative bg-gradient-to-b from-sky-900 via-sky-700 to-green-600 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${
        isFullscreen ? 'h-[600px]' : 'h-96'
      }`}>
        {/* Enhanced Stadium Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20"></div>
        
        {/* Weather Effects */}
        {weather === 'rainy' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-8 bg-blue-200/30"
                style={{
                  left: `${(i * 2) % 100}%`,
                  top: `${(i * 3) % 100}%`
                }}
                animate={{
                  y: [0, 100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
        
        {/* Stadium Structure */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-b-xl">
          {/* Enhanced Pitch */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80 h-48 bg-gradient-to-br from-green-500 to-green-600 rounded-lg border-2 border-white/30 shadow-2xl">
            {/* Pitch markings */}
            <div className="absolute inset-2 border border-white/20 rounded"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/30 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-0.5 h-full bg-white/20"></div>
            
            {/* Enhanced Players with fixed positions */}
            {playerPositions.map((pos, i) => (
              <motion.div
                key={i}
                className={`absolute w-3 h-3 rounded-full shadow-lg ${
                  i < 11 ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`
                }}
                animate={{
                  x: [0, 5, -5, 0],
                  y: [0, -5, 5, 0]
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Ball */}
            <motion.div
              className="absolute w-2 h-2 bg-white rounded-full shadow-lg"
              style={{ left: '45%', top: '40%' }}
              animate={{
                x: [0, 20, -10, 0],
                y: [0, -15, 10, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          
          {/* Enhanced Stands */}
          <div className="absolute top-4 left-4 right-4 h-24 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-xl">
            {/* Crowd animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-white/10 to-blue-500/20 rounded-lg"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
        
        {/* Enhanced Floodlights */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 bg-yellow-400 rounded-full shadow-lg"
            style={{
              left: `${15 + i * 14}%`,
              top: `${5 + Math.sin(i) * 3}%`
            }}
            animate={{
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}
        
        {/* Enhanced User Orbs with fixed positions */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-br from-primary to-accent-comp rounded-full shadow-lg"
            style={{
              left: `${10 + i * 7}%`,
              top: `${15 + (i % 3) * 8}%`
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Enhanced Camera Controls */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {cameraViews.map((view) => (
            <motion.button
              key={view.id}
              onClick={() => setActiveCamera(view.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                activeCamera === view.id
                  ? `bg-gradient-to-r ${view.color} text-white shadow-lg`
                  : 'bg-black/50 text-gray-300 hover:bg-black/70'
              }`}
            >
              <view.icon className="w-4 h-4 inline mr-2" />
              {view.name}
            </motion.button>
          ))}
        </div>
        
        {/* Control Panel */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <motion.button
            onClick={() => setIsFullscreen(!isFullscreen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
          >
            <Maximize className="w-4 h-4 inline mr-2" />
            {isFullscreen ? 'Réduire' : 'Plein écran'}
          </motion.button>
          
          <motion.button
            onClick={() => setIsVRMode(!isVRMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
          >
            <Maximize className="w-4 h-4 inline mr-2" />
            {isVRMode ? 'Quitter VR' : 'Mode VR'}
          </motion.button>
        </div>
        
        {/* Weather Controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {[
            { id: 'sunny', label: '☀️ Ensoleillé', color: 'from-yellow-500 to-yellow-600' },
            { id: 'rainy', label: '🌧️ Pluvieux', color: 'from-gray-500 to-gray-600' },
            { id: 'night', label: '🌙 Nuit', color: 'from-indigo-600 to-indigo-700' }
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => setWeather(w.id)}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                weather === w.id
                  ? `bg-gradient-to-r ${w.color} text-white shadow-lg`
                  : 'bg-black/50 text-gray-300 hover:bg-black/70'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Stadium Info Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
          <div className="text-white font-bold text-sm">Parc des Princes</div>
          <div className="text-muted-foreground text-xs">47,929 spectateurs</div>
          <div className="text-accent-comp text-xs">Ambiance: 🔥 Explosive</div>
        </div>
      </div>
    </div>
  )
}

const EmotionPanel = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [collectiveMeter, setCollectiveMeter] = useState(65)
  const [emotionCounts, setEmotionCounts] = useState({
    hype: 234,
    love: 189,
    shock: 156,
    rage: 78
  })
  const [reactionRate, setReactionRate] = useState(15)
  
  const emotions = [
    { 
      id: 'hype', 
      name: 'HYPE', 
      icon: '🔥', 
      color: 'from-red-500 to-orange-500',
      description: 'Excitement maximum!',
      sound: 'hype.mp3'
    },
    { 
      id: 'love', 
      name: 'LOVE', 
      icon: '💙', 
      color: 'from-blue-500 to-purple-500',
      description: 'Pure passion',
      sound: 'love.mp3'
    },
    { 
      id: 'shock', 
      name: 'SHOCK', 
      icon: '😱', 
      color: 'from-yellow-500 to-orange-500',
      description: 'Incroyable!',
      sound: 'shock.mp3'
    },
    { 
      id: 'rage', 
      name: 'RAGE', 
      icon: '😤', 
      color: 'from-red-700 to-red-900',
      description: 'Frustration intense',
      sound: 'rage.mp3'
    }
  ]

  // Update reaction rate periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setReactionRate(10 + Math.floor(Math.random() * 20))
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  
  const handleEmotionClick = (emotionId: string) => {
    setSelectedEmotion(emotionId)
    setEmotionCounts(prev => ({
      ...prev,
      [emotionId]: prev[emotionId as keyof typeof prev] + 1
    }))
    
    // Play sound effect (mock)
    console.log(`Playing sound for ${emotionId}`)
    
    // Reset after animation
    setTimeout(() => setSelectedEmotion(null), 1000)
  }
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Émotions Collectives</h2>
        <div className="flex items-center space-x-4">
          <div className="text-accent-comp font-bold">
            {Object.values(emotionCounts).reduce((a, b) => a + b, 0)} réactions
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-bold">+{reactionRate}/min</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {emotions.map((emotion) => (
          <motion.button
            key={emotion.id}
            onClick={() => handleEmotionClick(emotion.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-6 rounded-xl transition-all duration-300 overflow-hidden group ${
              selectedEmotion === emotion.id ? 'scale-110 shadow-2xl' : 'hover:shadow-lg'
            }`}
            style={{
              background: `linear-gradient(135deg, ${emotion.color.replace('from-', '').replace('to-', ', ')})`,
            }}
          >
            <div className="text-4xl mb-2">{emotion.icon}</div>
            <div className="text-white font-bold text-sm mb-1">{emotion.name}</div>
            <div className="text-white/80 text-xs mb-2">{emotion.description}</div>
            <div className="text-white font-bold text-lg">
              {emotionCounts[emotion.id as keyof typeof emotionCounts]}
            </div>
            
            {/* Pulse effect when selected */}
            {selectedEmotion === emotion.id && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}

            {/* Sound wave effect */}
            <motion.div
              className="absolute inset-0 border-2 border-white/30 rounded-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (emotion.id.length % 4) * 0.5
              }}
            />
          </motion.button>
        ))}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white font-bold">Intensité Collective</span>
          <div className="flex items-center space-x-2">
            <span className="text-accent-comp font-bold text-xl">{collectiveMeter}%</span>
            <div className={`w-3 h-3 rounded-full ${
              collectiveMeter > 80 ? 'bg-red-500' :
              collectiveMeter > 60 ? 'bg-yellow-500' :
              collectiveMeter > 40 ? 'bg-blue-500' : 'bg-green-500'
            } animate-pulse`}></div>
          </div>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-4 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-primary via-accent-comp to-primary h-4 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${collectiveMeter}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          L'émotion collective influence le match en temps réel
        </div>
      </div>

      {/* Emotion History */}
      <div className="space-y-2">
        <h3 className="text-white font-bold text-sm">Dernières Réactions</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent-comp rounded-full flex items-center justify-center text-sm"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1
              }}
            >
              {emotions[i % emotions.length].icon}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ChatFeed = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      user: 'Alex', 
      message: 'GOOOOOL! Mbappé est incroyable! 🔥', 
      timestamp: Date.now(), 
      emotion: 'hype',
      avatar: 'A',
      isVip: true,
      fanPoints: 250
    },
    { 
      id: '2', 
      user: 'Sarah', 
      message: 'Mon cœur ne peut pas supporter ça 💙', 
      timestamp: Date.now(), 
      emotion: 'love',
      avatar: 'S',
      fanPoints: 180
    },
    { 
      id: '3', 
      user: 'Mike', 
      message: 'Vous avez vu cet arrêt?! 😱', 
      timestamp: Date.now(), 
      emotion: 'shock',
      avatar: 'M',
      fanPoints: 320
    },
    { 
      id: '4', 
      user: 'Emma', 
      message: 'L\'arbitre est aveugle! 😤', 
      timestamp: Date.now(), 
      emotion: 'rage',
      avatar: 'E',
      fanPoints: 150
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: 'Vous',
        message: newMessage,
        timestamp: Date.now(),
        avatar: 'V',
        fanPoints: 500
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage.length > 0) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [newMessage])
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Chat Live</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-accent-comp">
            <div className="w-2 h-2 bg-accent-comp rounded-full animate-pulse"></div>
            <span className="text-sm font-bold">{messages.length} messages</span>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <Users className="w-4 h-4" />
            <span className="text-sm font-bold">47 en ligne</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start space-x-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-comp rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">{msg.avatar || msg.user[0]}</span>
                </div>
                {msg.isVip && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-2 h-2 text-black" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold text-sm">{msg.user}</span>
                  <span className="text-muted-foreground text-xs">maintenant</span>
                  {msg.emotion && (
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                      {msg.emotion}
                    </span>
                  )}
                  {msg.fanPoints && (
                    <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                      {msg.fanPoints} FP
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mt-1 break-words">{msg.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-muted-foreground text-sm"
          >
            <div className="flex space-x-1">
              <motion.div
                className="w-1 h-1 bg-muted-foreground rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-1 h-1 bg-muted-foreground rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-1 h-1 bg-muted-foreground rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span>Quelqu'un tape...</span>
          </motion.div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Tapez votre message..."
          className="flex-1 px-4 py-2 bg-black/50 border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
        />
        <motion.button
          onClick={handleSendMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-primary to-accent-comp hover:from-primary/80 hover:to-accent-comp/80 text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Quick Reactions */}
      <div className="flex space-x-2">
        {['🔥', '💙', '😱', '😤'].map((emoji, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-muted/30 hover:bg-muted/50 rounded-full flex items-center justify-center transition-all duration-200"
            onClick={() => {
              const quickMessage = {
                id: Date.now().toString(),
                user: 'Vous',
                message: emoji,
                timestamp: Date.now(),
                avatar: 'V'
              }
              setMessages(prev => [...prev, quickMessage])
            }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

const FloatingParticles = () => {
  const [particles, setParticles] = useState<FloatingParticle[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Generate fixed particles only on client
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10
    }))
    setParticles(generatedParticles)
  }, [])

  if (!isClient) return null

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/30 rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.x > 50 ? 25 : -25, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay
          }}
        />
      ))}
    </>
  )
}

export default function TribunePage() {
  const [matchData] = useState<MatchData>({
    teamA: { name: 'PSG', logo: '', score: 2, color: '#FF0000', possession: 58 },
    teamB: { name: 'Barcelona', logo: '', score: 1, color: '#0066CC', possession: 42 },
    time: '67:23',
    isLive: true,
    stadium: 'Parc des Princes',
    temperature: '18°C',
    weather: 'sunny',
    attendance: 47929,
    phase: 'second-half'
  })
  
  const [user] = useState<User>({
    id: '1',
    name: 'Alex',
    avatar: '',
    isOnline: true,
    level: 12,
    xp: 750,
    achievements: [
      { id: '1', name: 'Premier But', description: 'Première prédiction réussie', icon: '⚽', rarity: 'common' },
      { id: '2', name: 'Maître Tacticien', description: '10 prédictions tactiques correctes', icon: '🧠', rarity: 'rare' },
      { id: '3', name: 'Légende Vivante', description: '100 matchs suivis', icon: '👑', rarity: 'legendary' }
    ],
    fanPoints: 2450,
    streak: 7
  })
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'goal',
      title: 'GOOOOOL!',
      message: 'Mbappé marque pour le PSG! +50 FP',
      timestamp: Date.now(),
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'bet_won',
      title: 'Pari Gagné!',
      message: 'Votre pari sur le premier but a été gagné! +0.25 ETH',
      timestamp: Date.now() - 300000,
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Nouveau Achievement!',
      message: 'Vous avez débloqué "Maître Tacticien"',
      timestamp: Date.now() - 600000,
      read: true,
      priority: 'medium'
    }
  ])
  
  const [bettingCards] = useState<BettingCard[]>([
    {
      id: '1',
      title: 'Premier But',
      description: 'Mbappé vs Messi',
      timeLeft: 154,
      odds: '2.5x',
      amount: '0.1 ETH',
      category: 'live',
      popularity: 78,
      winChance: 65
    },
    {
      id: '2',
      title: 'Score Final',
      description: 'Prédiction complète',
      timeLeft: 2712,
      odds: '3.2x',
      amount: '0.5 ETH',
      category: 'upcoming',
      popularity: 45,
      winChance: 32
    },
    {
      id: '3',
      title: 'Carton Rouge',
      description: 'Match spécial',
      timeLeft: 890,
      odds: '5.8x',
      amount: '0.2 ETH',
      category: 'special',
      popularity: 23,
      winChance: 18
    }
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Enhanced Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent-comp/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,99,71,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,255,0.1),transparent)] pointer-events-none"></div>
      
      {/* Floating particles */}
      <FloatingParticles />
      
      <Header 
        matchData={matchData} 
        user={user} 
        friendsOnline={12} 
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />
      
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-96 p-6 space-y-6 overflow-y-auto">
          <UserProfile user={user} />
          <GroupCard />
          {bettingCards.map((bet) => (
            <BettingCard key={bet.id} bet={bet} />
          ))}
          <WalletPanel />
          <ChatFeed />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          <Stadium3D />
          <EmotionPanel />
        </div>
      </div>
    </div>
  )
} 