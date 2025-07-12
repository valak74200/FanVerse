"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdvancedChat } from "@/components/chat/AdvancedChat"
import { HeaderChiliz } from "@/components/ui/header-chiliz"
import { NavigationChiliz } from "@/components/ui/navigation-chiliz"
import Link from "next/link"
import { 
  Users, 
  MessageCircle,
  Heart,
  Share2,
  UserPlus,
  Crown,
  Trophy,
  Star,
  ArrowLeft
} from "lucide-react"

export default function SocialPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userTokens, setUserTokens] = useState(1250)
  const [emotionLevel, setEmotionLevel] = useState(45)
  const [activeView, setActiveView] = useState("social")
  
  const liveStats = {
    totalFans: 47829,
    activeUsers: 2847,
    totalBets: 156,
    totalVolume: 89420
  }

  const onlineUsers = [
    { id: 1, name: "PSGFan92", level: 42, status: "online", badge: "gold" },
    { id: 2, name: "UltrasParis", level: 38, status: "online", badge: "silver" },
    { id: 3, name: "MbappéMania", level: 55, status: "online", badge: "platinum" },
    { id: 4, name: "ParcDesPrinces", level: 29, status: "away", badge: "bronze" },
    { id: 5, name: "ChilizKing", level: 61, status: "online", badge: "diamond" },
    { id: 6, name: "CryptoFan", level: 33, status: "online", badge: "gold" },
    { id: 7, name: "TokenMaster", level: 47, status: "away", badge: "silver" },
    { id: 8, name: "NFTCollector", level: 52, status: "online", badge: "platinum" }
  ]

  const topContributors = [
    { name: "ChilizKing", tokens: 15420, rank: 1 },
    { name: "MbappéMania", tokens: 12850, rank: 2 },
    { name: "NFTCollector", tokens: 11200, rank: 3 }
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
            if (view !== "social") {
              window.location.href = view === "stadium" ? "/stadium" : view === "tribune" ? "/tribune" : view === "betting" ? "/betting" : "/nft"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat principal */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-[700px] p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                      CrewMates
                    </h1>
                    <p className="text-text-secondary mt-1">Chat communautaire en temps réel</p>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30 animate-pulse">
                    {onlineUsers.filter(u => u.status === "online").length} en ligne
                  </Badge>
                </div>
                <AdvancedChat chatType="general" />
              </Card>
            </motion.div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Fans en ligne */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Fans en ligne</h3>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {onlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-warning rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                          user.status === "online" ? "bg-green-400" : "bg-gray-400"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{user.name}</span>
                          {user.badge === "diamond" && <Crown className="w-3 h-3 text-purple-400" />}
                          {user.badge === "platinum" && <Star className="w-3 h-3 text-blue-400" />}
                          {user.badge === "gold" && <Trophy className="w-3 h-3 text-yellow-400" />}
                        </div>
                        <div className="text-xs text-text-secondary">Niveau {user.level}</div>
                      </div>
                      <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Top contributeurs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-lg">Top Contributeurs</h3>
                </div>
                <div className="space-y-3">
                  {topContributors.map((contributor) => (
                    <div key={contributor.rank} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{contributor.rank}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{contributor.name}</div>
                        <div className="text-xs text-text-secondary">{contributor.tokens.toLocaleString()} CHZ</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
                <h3 className="font-bold text-lg mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Créer un groupe
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Inviter des amis
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Rejoindre un clan
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
} 