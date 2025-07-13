"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserProvider, ethers } from 'ethers'
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
import dynamic from "next/dynamic"
import io from "socket.io-client"

// Remplace cet import direct :
// import StadeViewer3D from "../components/fanverse/chiliz/StadeViewer3D"

// Par cet import dynamique :
const StadeViewer3D = dynamic(
  () => import("../components/fanverse/chiliz/StadeViewer3D"),
  { ssr: false }
)

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

const Header = ({ matchData, user, friendsOnline }: { 
  matchData: MatchData
  user: User
  friendsOnline: number 
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
              <p className="text-sm text-accent-comp">Live Tribune</p>
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
              <div className="text-xs text-muted-foreground">{friendsOnline} friends online</div>
              <div className="text-xs text-yellow-400 font-bold">{user.fanPoints} FP</div>
            </div>
          </div>
          
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
            2.4 CHZ
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
          { label: 'Matches', value: '47', icon: Trophy, color: 'text-yellow-400' },
          { label: 'Winnings', value: '€1,247', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Accuracy', value: '85%', icon: Star, color: 'text-accent-comp' }
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
        Join Voice Chat
      </button>

      {/* Group Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-2 bg-black/30 rounded-lg border border-primary/20">
          <div className="text-lg font-bold text-white">2.8K</div>
          <div className="text-xs text-muted-foreground">Members</div>
        </div>
        <div className="p-2 bg-black/30 rounded-lg border border-primary/20">
          <div className="text-lg font-bold text-accent-comp">12</div>
          <div className="text-xs text-muted-foreground">Matches</div>
        </div>
      </div>
    </div>
  )
}

const EMOTION_BET_ADDRESS = "0xA21a8923d128bf0CA1DdeD6E1350853389a13fAc"
const EMOTION_BET_ABI = [
  "function placeBet(string description) payable"
]

const BettingCard = ({ bet, wallet }: { bet: BettingCard, wallet: WalletState }) => {
  const [timeLeft, setTimeLeft] = useState(bet.timeLeft)
  const [isPlacing, setIsPlacing] = useState(false)

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

  // ✅ Correction : transaction CHZ via MetaMask sur le contrat EmotionBet
  const handlePlaceBet = async () => {
    if (!wallet.isConnected || !wallet.signer) {
      alert("Veuillez connecter votre wallet MetaMask.")
      return
    }
    setIsPlacing(true)
    try {
      const contract = new ethers.Contract(EMOTION_BET_ADDRESS, EMOTION_BET_ABI, wallet.signer)
      // Prend le montant en CHZ (ex: "0.1 CHZ" => "0.1")
      const amountChz = bet.amount.split(" ")[0]
      const value = ethers.parseEther(amountChz)
      const description = `${bet.title} - ${bet.description}`
      const tx = await contract.placeBet(description, { value })
      await tx.wait()
      alert("✅ Pari envoyé sur la blockchain Chiliz !")
    } catch (error: any) {
      if (error.code === 4001) {
        alert("Transaction annulée par l'utilisateur")
      } else if (error.reason?.includes("Pari ferme")) {
        alert("Les paris sont fermés pour ce contrat.")
      } else {
        alert("Erreur lors du pari: " + (error?.message || error))
      }
    }
    setIsPlacing(false)
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
          onClick={handlePlaceBet}
          disabled={!wallet.isConnected || isPlacing || timeLeft === 0}
          whileHover={wallet.isConnected && !isPlacing ? { scale: 1.05 } : {}}
          whileTap={wallet.isConnected && !isPlacing ? { scale: 0.95 } : {}}
          className="px-4 py-2 bg-gradient-to-r from-primary to-accent-comp hover:from-primary/80 hover:to-accent-comp/80 text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
        >
          {isPlacing ? "⏳ Transaction..." : `Parier ${bet.amount.replace('ETH', 'CHZ')}`}
        </motion.button>
      </div>
    </div>
  )
}

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string
  isConnecting: boolean
  provider: any | null
  signer: any | null
}

// Déclaration de l'interface Window pour TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}

const WalletPanel = ({ wallet, connectWallet }: { wallet: WalletState, connectWallet: () => void }) => {
  const [selectedAmount, setSelectedAmount] = useState('0.1')
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'win', amount: '+0.25 CHZ', time: '2min ago' },
    { id: '2', type: 'bet', amount: '-0.1 CHZ', time: '5min ago' },
    { id: '3', type: 'reward', amount: '+0.05 CHZ', time: '1h ago' }
  ])
  // ✅ Ajout état pour NFTs
  const [nfts, setNfts] = useState<any[]>([])
  const [showNFTs, setShowNFTs] = useState(false)
  const [loadingNFTs, setLoadingNFTs] = useState(false)

  // Adresse et ABI du contrat AttendanceNFT
  const ATTENDANCE_NFT_ADDRESS = "0x98d2Ab4D5235CE1f53Ed2A1e1B2F0E7d003E7517"
  const ATTENDANCE_NFT_ABI = [
    "function getUserNFTs(address user) view returns (uint256[])",
    "function getNFTMetadata(uint256 tokenId) view returns (tuple(string eventName, string eventDate, string eventType, string rarity, string imageUrl, uint32 attendanceCount, uint64 timestamp))"
  ]

  // ✅ Fonction pour charger les NFTs du wallet connecté
  const loadNFTs = async () => {
    if (!wallet.isConnected || !wallet.address || !wallet.provider) {
      alert("Connectez votre wallet pour voir vos NFTs")
      return
    }
    setLoadingNFTs(true)
    try {
      const contract = new ethers.Contract(ATTENDANCE_NFT_ADDRESS, ATTENDANCE_NFT_ABI, wallet.provider)
      const tokenIds: string[] = await contract.getUserNFTs(wallet.address)
      const nftsData = await Promise.all(
        tokenIds.map(async (id: string) => {
          const meta = await contract.getNFTMetadata(id)
          return {
            id: id.toString(),
            ...meta
          }
        })
      )
      setNfts(nftsData)
      setShowNFTs(true)
    } catch (e) {
      alert("Erreur lors du chargement des NFTs")
    }
    setLoadingNFTs(false)
  }

  return (
    <div className="hud-panel-enhanced p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Wallet</h3>
        <div className="flex items-center space-x-2">
          {wallet.isConnected ? (
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold">Connecté</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-400">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-bold">Déconnecté</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {wallet.isConnected ? (
          <>
            <div className="p-3 bg-black/30 rounded-lg border border-primary/20">
              <div className="text-sm text-muted-foreground">Adresse</div>
              <div className="text-white font-mono">
                {wallet.address ? `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}` : ''}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{wallet.balance} CHZ</div>
              <div className="text-lg text-accent-comp">Chiliz Testnet</div>
              <div className="text-sm text-green-400">Blockchain connected</div>
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
                  {amount} CHZ
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recent transactions</span>
                <span className="text-accent-comp font-bold">See all</span>
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
              <span className="text-muted-foreground">Active bets</span>
              <span className="text-accent-comp font-bold">3 ongoing</span>
            </div>

            {/* ✅ Bouton voir mes NFTs */}
            <button
              onClick={loadNFTs}
              className="w-full py-2 mt-2 bg-gradient-to-r from-primary to-accent-comp text-white rounded-lg font-bold transition-all duration-300 shadow-lg"
            >
              🎫 View my NFTs
            </button>

            {/* ✅ Affichage minimaliste des NFTs */}
            {showNFTs && (
              <div className="mt-4 p-3 bg-black/40 rounded-lg border border-primary/20 max-h-64 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-accent-comp font-bold">My Attendance NFTs</span>
                  <button className="text-xs text-red-400" onClick={() => setShowNFTs(false)}>Close</button>
                </div>
                {loadingNFTs ? (
                  <div className="text-muted-foreground text-sm">Loading...</div>
                ) : nfts.length === 0 ? (
                  <div className="text-muted-foreground text-sm">No NFT found</div>
                ) : (
                  <ul className="space-y-2">
                    {nfts.map((nft) => (
                      <li key={nft.id} className="p-2 rounded bg-black/30 border border-primary/10">
                        <div className="text-white font-bold">{nft.eventName} <span className="text-xs text-muted-foreground">({nft.eventType})</span></div>
                        <div className="text-xs text-muted-foreground">{nft.eventDate} • {nft.rarity}</div>
                        <div className="text-xs text-muted-foreground">Participants: {nft.attendanceCount?.toString?.()}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-muted-foreground mb-1">Wallet not connected</div>
            <div className="text-sm text-muted-foreground mb-4">
              Connect your MetaMask to access blockchain features
            </div>
            {/* ✅ NOUVEAU BOUTON DE CONNEXION */}
            <motion.button
              onClick={connectWallet}
              disabled={wallet.isConnecting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-gradient-to-r from-primary to-accent-comp hover:from-primary/80 hover:to-accent-comp/80 text-white rounded-lg font-bold transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {wallet.isConnecting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🦊</span>
                  <span>Connecter MetaMask</span>
                </div>
              )}
            </motion.button>
            <div className="text-xs text-muted-foreground">
              You will be automatically redirected to the Chiliz Testnet
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Stadium3D = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }
  
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
      
      <div className={`transition-all duration-500 ${
        isFullscreen ? 'h-[600px]' : 'h-96'
      }`}>
        <StadeViewer3D
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </div>
      
      {/* Stadium Info Overlay */}
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
        <div className="text-white font-bold text-sm">Parc des Princes</div>
        <div className="text-muted-foreground text-xs">47,929 spectateurs</div>
        <div className="text-accent-comp text-xs">Ambiance: 🔥 Explosive</div>
      </div>
    </div>
  )
}

const EmotionPanel = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [emotionCounts, setEmotionCounts] = useState({
    hype: 234,
    love: 189,
    shock: 156,
    rage: 78
  })
  const [reactionRate, setReactionRate] = useState(15)
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)

  // Calcul du total
  const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0)

  // Pourcentage par émotion
  const emotionPercentages = Object.entries(emotionCounts).map(([id, count]) => ({
    id,
    percent: total > 0 ? (count / total) * 100 : 0
  }))

  // Calcul de l'intensité collective (par exemple, somme des pourcentages, max 100)
  const collectiveMeter = Math.round(
    emotionPercentages.reduce((sum, e) => sum + e.percent, 0)
  )

  // Couleurs par émotion
  const emotionColors = {
    hype: 'from-red-500 to-orange-500',
    love: 'from-blue-500 to-purple-500',
    shock: 'from-yellow-500 to-orange-500',
    rage: 'from-red-700 to-red-900'
  }

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

  const canClick = () => {
    if (!cooldownUntil) return true
    return Date.now() > cooldownUntil
  }

  const handleEmotionClick = (emotionId: string) => {
    if (!canClick()) {
      alert("Vous devez attendre 5 minutes avant de réagir à nouveau.")
      return
    }
    setSelectedEmotion(emotionId)
    setEmotionCounts(prev => ({
      ...prev,
      [emotionId]: prev[emotionId as keyof typeof prev] + 1
    }))
    setCooldownUntil(Date.now() + 300000) // 5 minutes global cooldown
    setTimeout(() => setSelectedEmotion(null), 1000)
  }
  
  return (
    <div className="hud-panel-enhanced p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Collective Emotions</h2>
        <div className="flex items-center space-x-4">
          <div className="text-accent-comp font-bold">
            {Object.values(emotionCounts).reduce((a, b) => a + b, 0)} reactions
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
            disabled={!canClick()}
            whileHover={canClick() ? { scale: 1.05 } : {}}
            whileTap={canClick() ? { scale: 0.95 } : {}}
            className={`relative p-6 rounded-xl transition-all duration-300 overflow-hidden group ${
              selectedEmotion === emotion.id ? 'scale-110 shadow-2xl' : 'hover:shadow-lg'
            } ${!canClick() ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            {!canClick() && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold rounded-xl text-xs">
                Cooldown 5 min
              </div>
            )}
            {selectedEmotion === emotion.id && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
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
          <span className="text-white font-bold">Collective Intensity</span>
          <div className="flex items-center space-x-2">
            <span className="text-accent-comp font-bold text-xl">{collectiveMeter}%</span>
            <div className={`w-3 h-3 rounded-full ${
              collectiveMeter > 80 ? 'bg-red-500' :
              collectiveMeter > 60 ? 'bg-yellow-500' :
              collectiveMeter > 40 ? 'bg-blue-500' : 'bg-green-500'
            } animate-pulse`}></div>
          </div>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-4 overflow-hidden flex">
          {emotionPercentages.map(({ id, percent }) => (
            <div
              key={id}
              className={`h-4 bg-gradient-to-r ${emotionColors[id as keyof typeof emotionColors]}`}
              style={{
                width: `${percent}%`,
                transition: 'width 1s'
              }}
              title={`${id} : ${Math.round(percent)}%`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs font-bold">
          {emotionPercentages.map(({ id, percent }) => (
            percent > 0 && (
              <span key={id} className="flex items-center space-x-1">
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-1`}
                  style={{
                    background: `linear-gradient(90deg, var(--tw-gradient-stops))`,
                    ['--tw-gradient-from' as any]: emotionColors[id as keyof typeof emotionColors].split(' ')[0].replace('from-', ''),
                    ['--tw-gradient-to' as any]: emotionColors[id as keyof typeof emotionColors].split(' ')[1].replace('to-', ''),
                  }}
                ></span>
                <span>{id.toUpperCase()} {Math.round(percent)}%</span>
              </span>
            )
          ))}
        </div>
      </div>

      {/* Emotion History */}
      <div className="space-y-2">
        <h3 className="text-white font-bold text-sm">Latest Reactions</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent-comp rounded-full flex items-center justify-center text-sm"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0]
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
        <h3 className="text-white font-bold text-lg">Live Chat</h3>
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
            <span>Someone is typing...</span>
          </motion.div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
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

  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '0.0000',
    isConnecting: false,
    provider: null,
    signer: null,
  })

  // Fonction de connexion MetaMask (à passer au WalletPanel)
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask n\'est pas installé. Veuillez l\'installer pour continuer.')
      return
    }
    setWallet(prev => ({ ...prev, isConnecting: true }))
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x15b32' }]
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x15b32',
              chainName: 'Chiliz Spicy Testnet',
              nativeCurrency: { name: 'Chiliz', symbol: 'CHZ', decimals: 18 },
              rpcUrls: ['https://spicy-rpc.chiliz.com/'],
              blockExplorerUrls: ['https://testnet.chiliscan.com/']
            }]
          })
        }
      }
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()



      const address = await signer.getAddress()
      const balance = await provider.getBalance(address)
      setWallet({
        isConnected: true,
        address,
        balance: ethers.formatEther(balance),
        isConnecting: false,
        provider,
        signer,
           })
    } catch (error: any) {
     
      setWallet(prev => ({ ...prev, isConnecting: false }))
      if (error.code === 4001) {
        alert('Connexion refusée par l\'utilisateur')
      } else {
        alert(`Erreur de connexion: ${error.message}`)
      }
    }
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
      />
      
           
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-96 p-6 space-y-6 overflow-y-auto">
          <UserProfile user={user} />
          <GroupCard />
          {bettingCards.map((bet) => (
            <BettingCard key={bet.id} bet={bet} wallet={wallet} />
          ))}
          <WalletPanel wallet={wallet} connectWallet={connectWallet} />
          <ChatFeed />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          <Stadium3D />
          <EmotionPanel />
          <SpecialEmotionBet wallet={wallet} />
        </div>
      </div>
    </div>
  )
}

const SpecialEmotionBet = ({ wallet }: { wallet: WalletState }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>("0.1")
  const [isPlacing, setIsPlacing] = useState(false)
  const emotions = [
    { id: 'hype', label: 'HYPE', icon: '🔥' },
    { id: 'love', label: 'LOVE', icon: '💙' },
    { id: 'shock', label: 'SHOCK', icon: '😱' },
    { id: 'rage', label: 'RAGE', icon: '😤' }
  ]

  const handlePlaceBet = async () => {
    if (!wallet.isConnected || !wallet.signer) {
      alert("Please connect your MetaMask wallet.")
      return
    }
    if (!selectedEmotion) {
      alert("Select an emotion to bet on.")
      return
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Enter a valid amount in CHZ.")
      return
    }
    setIsPlacing(true)
    try {
      const contract = new ethers.Contract(EMOTION_BET_ADDRESS, EMOTION_BET_ABI, wallet.signer)
      const value = ethers.parseEther(amount)
      const description = `Special Bet on emotion: ${selectedEmotion}`
      const tx = await contract.placeBet(description, { value })
      await tx.wait()
      alert(`✅ Bet "${selectedEmotion}" of ${amount} CHZ sent to the blockchain!`)
      setAmount("0.1")
      setSelectedEmotion(null)
    } catch (error: any) {
      if (error.code === 4001) {
        alert("Transaction cancelled by user.")
      } else if (error.reason?.includes("Pari ferme")) {
        alert("Bets are closed for this contract.")
      } else {
        alert("Error while betting: " + (error?.message || error))
      }
    }
    setIsPlacing(false)
  }

  return (
    <div className="hud-panel-enhanced p-6 mt-6 space-y-4">
      <h3 className="text-xl font-bold text-accent-comp mb-2">Special bets, Bet on an emotion</h3>
      <div className="flex flex-wrap gap-3">
        {emotions.map((emo) => (
          <button
            key={emo.id}
            onClick={() => setSelectedEmotion(emo.id)}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all duration-200
              ${selectedEmotion === emo.id
                ? 'bg-gradient-to-r from-primary to-accent-comp text-white shadow-lg'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
            disabled={isPlacing}
          >
            <span className="text-2xl">{emo.icon}</span>
            {emo.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="px-3 py-2 rounded-lg border border-primary/30 bg-black/30 text-white w-32"
          placeholder="Amount (CHZ)"
          disabled={isPlacing}
        />
        <button
          onClick={handlePlaceBet}
          disabled={!selectedEmotion || isPlacing}
          className="px-6 py-2 bg-gradient-to-r from-primary to-accent-comp text-white rounded-lg font-bold transition-all duration-300 shadow-lg disabled:opacity-50"
        >
          {isPlacing ? "⏳ Processing..." : "Place Bet"}
        </button>
      </div>
    </div>
  )
}