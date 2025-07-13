"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, MessageSquare, Heart, Zap, Trophy } from 'lucide-react'

interface RealtimeStatsProps {
  className?: string
}

export default function RealtimeStats({ className = '' }: RealtimeStatsProps) {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalMessages: 0,
    totalBets: 0,
    totalEmotions: 0,
    totalVolume: 0,
    engagement: 0
  })

  useEffect(() => {
    // Simuler des données en temps réel
    const updateStats = () => {
      setStats(prev => ({
        activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 6 - 2)),
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 3),
        totalBets: prev.totalBets + Math.floor(Math.random() * 2),
        totalEmotions: prev.totalEmotions + Math.floor(Math.random() * 5),
        totalVolume: prev.totalVolume + Math.floor(Math.random() * 50),
        engagement: Math.min(100, Math.max(0, prev.engagement + (Math.random() - 0.5) * 5))
      }))
    }

    // Initialiser avec des valeurs de base
    setStats({
      activeUsers: 127,
      totalMessages: 1543,
      totalBets: 89,
      totalEmotions: 2156,
      totalVolume: 12450,
      engagement: 78
    })

    const interval = setInterval(updateStats, 3000)
    return () => clearInterval(interval)
  }, [])

  const statsConfig = [
    {
      id: 'users',
      label: 'Utilisateurs actifs',
      value: stats.activeUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      prefix: '',
      suffix: ''
    },
    {
      id: 'messages',
      label: 'Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      prefix: '',
      suffix: ''
    },
    {
      id: 'bets',
      label: 'Paris actifs',
      value: stats.totalBets,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      prefix: '',
      suffix: ''
    },
    {
      id: 'emotions',
      label: 'Réactions',
      value: stats.totalEmotions,
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      prefix: '',
      suffix: ''
    },
    {
      id: 'volume',
      label: 'Volume CHZ',
      value: stats.totalVolume,
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      prefix: '',
      suffix: ' CHZ'
    },
    {
      id: 'engagement',
      label: 'Engagement',
      value: Math.round(stats.engagement),
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      prefix: '',
      suffix: '%'
    }
  ]

  return (
    <div className={`bg-black/50 backdrop-blur-md border border-primary/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">Statistiques Live</h3>
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-lg opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-4 h-4 text-white/70" />
                <motion.div
                  className="text-xs text-green-400 font-bold"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  LIVE
                </motion.div>
              </div>
              <div className="space-y-1">
                <motion.div
                  className="text-xl font-bold text-white"
                  key={stat.value}
                  initial={{ scale: 1.2, color: '#ff6347' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                </motion.div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre d'engagement globale */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white font-medium">Engagement Global</span>
          <span className="text-sm text-primary font-bold">{Math.round(stats.engagement)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent-comp rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.engagement}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
} 