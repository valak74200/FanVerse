"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HeaderChiliz } from "@/components/ui/header-chiliz"
import { NavigationChiliz } from "@/components/ui/navigation-chiliz"
import { LiveStatsChiliz } from "@/components/ui/live-stats-chiliz"
import Waves from "@/components/ui/Waves"
import GlitchText from "@/components/ui/GlitchText"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Trophy, 
  Heart, 
  Zap, 
  Gamepad2, 
  MessageCircle,
  Coins,
  Crown,
  Sparkles,
  Volume2,
  Settings,
  UserPlus,
  Wifi,
  WifiOff,
  TrendingUp,
  Star,
  Flame,
  Lock,
  Timer,
  Gift,
  BarChart3,
  ArrowUpRight,
  Shield
} from "lucide-react"

export default function FanVerseMVP() {
  const router = useRouter()
  const [activeView, setActiveView] = useState("home")
  const [isConnected, setIsConnected] = useState(false)
  const [userTokens, setUserTokens] = useState(1250)
  const [emotionLevel, setEmotionLevel] = useState(0)
  const [crowdVolume, setCrowdVolume] = useState(75)
  const [stakedAmount, setStakedAmount] = useState(0)
  const [stakingAPY, setStakingAPY] = useState(12.5)
  const [liveStats, setLiveStats] = useState({
    totalFans: 47829,
    activeUsers: 2847,
    totalBets: 156,
    totalVolume: 89420
  })

  // Animation des stats en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        totalVolume: prev.totalVolume + Math.floor(Math.random() * 100)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Fonction de navigation
  const handleViewChange = (view: string) => {
    if (view !== "home") {
      router.push(`/${view}`)
    }
  }

  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "MetaTribune",
      description: "Stade virtuel 3D immersif",
      color: "from-blue-500 to-purple-500",
      link: "/stadium"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "CrewMates",
      description: "Chat communautaire en direct",
      color: "from-primary to-warning",
      link: "/social"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "FanPulse",
      description: "Paris sociaux & prédictions",
      color: "from-green-500 to-emerald-500",
      link: "/betting"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "MoodNFT",
      description: "NFTs basés sur les émotions",
      color: "from-purple-500 to-pink-500",
      link: "/nft"
    }
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Fond animé amélioré avec effets futuristes */}
      <div className="fixed inset-0 z-0">
        <Waves 
          lineColor="rgba(255, 107, 53, 0.2)"
          backgroundColor="rgba(0, 0, 0, 0.95)"
          waveSpeedX={0.005}
          waveSpeedY={0.003}
          waveAmpX={15}
          waveAmpY={10}
          xGap={40}
          yGap={60}
          friction={0.98}
          tension={0.002}
          maxCursorMove={40}
        />
        
        {/* Grille futuriste */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />
        
        {/* Effets de lumière */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-warning/20 rounded-full blur-3xl"
        />
      </div>
      
      {/* Layout principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-primary/20">
          <HeaderChiliz 
            isConnected={isConnected}
            onConnectWallet={() => setIsConnected(!isConnected)}
            userTokens={userTokens}
            emotionLevel={emotionLevel}
            liveStats={liveStats}
          />
        </header>
        
        {/* Navigation */}
        <nav className="sticky top-[72px] z-40 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-lg border-b border-primary/10">
          <NavigationChiliz 
            activeView={activeView}
            onViewChange={handleViewChange}
          />
        </nav>
        
        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section avec Glitch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <GlitchText
                speed={0.8}
                className="text-6xl md:text-8xl font-bold mb-4"
                enableShadows={true}
                enableOnHover={true}
              >
                FanVerse
              </GlitchText>
              <p className="text-xl md:text-2xl text-primary">
                L'expérience ultime des fans de football
              </p>
              <p className="text-lg text-gray-400 mt-2">
                Powered by Chiliz & Socios.com
              </p>
            </motion.div>
            
            {/* Stats Live */}
            <div className="mb-12">
              <LiveStatsChiliz stats={{
                ...liveStats,
                emotionLevel: emotionLevel,
                crowdVolume: crowdVolume,
                matchEvents: 12,
                nftMinted: 127
              }} />
            </div>
            
            {/* Section Staking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Card className="p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center space-x-3">
                      <Lock className="w-8 h-8 text-warning" />
                      <GlitchText speed={0.5} className="inline-block">
                        Staking CHZ
                      </GlitchText>
                    </h2>
                    <p className="text-gray-400 mt-2">Stakez vos tokens et gagnez des récompenses</p>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30 text-lg px-4 py-2">
                    APY: {stakingAPY}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Disponible</span>
                      <Coins className="w-5 h-5 text-warning" />
                    </div>
                    <p className="text-2xl font-bold">{userTokens} CHZ</p>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-primary to-warning hover:opacity-90"
                      onClick={() => setStakedAmount(userTokens)}
                    >
                      Staker tout
                    </Button>
                  </Card>
                  
                  <Card className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">En staking</span>
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{stakedAmount} CHZ</p>
                    <p className="text-sm text-success mt-2">
                      +{(stakedAmount * stakingAPY / 100 / 365).toFixed(2)} CHZ/jour
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Récompenses</span>
                      <Gift className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-2xl font-bold">42.5 CHZ</p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-success text-success hover:bg-success/10"
                    >
                      Réclamer
                    </Button>
                  </Card>
                </div>
                
                <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/30">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-5 h-5 text-warning" />
                    <span className="text-sm">Période de lock : 30 jours minimum</span>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Grille des fonctionnalités */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => router.push(feature.link)}
                  className="cursor-pointer"
                >
                  <Card className="h-full p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all group">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      <GlitchText speed={0.3} enableOnHover={true}>
                        {feature.title}
                      </GlitchText>
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                    <div className="mt-4 flex items-center text-primary">
                      <span className="text-sm">Explorer</span>
                      <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Statistiques globales */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20 text-center">
                <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">98.5%</p>
                <p className="text-sm text-gray-400">Uptime</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20 text-center">
                <Shield className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-gray-400">Sécurisé</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20 text-center">
                <Users className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-3xl font-bold">47K+</p>
                <p className="text-sm text-gray-400">Utilisateurs</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-gray-400">Trading</p>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
