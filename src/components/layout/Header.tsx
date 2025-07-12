import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles,
  Users,
  TrendingUp,
  Coins,
  Heart,
  Wifi,
  WifiOff,
  Menu,
  Bell,
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface HeaderProps {
  isConnected: boolean
  onConnectWallet: () => void
  userTokens: number
  emotionLevel: number
  liveStats: {
    totalFans: number
    activeUsers: number
    totalBets: number
    totalVolume: number
  }
  onMenuToggle?: () => void
}

export function Header({ 
  isConnected, 
  onConnectWallet, 
  userTokens, 
  emotionLevel, 
  liveStats,
  onMenuToggle 
}: HeaderProps) {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-50 p-3 md:p-4 backdrop-blur-xl bg-gradient-to-r from-black/80 to-gray-900/80 border-b border-primary/20"
    >
      <div className="flex items-center justify-between">
        {/* Logo et Navigation Mobile */}
        <div className="flex items-center space-x-3">
          {/* Menu Mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-primary/10"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <motion.div 
            className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-primary to-warning rounded-xl flex items-center justify-center shadow-chiliz hover-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-white" />
          </motion.div>
        </div>

        {/* Stats et Actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Stats Live - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <motion.div 
              className="bg-black/40 border border-success/30 rounded-lg px-2 py-1 hover-scale"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-success" />
                <span className="text-xs font-bold text-success">
                  {formatNumber(liveStats.activeUsers)}
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-black/40 border border-warning/30 rounded-lg px-2 py-1 hover-scale"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-warning" />
                <span className="text-xs font-bold text-warning">
                  {Math.round(liveStats.totalVolume / 1000)}K
                </span>
              </div>
            </motion.div>
          </div>

          {/* Tokens utilisateur */}
          <motion.div 
            className="bg-gradient-to-r from-warning/20 to-primary/20 border border-warning/30 rounded-lg px-2 md:px-3 py-1 hover-scale"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-warning" />
              <span className="font-bold text-warning text-sm">
                {formatNumber(userTokens)}
              </span>
            </div>
          </motion.div>

          {/* Statut émotionnel - Desktop */}
          <motion.div 
            className="hidden md:flex bg-gradient-to-r from-emotion-hype/20 to-emotion-joy/20 border border-emotion-hype/30 rounded-lg px-3 py-1 hover-scale"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-emotion-hype" />
              <div className="w-10 md:w-12 h-1.5 bg-accent rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emotion-hype to-emotion-joy"
                  initial={{ width: 0 }}
                  animate={{ width: `${emotionLevel}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex p-1.5 hover:bg-primary/10 relative"
          >
            <Bell className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* Connexion Web3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onConnectWallet}
              className={`relative overflow-hidden ${isConnected 
                ? 'bg-gradient-to-r from-success to-success/80 shadow-lg' 
                : 'bg-gradient-to-r from-primary to-warning hover:shadow-chiliz'
              } border-0 px-3 md:px-4 py-1.5 md:py-2 font-semibold transition-all duration-300 text-sm`}
            >
              <div className="flex items-center space-x-2 relative z-10">
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="hidden md:inline">
                  {isConnected ? 'Connecté' : 'Wallet'}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats Mobile */}
      <div className="md:hidden mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-success" />
            <span className="text-xs font-bold text-success">
              {formatNumber(liveStats.activeUsers)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-warning" />
            <span className="text-xs font-bold text-warning">
              {Math.round(liveStats.totalVolume / 1000)}K
            </span>
          </div>
        </div>

        {/* Émotions Mobile */}
        <div className="flex items-center space-x-2">
          <Heart className="w-3 h-3 text-emotion-hype" />
          <div className="w-10 h-1.5 bg-accent rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emotion-hype to-emotion-joy"
              initial={{ width: 0 }}
              animate={{ width: `${emotionLevel}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}