"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  TrendingUp, 
  Coins, 
  Trophy,
  Heart,
  Zap,
  Target,
  Activity,
  Flame,
  Star
} from "lucide-react"

interface LiveStats {
  totalFans: number
  activeUsers: number
  totalBets: number
  totalVolume: number
  emotionLevel: number
  crowdVolume: number
  matchEvents: number
  nftMinted: number
}

interface LiveStatsChilizProps {
  stats: LiveStats
  className?: string
}

export function LiveStatsChiliz({ stats, className = "" }: LiveStatsChilizProps) {
  const statItems = [
    {
      icon: Users,
      label: "Fans Actifs",
      value: stats.activeUsers.toLocaleString('en-US'),
      color: "text-success",
      bgColor: "from-success/20 to-success/10",
      borderColor: "border-success/30",
      trend: "+12%"
    },
    {
      icon: TrendingUp,
      label: "Volume Total",
      value: `${Math.round(stats.totalVolume / 1000)}K`,
      suffix: "CHZ",
      color: "text-warning",
      bgColor: "from-warning/20 to-warning/10",
      borderColor: "border-warning/30",
      trend: "+8%"
    },
    {
      icon: Target,
      label: "Paris Actifs",
      value: stats.totalBets.toString(),
      color: "text-primary",
      bgColor: "from-primary/20 to-primary/10",
      borderColor: "border-primary/30",
      trend: "+24%"
    },
    {
      icon: Heart,
      label: "Émotions",
      value: `${stats.emotionLevel}%`,
      color: "text-emotion-hype",
      bgColor: "from-emotion-hype/20 to-emotion-hype/10",
      borderColor: "border-emotion-hype/30",
      trend: "+15%"
    },
    {
      icon: Activity,
      label: "Ambiance",
      value: `${stats.crowdVolume}%`,
      color: "text-emotion-joy",
      bgColor: "from-emotion-joy/20 to-emotion-joy/10",
      borderColor: "border-emotion-joy/30",
      trend: "+6%"
    },
    {
      icon: Star,
      label: "NFT Créés",
      value: stats.nftMinted.toString(),
      color: "text-barcelona-gold",
      bgColor: "from-barcelona-gold/20 to-barcelona-gold/10",
      borderColor: "border-barcelona-gold/30",
      trend: "+45%"
    }
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <Flame className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold bg-gradient-main bg-clip-text text-transparent">
          Statistiques Live
        </h2>
        <Badge className="bg-success/20 text-success border-success/30 animate-pulse">
          LIVE
        </Badge>
      </motion.div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`
              card-chiliz bg-gradient-to-br ${item.bgColor} border ${item.borderColor} 
              hover:shadow-glow transition-all duration-300 cursor-pointer
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl bg-gradient-dark/50 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-text-secondary">{item.label}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xl font-bold ${item.color}`}>
                      {item.value}
                    </span>
                    {item.suffix && (
                      <span className="text-xs text-text-secondary">{item.suffix}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tendance */}
              <div className="text-right">
                <Badge className="bg-success/20 text-success border-success/30 text-xs">
                  {item.trend}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistiques détaillées */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-chiliz bg-gradient-to-r from-accent/20 to-secondary/20 border-accent/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-warning" />
            <span>Parc des Princes</span>
          </h3>
          <Badge className="bg-psg-blue/20 text-psg-blue border-psg-blue/30">
            Capacité: 47,929
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round((stats.totalFans / 47929) * 100)}%
            </div>
            <div className="text-xs text-text-secondary">Occupation</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {stats.matchEvents}
            </div>
            <div className="text-xs text-text-secondary">Événements</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              2-1
            </div>
            <div className="text-xs text-text-secondary">Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-emotion-hype">
              67'
            </div>
            <div className="text-xs text-text-secondary">Temps</div>
          </div>
        </div>
      </motion.div>

      {/* Graphique d'activité simplifié */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="card-chiliz"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Activité des 10 dernières minutes</span>
          </h3>
        </div>
        
        <div className="flex items-end space-x-2 h-20">
          {Array.from({ length: 10 }).map((_, i) => {
            const height = Math.random() * 100
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-gradient-to-t from-primary to-warning rounded-t-lg min-h-[8px]"
              />
            )
          })}
        </div>
      </motion.div>
    </div>
  )
} 