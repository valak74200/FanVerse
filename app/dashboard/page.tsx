"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SocialBettingMVP } from "@/components/social-betting-mvp"
import { AdvancedChat } from "@/components/chat/AdvancedChat"
import { NFTMoments } from "@/components/nft-moments"
import { NFTMarketplace } from "@/components/nft-marketplace"
import { NFTCollection } from "@/components/nft-collection"
import { EmotionPanel } from "@/components/stadium/EmotionPanel"
import dynamic from "next/dynamic"
import GlitchText from "@/components/ui/GlitchText"
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
  LogOut,
  ShoppingCart
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
  const [emotionLevel, setEmotionLevel] = useState(65)
  const [crowdVolume, setCrowdVolume] = useState(75)
  const [activeSection, setActiveSection] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedChatGroup, setSelectedChatGroup] = useState("general")
  
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
        const chatGroups = [
          { id: "general", name: "Chat Général", members: 2847, icon: "🌐" },
          { id: "psg-ultras", name: "PSG Ultras", members: 156, icon: "🔵" },
          { id: "barca-fans", name: "Barça Supporters", members: 128, icon: "🔴" },
          { id: "vip-lounge", name: "VIP Lounge", members: 42, icon: "👑" }
        ];
        
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-4 p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20 overflow-hidden relative">
                {/* Particules d'arrière-plan */}
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-[#FF6B35]"
                      initial={{ 
                        x: Math.random() * 100 + "%", 
                        y: Math.random() * 100 + "%", 
                        opacity: 0.1 + Math.random() * 0.3 
                      }}
                      animate={{ 
                        x: [
                          Math.random() * 100 + "%",
                          Math.random() * 100 + "%",
                          Math.random() * 100 + "%"
                        ],
                        y: [
                          Math.random() * 100 + "%",
                          Math.random() * 100 + "%",
                          Math.random() * 100 + "%"
                        ]
                      }}
                      transition={{ 
                        duration: 15 + Math.random() * 20, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <GlitchText
                      className="text-4xl md:text-6xl font-bold mb-4 text-[#FF6B35]"
                      enableShadows={true}
                    >
                      FanVerse
                    </GlitchText>
                    <p className="text-xl text-[#FFD23F]">
                      L'expérience ultime des fans de football
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Powered by Chiliz & Socios.com
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end gap-4">
                    <Badge className="px-4 py-2 text-lg bg-gradient-to-r from-[#FF6B35]/20 to-[#FFD23F]/20 border-[#FF6B35]/30">
                      <Coins className="w-5 h-5 mr-2 text-[#FFD23F]" />
                      <span className="font-bold text-[#FFD23F]">{userTokens} CHZ</span>
                    </Badge>
                    <Button 
                      onClick={() => setIsConnected(!isConnected)}
                      className={`web3-connect-btn relative overflow-hidden ${isConnected 
                        ? 'bg-gradient-to-r from-[#00D4AA] to-[#00D4AA]/80' 
                        : 'bg-gradient-to-r from-[#FF6B35] to-[#FFD23F]'
                      } px-6 py-2 text-white font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,107,53,0.5)]`}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      />
                      {isConnected ? (
                        <div className="flex items-center relative z-10">
                          <Wifi className="w-5 h-5 mr-2" />
                          <span>Connecté</span>
                        </div>
                      ) : (
                        <div className="flex items-center relative z-10">
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
                { icon: Users, label: "Fans Actifs", value: liveStats.activeUsers.toLocaleString(), color: "from-[#1A1A2E] to-[#16213E]", iconColor: "#00D4AA" },
                { icon: Coins, label: "Volume Total", value: `${Math.round(liveStats.totalVolume / 1000)}K CHZ`, color: "from-[#1A1A2E] to-[#16213E]", iconColor: "#FFD23F" },
                { icon: Zap, label: "Paris Actifs", value: liveStats.totalBets.toString(), color: "from-[#1A1A2E] to-[#16213E]", iconColor: "#FF6B35" },
                { icon: Star, label: "NFT Créés", value: liveStats.nftMinted.toString(), color: "from-[#1A1A2E] to-[#16213E]", iconColor: "#00D4AA" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20 hover:border-[#FF6B35]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,107,53,0.2)] hover:-translate-y-1">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} border border-[#FF6B35]/20`}>
                        <stat.icon className={`w-6 h-6 text-[${stat.iconColor}]`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Groupes de discussion */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-[#FF6B35]" />
                Groupes de discussion
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {chatGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card 
                      className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20 hover:border-[#FF6B35]/40 cursor-pointer"
                      onClick={() => {
                        setSelectedChatGroup(group.id);
                        setActiveSection("stadium");
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] rounded-full flex items-center justify-center text-xl">
                          {group.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{group.name}</h3>
                          <p className="text-xs text-gray-400">{group.members} membres</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-2 bg-gradient-to-r from-[#FF6B35]/20 to-[#FFD23F]/20 hover:from-[#FF6B35] hover:to-[#FFD23F] text-white border border-[#FF6B35]/30"
                      >
                        Rejoindre
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Featured Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sidebarItems.slice(1, 5).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card 
                    className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20 hover:border-[#FF6B35]/40 transition-all duration-300 cursor-pointer group overflow-hidden"
                    onClick={() => setActiveSection(item.id)}
                  >
                    {/* Effet de particules */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-[#FF6B35]"
                          initial={{ 
                            x: "50%", 
                            y: "50%", 
                            opacity: 0 
                          }}
                          animate={{ 
                            x: [
                              "50%",
                              `${Math.random() * 100}%`,
                              `${Math.random() * 100}%`
                            ],
                            y: [
                              "50%",
                              `${Math.random() * 100}%`,
                              `${Math.random() * 100}%`
                            ],
                            opacity: [0, 0.8, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            ease: "easeOut",
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF6B35]/20 to-[#FFD23F]/20 group-hover:from-[#FF6B35] group-hover:to-[#FFD23F] transition-all duration-300">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{item.label}</h3>
                      </div>
                      {item.badge && (
                        <Badge className="bg-[#FF6B35] text-white animate-pulse">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <p className="text-gray-400">Accéder à {item.label}</p>
                      <ChevronRight className="w-5 h-5 text-[#FF6B35] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )
      case "stadium":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20 overflow-hidden h-full">
                <div className="h-full">
                  <VirtualStadium className="w-full h-full" />
                </div>
              </Card>
              
              <div className="space-y-6 h-full flex flex-col">
                <Card className="flex-1 p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20 overflow-hidden">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] bg-clip-text text-transparent">
                          Chat en direct
                        </h3>
                        <div className="flex items-center mt-1">
                          <select 
                            value={selectedChatGroup}
                            onChange={(e) => setSelectedChatGroup(e.target.value)}
                            className="text-xs bg-black/30 border border-[#FF6B35]/30 text-gray-300 rounded px-2 py-1"
                          >
                            <option value="general">Chat Général</option>
                            <option value="psg-ultras">PSG Ultras</option>
                            <option value="barca-fans">Barça Supporters</option>
                            <option value="vip-lounge">VIP Lounge</option>
                          </select>
                        </div>
                      </div>
                      <Badge className="bg-[#00D4AA]/20 text-[#00D4AA] border-[#00D4AA]/30">
                        {liveStats.activeUsers} en ligne
                      </Badge>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <AdvancedChat 
                        chatType={selectedChatGroup === "general" ? "general" : "group"} 
                        groupId={selectedChatGroup !== "general" ? selectedChatGroup : undefined}
                      />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20">
                  <EmotionPanel />
                </Card>
              </div>
            </div>
          </div>
        )
      case "social":
        return (
          <Card className="h-[700px] p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] bg-clip-text text-transparent">
                  Chat Social
                </h1>
                <p className="text-gray-400 mt-1">Discussions en temps réel avec la communauté</p>
              </div>
              <Badge className="bg-[#00D4AA]/20 text-[#00D4AA] border-[#00D4AA]/30 animate-pulse">
                {liveStats.activeUsers} en ligne
              </Badge>
            </div>
            <AdvancedChat chatType="general" />
          </Card>
        )
      case "betting":
        return (
          <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20">
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
        return (
          <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20">
            <NFTCollection />
          </Card>
        )
      case "nft-moments":
        return (
          <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20">
            <NFTMoments
              onMomentCapture={(moment) => console.log('Moment captured:', moment)}
              matchEvents={matchEvents}
            />
          </Card>
        )
      case "staking":
        return (
          <Card className="p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold flex items-center space-x-3">
                  <Lock className="w-8 h-8 text-[#FFD23F]" />
                  <span>Staking CHZ</span>
                </h2>
                <p className="text-gray-400 mt-2">Stakez vos tokens et gagnez des récompenses</p>
              </div>
              <Badge className="bg-[#00D4AA]/20 text-[#00D4AA] border-[#00D4AA]/30 text-lg px-4 py-2">
                APY: 12.5%
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Disponible</span>
                  <Coins className="w-5 h-5 text-[#FFD23F]" />
                </div>
                <p className="text-2xl font-bold">{userTokens} CHZ</p>
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,107,53,0.4)]"
                >
                  Staker tout
                </Button>
              </Card>
              
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">En staking</span>
                  <Lock className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <p className="text-2xl font-bold">0 CHZ</p>
                <p className="text-sm text-[#00D4AA] mt-2">
                  +0.00 CHZ/jour
                </p>
              </Card>
              
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Récompenses</span>
                  <Gift className="w-5 h-5 text-[#00D4AA]" />
                </div>
                <p className="text-2xl font-bold">0 CHZ</p>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA]/10"
                  disabled
                >
                  Réclamer
                </Button>
              </Card>
            </div>
            
            <div className="mt-6 p-4 bg-[#FFD23F]/10 rounded-lg border border-[#FFD23F]/30">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-[#FFD23F]" />
                <span className="text-sm">Période de lock : 30 jours minimum</span>
              </div>
            </div>
          </Card>
        )
      case "settings":
        return (
          <Card className="p-8 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-[#FF6B35]/20">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Settings className="w-8 h-8 mr-3 text-[#FF6B35]" />
              Paramètres
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Profil</h3>
                <div className="flex items-center space-x-4 p-4 bg-black/40 rounded-lg border border-gray-800">
                  <Avatar className="w-16 h-16 border-2 border-[#FF6B35]">
                    <AvatarFallback className="bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white text-xl">
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
                      <Coins className="w-5 h-5 text-[#FFD23F]" />
                      <span className="text-lg font-medium">{userTokens} CHZ</span>
                    </div>
                    <Button className="bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] hover:shadow-[0_0_15px_rgba(255,107,53,0.4)] transition-all duration-300">
                      Acheter des CHZ
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-[#00D4AA]" />
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
              <GlitchText
                className="text-2xl font-bold text-[#FF6B35]"
                enableShadows={true}
              >
                FanVerse
              </GlitchText>
              <p className="text-xs text-gray-400">Web3 Sports Platform</p>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="mb-6 p-3 bg-black/40 rounded-lg border border-[#FF6B35]/20 hover:border-[#FF6B35]/40 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-[#FF6B35]">
                <AvatarFallback className="bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white">
                  FV
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">FanVerse User</p>
                <div className="flex items-center text-xs text-gray-400">
                  <Coins className="w-3 h-3 mr-1 text-[#FFD23F]" />
                  <span>{userTokens} CHZ</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 space-y-2">
            {sidebarItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * sidebarItems.indexOf(item) }}
              >
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start text-left h-12 relative overflow-hidden ${
                    activeSection === item.id 
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FFD23F]" 
                      : "hover:bg-[#FF6B35]/10"
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {/* Effet de brillance */}
                  {activeSection === item.id && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  )}
                  
                  <div className="flex items-center w-full relative z-10">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-white/20 text-white">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <div className="flex items-center">
                <Wifi className="w-3 h-3 mr-1 text-[#00D4AA]" />
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
        <motion.div 
          className="md:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-[#0F0F23] via-black to-[#0F0F23]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-6 flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] bg-clip-text text-transparent">
                {sidebarItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-400">
                {activeSection === "home" 
                  ? "Bienvenue sur votre dashboard FanVerse" 
                  : `Explorez ${sidebarItems.find(item => item.id === activeSection)?.label}`}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-[#FF6B35]/20 to-[#FFD23F]/20 border-[#FF6B35]/30 px-3 py-1.5">
                <Flame className="w-4 h-4 mr-1 text-[#FFD23F]" />
                <span className="font-medium">Match en direct</span>
              </Badge>
              
              <Button variant="outline" size="sm" className="border-gray-700 hover:border-[#FF6B35] hover:bg-[#FF6B35]/10 transition-colors">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
          
          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}