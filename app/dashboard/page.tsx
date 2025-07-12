"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Provider } from "react-redux"
import { store } from "@/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HeaderChiliz } from "@/components/ui/header-chiliz"
import { LiveStatsChiliz } from "@/components/ui/live-stats-chiliz"
import { SocialBettingMVP } from "@/components/social-betting-mvp"
import { AdvancedChat } from "@/components/advanced-chat"
import { NFTMoments } from "@/components/nft-moments"
import { NFTMarketplace } from "@/components/nft-marketplace"
import { NFTCollection } from "@/components/nft-collection"
import { EmotionPanel } from "@/components/stadium/EmotionPanel"
import dynamic from "next/dynamic"
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
  Shield,
  Home
} from "lucide-react"

// Charger VirtualStadium uniquement côté client
const VirtualStadium = dynamic(() => import('@/components/stadium/VirtualStadium').then(mod => ({ default: mod.VirtualStadium })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Chargement du stade virtuel...</p>
      </div>
    </div>
  )
})

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [userTokens, setUserTokens] = useState(1250)
  const [emotionLevel, setEmotionLevel] = useState(45)
  const [crowdVolume, setCrowdVolume] = useState(75)
  const [activeTab, setActiveTab] = useState("home")
  
  const liveStats = {
    totalFans: 47829,
    activeUsers: 2847,
    totalBets: 156,
    totalVolume: 89420,
    emotionLevel: emotionLevel,
    crowdVolume: crowdVolume,
    matchEvents: 12,
    nftMinted: 127
  }

  const matchEvents = [
    { type: "goal", player: "Mbappé", time: "23'" },
    { type: "goal", player: "Lewandowski", time: "45'" },
    { type: "goal", player: "Dembélé", time: "67'" },
  ]

  return (
    <Provider store={store}>
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
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="home" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-warning">
              <div className="flex flex-col items-center space-y-1">
                <Home className="w-5 h-5" />
                <span>Accueil</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="stadium" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500">
              <div className="flex flex-col items-center space-y-1">
                <Trophy className="w-5 h-5" />
                <span>Stade</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500">
              <div className="flex flex-col items-center space-y-1">
                <MessageCircle className="w-5 h-5" />
                <span>Social</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="betting" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500">
              <div className="flex flex-col items-center space-y-1">
                <Zap className="w-5 h-5" />
                <span>Paris</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="nft" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <div className="flex flex-col items-center space-y-1">
                <Star className="w-5 h-5" />
                <span>NFT</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          {/* Contenu des onglets */}
          <TabsContent value="home" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                FanVerse
              </h1>
              <p className="text-xl md:text-2xl text-primary">
                L'expérience ultime des fans de football
              </p>
              <p className="text-lg text-gray-400 mt-2">
                Powered by Chiliz & Socios.com
              </p>
            </motion.div>
            
            {/* Stats Live */}
            <div className="mb-12">
              <LiveStatsChiliz stats={liveStats} />
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
                      <span>Staking CHZ</span>
                    </h2>
                    <p className="text-gray-400 mt-2">Stakez vos tokens et gagnez des récompenses</p>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30 text-lg px-4 py-2">
                    APY: 12.5%
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
                    >
                      Staker tout
                    </Button>
                  </Card>
                  
                  <Card className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">En staking</span>
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">0 CHZ</p>
                    <p className="text-sm text-success mt-2">
                      +0.00 CHZ/jour
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Récompenses</span>
                      <Gift className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-2xl font-bold">0 CHZ</p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-success text-success hover:bg-success/10"
                      disabled
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
          </TabsContent>
          
          <TabsContent value="stadium" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20 overflow-hidden">
                  <div className="h-[600px]">
                    <VirtualStadium className="w-full h-full" />
                  </div>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20 p-6">
                  <EmotionPanel />
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="h-[700px] p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                        CrewMates
                      </h1>
                      <p className="text-text-secondary mt-1">Chat communautaire en temps réel</p>
                    </div>
                    <Badge className="bg-success/20 text-success border-success/30 animate-pulse">
                      2847 en ligne
                    </Badge>
                  </div>
                  <AdvancedChat chatType="general" />
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Fans en ligne</h3>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-warning rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{String.fromCharCode(65 + i)}</span>
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black bg-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Fan{i + 1}</span>
                            {i % 3 === 0 && <Crown className="w-3 h-3 text-yellow-400" />}
                          </div>
                          <div className="text-xs text-text-secondary">Niveau {Math.floor(Math.random() * 50) + 10}</div>
                        </div>
                        <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="betting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                  <SocialBettingMVP 
                    userTokens={userTokens}
                    onBetPlace={(betId, amount, prediction) => {
                      setUserTokens(prev => prev - amount)
                      console.log('Pari placé:', { betId, amount, prediction })
                    }}
                  />
                </Card>
              </div>
              
              <div className="space-y-6">
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
                
                <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-bold text-lg">Top Parieurs</h3>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">#{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Parieur{i + 1}</div>
                          <div className="text-xs text-text-secondary flex items-center space-x-2">
                            <span>+{(i + 1) * 1000} CHZ</span>
                            <span>•</span>
                            <span>{70 + i * 5}% wins</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nft" className="space-y-6">
            <Tabs defaultValue="marketplace" className="w-full">
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="collection">Ma Collection</TabsTrigger>
                <TabsTrigger value="moments">Moments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="marketplace" className="space-y-6">
                <NFTMarketplace />
              </TabsContent>
              
              <TabsContent value="collection" className="space-y-6">
                <NFTCollection />
              </TabsContent>
              
              <TabsContent value="moments" className="space-y-6">
                <NFTMoments 
                  onMomentCapture={(moment) => console.log('Moment captured:', moment)}
                  matchEvents={matchEvents}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </Provider>
    </div>
  )
}