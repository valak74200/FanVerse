import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { LiveChat } from "@/components/features/LiveChat"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Trophy,
  MessageCircle,
  UserPlus,
  Star,
  Crown
} from "lucide-react"

export default function SocialPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userTokens, setUserTokens] = useState(1250)
  const [emotionLevel, setEmotionLevel] = useState(45)
  
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
    <MainLayout
      activeView="social"
      isConnected={isConnected}
      userTokens={userTokens}
      emotionLevel={emotionLevel}
      liveStats={liveStats}
      onConnectWallet={() => setIsConnected(!isConnected)}
      onViewChange={(view) => {
        window.location.href = `/${view}`
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat principal */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
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
              <LiveChat chatType="general" />
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Fans en ligne */}
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
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
                    <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top contributeurs */}
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
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

            {/* Actions rapides */}
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
              <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Actions rapides</span>
              </h3>
              <div className="space-y-3">
                <button className="w-full p-3 text-left rounded-lg border border-gray-700 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-4 h-4" />
                    <span>Créer un groupe</span>
                  </div>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-700 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <UserPlus className="w-4 h-4" />
                    <span>Inviter des amis</span>
                  </div>
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-700 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-4 h-4" />
                    <span>Rejoindre un clan</span>
                  </div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}