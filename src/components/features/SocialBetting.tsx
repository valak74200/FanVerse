import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Coins, 
  Trophy, 
  Users, 
  TrendingUp, 
  Target, 
  Zap,
  Heart,
  Sparkles,
  Crown,
  Plus,
  ArrowRight,
  Timer
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface Bet {
  id: string
  title: string
  description: string
  type: "emotion" | "score" | "player" | "time"
  odds: number
  pool: number
  participants: number
  timeLeft: number
  userBet?: {
    amount: number
    prediction: string
  }
  creator: {
    name: string
    avatar: string
    isVip: boolean
  }
}

interface SocialBettingProps {
  userTokens: number
  onBetPlace: (betId: string, amount: number, prediction: string) => void
}

export function SocialBetting({ userTokens, onBetPlace }: SocialBettingProps) {
  const [activeBets, setActiveBets] = useState<Bet[]>([
    {
      id: "emotion-1",
      title: "Explosion d'émotion",
      description: "Prédisez le moment où la foule va exploser de joie",
      type: "emotion",
      odds: 2.5,
      pool: 15420,
      participants: 127,
      timeLeft: 1245,
      creator: {
        name: "CryptoFan",
        avatar: "CF",
        isVip: true
      }
    },
    {
      id: "score-1",
      title: "Prochain but",
      description: "Qui marquera le prochain but ?",
      type: "player",
      odds: 3.2,
      pool: 8950,
      participants: 89,
      timeLeft: 892,
      creator: {
        name: "UltraSupporter",
        avatar: "US",
        isVip: false
      }
    },
    {
      id: "time-1",
      title: "Minute magique",
      description: "À quelle minute aura lieu le prochain événement majeur ?",
      type: "time",
      odds: 4.1,
      pool: 12300,
      participants: 156,
      timeLeft: 2341,
      creator: {
        name: "FootballKing",
        avatar: "FK",
        isVip: true
      }
    }
  ])

  const [selectedBet, setSelectedBet] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState(100)
  const [prediction, setPrediction] = useState("")
  const [showCreateBet, setShowCreateBet] = useState(false)

  // Simulation des paris en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBets((prev) => 
        prev.map((bet) => ({
          ...bet,
          timeLeft: Math.max(0, bet.timeLeft - 1),
          pool: bet.pool + Math.random() * 50,
          participants: bet.participants + (Math.random() > 0.8 ? 1 : 0)
        }))
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getBetTypeIcon = (type: string) => {
    switch (type) {
      case "emotion": return <Heart className="w-4 h-4" />
      case "score": return <Target className="w-4 h-4" />
      case "player": return <Users className="w-4 h-4" />
      case "time": return <Timer className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getBetTypeColor = (type: string) => {
    switch (type) {
      case "emotion": return "from-red-500 to-pink-500"
      case "score": return "from-green-500 to-emerald-500"
      case "player": return "from-blue-500 to-cyan-500"
      case "time": return "from-purple-500 to-violet-500"
      default: return "from-gray-500 to-gray-600"
    }
  }

  const handlePlaceBet = (betId: string) => {
    if (betAmount > 0 && prediction && betAmount <= userTokens) {
      onBetPlace(betId, betAmount, prediction)
      setSelectedBet(null)
      setBetAmount(100)
      setPrediction("")
    }
  }

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Paris Sociaux
          </h2>
          <p className="text-gray-400 mt-2">Pariez sur les émotions et moments forts du match</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 px-4 py-2">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-400">{formatNumber(userTokens)}</span>
              <span className="text-xs text-gray-400">CHZ</span>
            </div>
          </Card>
          
          <Button 
            onClick={() => setShowCreateBet(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un pari
          </Button>
        </div>
      </div>

      {/* Paris actifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeBets.map((bet) => (
          <motion.div
            key={bet.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <Card className="h-full bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
              {/* Header du pari */}
              <div className={`h-2 bg-gradient-to-r ${getBetTypeColor(bet.type)}`} />
              
              <div className="p-6 space-y-4">
                {/* Créateur et type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        {bet.creator.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{bet.creator.name}</span>
                        {bet.creator.isVip && <Crown className="w-3 h-3 text-yellow-400" />}
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={`bg-gradient-to-r ${getBetTypeColor(bet.type)} border-0`}>
                    {getBetTypeIcon(bet.type)}
                    <span className="ml-1 capitalize">{bet.type}</span>
                  </Badge>
                </div>

                {/* Titre et description */}
                <div>
                  <h3 className="font-bold text-lg mb-2">{bet.title}</h3>
                  <p className="text-gray-400 text-sm">{bet.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {bet.odds}x
                    </div>
                    <div className="text-xs text-gray-400">Cote</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {formatNumber(bet.pool)}
                    </div>
                    <div className="text-xs text-gray-400">Pool CHZ</div>
                  </div>
                </div>

                {/* Participants et temps */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{bet.participants} participants</span>
                  </div>
                  <div className="flex items-center space-x-1 text-orange-400">
                    <Timer className="w-4 h-4" />
                    <span>{formatTime(bet.timeLeft)}</span>
                  </div>
                </div>

                {/* Pari utilisateur */}
                {bet.userBet ? (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-green-400">Votre pari</div>
                        <div className="text-xs text-gray-400">{bet.userBet.prediction}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">{bet.userBet.amount} CHZ</div>
                        <div className="text-xs text-gray-400">Gain potentiel: {Math.floor(bet.userBet.amount * bet.odds)} CHZ</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setSelectedBet(bet.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 group-hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Parier maintenant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal de pari */}
      <AnimatePresence>
        {selectedBet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBet(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const bet = activeBets.find(b => b.id === selectedBet)
                if (!bet) return null

                return (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{bet.title}</h3>
                      <p className="text-gray-400">{bet.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Montant du pari</label>
                        <Input
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Number(e.target.value))}
                          className="bg-black/20 border-purple-500/30"
                          placeholder="100"
                          max={userTokens}
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          Max: {formatNumber(userTokens)} CHZ
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Votre prédiction</label>
                        <Input
                          value={prediction}
                          onChange={(e) => setPrediction(e.target.value)}
                          className="bg-black/20 border-purple-500/30"
                          placeholder="Ex: 75ème minute, Mbappé, etc."
                        />
                      </div>

                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span>Gain potentiel</span>
                          <span className="text-xl font-bold text-green-400">
                            {Math.floor(betAmount * bet.odds)} CHZ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setSelectedBet(null)}
                        variant="outline"
                        className="flex-1 border-purple-500/30 hover:bg-purple-500/10"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={() => handlePlaceBet(bet.id)}
                        disabled={!prediction || betAmount <= 0 || betAmount > userTokens}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Confirmer
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats en temps réel */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span>Statistiques Live</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {formatNumber(activeBets.reduce((sum, bet) => sum + bet.pool, 0))}
            </div>
            <div className="text-xs text-gray-400">Total Pool</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {activeBets.reduce((sum, bet) => sum + bet.participants, 0)}
            </div>
            <div className="text-xs text-gray-400">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {activeBets.length}
            </div>
            <div className="text-xs text-gray-400">Paris Actifs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {activeBets.filter(bet => bet.userBet).length}
            </div>
            <div className="text-xs text-gray-400">Vos Paris</div>
          </div>
        </div>
      </Card>
    </div>
  )
}