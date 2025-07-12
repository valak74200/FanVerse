import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { SocialBetting } from "@/components/features/SocialBetting"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Zap,
  TrendingUp,
  Trophy,
  Users
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

export default function BettingPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userTokens, setUserTokens] = useState(1250)
  const [emotionLevel, setEmotionLevel] = useState(45)
  
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
    <MainLayout
      activeView="betting"
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
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                FanPulse
              </h1>
              <p className="text-text-secondary mt-2">Paris sociaux et prédictions en temps réel</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Interface de paris principale */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
              <SocialBetting 
                userTokens={userTokens}
                onBetPlace={(betId, amount, prediction) => {
                  setUserTokens(prev => prev - amount)
                  console.log('Pari placé:', { betId, amount, prediction })
                }}
              />
            </Card>

            {/* Paris en direct */}
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20 mt-6">
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
                  <div
                    key={bet.id}
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
                        <span className="text-sm text-gray-400">Cote</span>
                        <span className="font-bold text-warning">{bet.odds}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Volume</span>
                        <span className="font-medium">{formatNumber(bet.volume)} CHZ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Statistiques */}
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Statistiques
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Paris actifs</span>
                    <span className="font-bold text-primary">{liveStats.totalBets}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Volume total</span>
                    <span className="font-bold text-warning">{formatNumber(liveStats.totalVolume)} CHZ</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Participants</span>
                    <span className="font-bold text-success">{formatNumber(liveStats.activeUsers)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Top parieurs */}
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Top Parieurs
              </h3>
              <div className="space-y-3">
                {topBettors.map((bettor, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{bettor.name}</div>
                      <div className="text-xs text-gray-400 flex items-center space-x-2">
                        <span>+{formatNumber(bettor.profit)} CHZ</span>
                        <span>•</span>
                        <span>{bettor.winRate} wins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Conseils */}
            <Card className="p-6 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-success" />
                Conseils
              </h3>
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
          </div>
        </div>
      </div>
    </MainLayout>
  )
}