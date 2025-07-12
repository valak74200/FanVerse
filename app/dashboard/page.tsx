"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  Home,
  Menu,
  X,
  ChevronRight,
  LogOut
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
  const [activeSection, setActiveSection] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
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

  const sidebarItems = [
    { id: "home", label: "Accueil", icon: Home, badge: null },
    { id: "stadium", label: "Stade Virtuel", icon: Trophy, badge: "LIVE" },
    { id: "social", label: "Chat Social", icon: MessageCircle, badge: null },
    { id: "betting", label: "Paris & Prédictions", icon: Zap, badge: null },
    { id: "nft-marketplace", label: "NFT Marketplace", icon: ShoppingCart, badge: "HOT" },
    { id: "nft-collection", label: "Ma Collection", icon: Star, badge: null },
    { id: "nft-moments", label: "Moments NFT", icon: Sparkles, badge: "NEW" },
    { id: "staking", label: "Staking CHZ", icon: Lock, badge: null },
    { id: "settings", label: "Paramètres", icon: Settings, badge: null },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-4 p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent mb-4">
                      Bienvenue sur FanVerse
                    </h1>
                    <p className="text-xl text-gray-400">
                      L'expérience ultime des fans de football
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end gap-4">
                    <Badge className="px-4 py-2 text-lg bg-gradient-to-r from-primary/20 to-warning/20 border-primary/30">
                      <Coins className="w-5 h-5 mr-2 text-warning" />
                      <span className="font-bold text-warning">{userTokens} CHZ</span>
                    </Badge>
                    <Button 
                      onClick={() => setIsConnected(!isConnected)}
                      className={`${isConnected 
                        ? 'bg-gradient-to-r from-success to-success/80' 
                        : 'bg-gradient-to-r from-primary to-warning'
                      } px-6 py-2 text-white font-bold`}
                    >
                      {isConnected ? (
                        <div className="flex items-center">
                          <Wifi className="w-5 h-5 mr-2" />
                          <span>Connecté</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <WifiOff className="w-5 h-5 mr-2" />
                          <span>Connecter Wallet</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
              
              {/* Stats Cards */}
              {[
                { icon: Users, label: "Fans Actifs", value: liveStats.activeUsers.toLocaleString(), color: "from-blue-500 to-blue-700" },
                { icon: Coins, label: "Volume Total", value: `${Math.round(liveStats.totalVolume / 1000)}K CHZ`, color: "from-yellow-500 to-amber-500" },
                { icon: Zap, label: "Paris Actifs", value: liveStats.totalBets.toString(), color: "from-green-500 to-emerald-500" },
                { icon: Star, label: "NFT Créés", value: liveStats.nftMinted.toString(), color: "from-purple-500 to-pink-500" }
              ].map((stat, index) => (
                <Card key={index} className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Featured Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sidebarItems.slice(1, 5).map((item, index) => (
                <Card 
                  key={item.id}
                  className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group"
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-warning/20 group-hover:from-primary group-hover:to-warning transition-all duration-300">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{item.label}</h3>
                    </div>
                    {item.badge && (
                      <Badge className="bg-primary text-white">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400">Accéder à {item.label}</p>
                    <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      case "stadium":
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 overflow-hidden">
              <div className="h-[600px]">
                <VirtualStadium className="w-full h-full" />
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
              <EmotionPanel />
            </Card>
          </div>
        )
      case "social":
        return (
          <Card className="h-[700px] p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                  Chat Social
                </h1>
                <p className="text-gray-400 mt-1">Discussions en temps réel avec la communauté</p>
              </div>
              <Badge className="bg-success/20 text-success border-success/30 animate-pulse">
                {liveStats.activeUsers} en ligne
              </Badge>
            </div>
            <AdvancedChat chatType="general" />
          </Card>
        )
      case "betting":
        return (
          <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
            <SocialBettingMVP 
              userTokens={userTokens}
              onBetPlace={(betId, amount, prediction) => {
                setUserTokens(prev => prev - amount)
                console.log('Pari placé:', { betId, amount, prediction })
              }}
            />
          </Card>
        )
      case "nft-marketplace":
        return <NFTMarketplace />
      case "nft-collection":
        return <NFTCollection />
      case "nft-moments":
        return (
          <NFTMoments
            onMomentCapture={(moment) => console.log('Moment captured:', moment)}
            matchEvents={matchEvents}
          />
        )
      case "staking":
        return (
          <Card className="p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
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
        )
      case "settings":
        return (
          <Card className="p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Settings className="w-8 h-8 mr-3 text-primary" />
              Paramètres
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Profil</h3>
                <div className="flex items-center space-x-4 p-4 bg-black/40 rounded-lg border border-gray-800">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-warning text-white text-xl">
                      FV
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">FanVerse User</p>
                    <p className="text-sm text-gray-400">Membre depuis Juin 2025</p>
                  </div>
                  <Button className="ml-auto">Modifier</Button>
                </div>
              </div>
              
              <Separator className="bg-gray-800" />
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Wallet</h3>
                <div className="p-4 bg-black/40 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-warning" />
                      <span className="text-lg font-medium">{userTokens} CHZ</span>
                    </div>
                    <Button>Acheter des CHZ</Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-success" />
                    <span>Wallet sécurisé par Chiliz Chain</span>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-gray-800" />
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Préférences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-800">
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-gray-400">Recevoir des alertes pour les événements</p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-800">
                    <div>
                      <p className="font-medium">Langue</p>
                      <p className="text-sm text-gray-400">Français</p>
                    </div>
                    <Button variant="outline">Changer</Button>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-gray-800" />
              
              <div className="flex justify-end">
                <Button variant="destructive" className="flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </Card>
        )
      default:
        return (
          <div className="flex items-center justify-center h-[600px]">
            <Card className="p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 text-center">
              <h2 className="text-2xl font-bold mb-4">Section en développement</h2>
              <p className="text-gray-400">Cette fonctionnalité sera bientôt disponible.</p>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar Toggle for Mobile */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>
      
      {/* Sidebar */}
      <motion.div 
        className="fixed md:relative z-40 h-full bg-gradient-to-b from-gray-900 to-black border-r border-primary/20"
        initial={{ width: sidebarOpen ? 280 : 0 }}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8 p-2">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-warning rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                FanVerse
              </h1>
              <p className="text-xs text-gray-400">Web3 Sports Platform</p>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="mb-6 p-3 bg-black/40 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-primary">
                <AvatarFallback className="bg-gradient-to-r from-primary to-warning text-white">
                  FV
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">FanVerse User</p>
                <div className="flex items-center text-xs text-gray-400">
                  <Coins className="w-3 h-3 mr-1 text-warning" />
                  <span>{userTokens} CHZ</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start text-left h-12 ${
                  activeSection === item.id 
                    ? "bg-gradient-to-r from-primary to-warning" 
                    : "hover:bg-primary/10"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center w-full">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-white/20 text-white">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <div className="flex items-center">
                <Wifi className="w-3 h-3 mr-1 text-success" />
                <span>Connecté</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                <span>Sécurisé</span>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start text-left" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {sidebarItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-400">
                {activeSection === "home" 
                  ? "Bienvenue sur votre dashboard FanVerse" 
                  : `Explorez ${sidebarItems.find(item => item.id === activeSection)?.label}`}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-primary/20 to-warning/20 border-primary/30 px-3 py-1.5">
                <Flame className="w-4 h-4 mr-1 text-warning" />
                <span className="font-medium">Match en direct</span>
              </Badge>
              
              <Button variant="outline" size="sm" className="border-gray-700">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  )
}