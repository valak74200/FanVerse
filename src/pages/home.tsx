import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { AnimatedBackground } from "@/components/shared/AnimatedBackground"
import { GlitchText } from "@/components/shared/GlitchText"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Trophy, 
  Heart, 
  Zap, 
  Coins,
  Star,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  Shield
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

export default function HomePage() {
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
      
      // Simuler les changements d'émotion
      setEmotionLevel(prev => {
        const change = Math.random() > 0.5 ? 5 : -5
        return Math.max(0, Math.min(100, prev + change))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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
    <MainLayout
      activeView="home"
      isConnected={isConnected}
      userTokens={userTokens}
      emotionLevel={emotionLevel}
      liveStats={liveStats}
      onConnectWallet={() => setIsConnected(!isConnected)}
      onViewChange={(view) => {
        window.location.href = `/${view}`
      }}
    >
      <div className="min-h-screen overflow-hidden">
        {/* Fond animé */}
        <AnimatedBackground />
        
        {/* Contenu principal */}
        <div className="relative z-10 min-h-screen flex flex-col">
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
                enableOnHover={false}
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
            
            {/* Grille des fonctionnalités */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => window.location.href = feature.link}
                  className="cursor-pointer"
                >
                  <Card className="h-full p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 hover:border-primary/40 transition-all group">
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
            
            {/* Section Staking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Card className="p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center space-x-3">
                      <Coins className="w-8 h-8 text-warning" />
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
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{stakedAmount} CHZ</p>
                    <p className="text-sm text-success mt-2">
                      +{(stakedAmount * stakingAPY / 100 / 365).toFixed(2)} CHZ/jour
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Récompenses</span>
                      <Trophy className="w-5 h-5 text-success" />
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
              </Card>
            </motion.div>
            
            {/* Statistiques globales */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 text-center">
                <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">98.5%</p>
                <p className="text-sm text-gray-400">Uptime</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 text-center">
                <Shield className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-gray-400">Sécurisé</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 text-center">
                <Users className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-3xl font-bold">{formatNumber(liveStats.totalFans)}</p>
                <p className="text-sm text-gray-400">Utilisateurs</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-gray-400">Trading</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}