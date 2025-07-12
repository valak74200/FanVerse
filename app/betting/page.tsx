"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SocialBettingMVP } from "@/components/social-betting-mvp"
import { HeaderChiliz } from "@/components/ui/header-chiliz"
import { NavigationChiliz } from "@/components/ui/navigation-chiliz"
import Link from "next/link"
import { 
  Zap,
  TrendingUp,
  Trophy,
  Coins,
  ArrowLeft,
  Clock,
  Target,
  BarChart3,
  Users,
  Flame
} from "lucide-react"

export default function BettingPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userTokens, setUserTokens] = useState(1250)
  const [emotionLevel, setEmotionLevel] = useState(45)
  const [activeView, setActiveView] = useState("betting")
  
  const liveStats = {
    totalFans: 47829,
    activeUsers: 2847,
    totalBets: 156,
    totalVolume: 89420
  }

  const liveBets = [
    { id: 1, type: "Score exact", odds: 3.5, volume: 12500, trend: "+12%" },
    { id: 2, type: "Prochain buteur", odds: 2.8, volume: 8900, trend: "+8%" },
    { id: 3, type: "Mi-temps", odds: 1.9, volume: 15600, trend: "+15%" },
    { id: 4, type: "Corners", odds: 2.2, volume: 6700, trend: "-3%" }
  ]

  const topBettors = [
    { name: "BetMaster", profit: 8500, winRate: "78%" },
    { name: "CryptoGambler", profit: 6200, winRate: "65%" },
    { name: "LuckyFan", profit: 4800, winRate: "72%" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
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
          onViewChange={(view) => {
            if (view !== "betting") {
              window.location.href = view === "stadium" ? "/stadium" : view === "tribune" ? "/tribune" : view === "social" ? "/social" : "/nft"
            }
          }}
        />
      </nav>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Link href="/home">
          <Button variant="ghost" className="mb-6 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>

        {/* En-tête de la page */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                FanPulse
              </h1>
              <p className="text-text-secondary mt-2">Paris sociaux et prédictions en temps réel</p>
            </div>
            <div className="flex items-center space-x-4">
              <Card className="px-4 py-2 bg-success/20 border-success/30">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-success" />
                  <span className="font-bold text-success">{userTokens} CHZ</span>
                </div>
              </Card>
              <Button className="btn-chiliz">
                Acheter des CHZ
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Interface de paris principale */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <SocialBettingMVP 
                  userTokens={userTokens}
                  onBetPlace={(betId, amount, prediction) => {
                    setUserTokens(prev => prev - amount)
                    console.log('Pari placé:', { betId, amount, prediction })
                  }}
                />
              </Card>
            </motion.div>

            {/* Paris en direct */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-6"
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <span>Paris populaires</span>
                  </h2>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    En direct
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveBets.map((bet) => (
                    <motion.div
                      key={bet.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{bet.type}</h3>
                        <Badge className={`${bet.trend.startsWith('+') ? 'bg-success/20 text-success' : 'bg-red-500/20 text-red-500'} border-0`}>
                          {bet.trend}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-text-secondary">Cote</span>
                          <span className="font-bold text-warning">{bet.odds}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-text-secondary">Volume</span>
                          <span className="font-medium">{(bet.volume / 1000).toFixed(1)}K CHZ</span>
                        </div>
                      </div>
                      <Button className="w-full mt-3 bg-gradient-to-r from-primary to-warning hover:opacity-90">
                        Parier
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Statistiques</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Paris actifs</span>
                      <span className="font-bold text-primary">{liveStats.totalBets}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Volume total</span>
                      <span className="font-bold text-warning">{(liveStats.totalVolume / 1000).toFixed(1)}K CHZ</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Participants</span>
                      <span className="font-bold text-success">{liveStats.activeUsers}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Top parieurs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-lg">Top Parieurs</h3>
                </div>
                <div className="space-y-3">
                  {topBettors.map((bettor, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{bettor.name}</div>
                        <div className="text-xs text-text-secondary flex items-center space-x-2">
                          <span>+{bettor.profit} CHZ</span>
                          <span>•</span>
                          <span>{bettor.winRate} wins</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Conseils */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-5 h-5 text-success" />
                  <h3 className="font-bold text-lg">Conseils</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-success">💡 Pariez de manière responsable</p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-warning">⚡ Les cotes changent en temps réel</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-primary">🎯 Analysez les tendances avant de parier</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
} 