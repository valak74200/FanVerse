"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  Zap, 
  Shield, 
  Trophy, 
  Star,
  Activity,
  BarChart3,
  Globe,
  Wallet,
  Settings,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react'

interface DashboardProps {
  onClose: () => void
}

interface StatCard {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
  color: string
  description: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }),
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: [0, 0.5, 0],
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function Dashboard({ onClose }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [liveData, setLiveData] = useState({
    users: 12547,
    volume: 2.8,
    transactions: 1847,
    gas: 42
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  // Simulation de données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        users: prev.users + Math.floor(Math.random() * 10 - 5),
        volume: prev.volume + (Math.random() - 0.5) * 0.1,
        transactions: prev.transactions + Math.floor(Math.random() * 20 - 10),
        gas: prev.gas + Math.floor(Math.random() * 10 - 5)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const stats: StatCard[] = [
    {
      id: 'users',
      title: 'Fans Actifs',
      value: liveData.users.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Utilisateurs connectés en temps réel'
    },
    {
      id: 'volume',
      title: 'Volume CHZ',
      value: `${liveData.volume.toFixed(1)}M`,
      change: '+8.3%',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Volume d\'échange sur 24h'
    },
    {
      id: 'transactions',
      title: 'Transactions',
      value: liveData.transactions.toLocaleString(),
      change: '+5.7%',
      trend: 'up',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Transactions par minute'
    },
    {
      id: 'gas',
      title: 'Gas Price',
      value: `${liveData.gas} Gwei`,
      change: '-2.1%',
      trend: 'down',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      description: 'Prix du gas moyen'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'fans', label: 'Engagement Fans', icon: <Users className="w-4 h-4" /> },
    { id: 'rewards', label: 'Récompenses', icon: <Trophy className="w-4 h-4" /> },
    { id: 'blockchain', label: 'Blockchain', icon: <Globe className="w-4 h-4" /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-4 h-4" /> }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-hidden"
    >
      {/* Fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-comp/5" />
      
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent-comp rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">FanVerse</h1>
                  <p className="text-sm text-gray-400">Blockchain Dashboard</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Contrôles audio */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </motion.button>

              {/* Bouton fermer */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              >
                <span className="text-xl">×</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Contenu principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 h-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Cartes statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="relative group"
                  >
                    {/* Effet de lueur */}
                    <motion.div
                      variants={glowVariants}
                      initial="initial"
                      animate="animate"
                      className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}
                    />
                    
                    {/* Carte principale */}
                    <div className="relative bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                          {stat.icon}
                        </div>
                        <div className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-400' : 
                          stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {stat.change}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <p className="text-xs text-gray-500">{stat.description}</p>
                      </div>

                      {/* Barre de progression animée */}
                      <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.random() * 100}%` }}
                          transition={{ delay: index * 0.2, duration: 1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Section activité récente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Activité Récente</h2>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    Voir tout <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { user: 'Alice', action: 'a acheté un NFT', time: '2 min', amount: '150 CHZ' },
                    { user: 'Bob', action: 'a voté pour son équipe', time: '5 min', amount: '25 CHZ' },
                    { user: 'Charlie', action: 'a gagné une récompense', time: '8 min', amount: '75 CHZ' },
                    { user: 'Diana', action: 'a participé au quiz', time: '12 min', amount: '10 CHZ' }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent-comp rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{activity.user[0]}</span>
                        </div>
                        <div>
                          <p className="text-white">{activity.user} {activity.action}</p>
                          <p className="text-gray-400 text-sm">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-green-400 font-medium">{activity.amount}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Autres onglets */}
          {activeTab !== 'overview' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent-comp rounded-full mx-auto mb-6 flex items-center justify-center">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-400 mb-8">
                Cette section sera bientôt disponible avec des fonctionnalités avancées.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent-comp text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                En savoir plus
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  )
}
