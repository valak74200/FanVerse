"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Trophy, Star, TrendingUp, Calendar, Target, Award, Zap, Gift } from "lucide-react"

interface CollectionStats {
  totalNFTs: number
  totalValue: number
  rarityBreakdown: Record<string, number>
  teamBreakdown: Record<string, number>
  completionRate: number
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlocked: boolean
    progress?: number
    maxProgress?: number
  }>
}

export function NFTCollection() {
  const [stats] = useState({
    totalNFTs: 23,
    totalValue: 1847,
    rarityBreakdown: {
      Common: 8,
      Rare: 7,
      Epic: 5,
      Legendary: 2,
      Mythic: 1,
    },
    teamBreakdown: {
      PSG: 12,
      BARCA: 11,
    },
    completionRate: 34,
    achievements: [
      {
        id: "first-nft",
        title: "Premier Collectionneur",
        description: "Achetez votre premier NFT",
        icon: "🎯",
        unlocked: true,
      },
      {
        id: "rare-collector",
        title: "Chasseur de Raretés",
        description: "Possédez 5 NFT Rare ou plus",
        icon: "💎",
        unlocked: true,
      },
      {
        id: "team-balance",
        title: "Équilibre Parfait",
        description: "Possédez autant de NFT PSG que Barça",
        icon: "⚖️",
        unlocked: true,
      },
      {
        id: "legendary-owner",
        title: "Légende Vivante",
        description: "Possédez un NFT Legendary",
        icon: "👑",
        unlocked: true,
      },
      {
        id: "mythic-hunter",
        title: "Chasseur Mythique",
        description: "Possédez un NFT Mythic",
        icon: "🌟",
        unlocked: true,
      },
      {
        id: "big-spender",
        title: "Gros Investisseur",
        description: "Dépensez plus de 1000 CHZ en NFT",
        icon: "💰",
        unlocked: false,
        progress: 847,
        maxProgress: 1000,
      },
      {
        id: "complete-set",
        title: "Collection Complète",
        description: "Possédez au moins un NFT de chaque rareté",
        icon: "🏆",
        unlocked: true,
      },
      {
        id: "social-butterfly",
        title: "Papillon Social",
        description: "Partagez 10 NFT sur les réseaux",
        icon: "🦋",
        unlocked: false,
        progress: 3,
        maxProgress: 10,
      },
    ],
  })

  const rarityColors = {
    Common: "from-gray-400 to-gray-600",
    Rare: "from-blue-400 to-blue-600",
    Epic: "from-purple-400 to-purple-600",
    Legendary: "from-yellow-400 to-orange-500",
    Mythic: "from-pink-400 to-red-500",
  }

  const teamColors = {
    PSG: "from-blue-600 to-blue-800",
    BARCA: "from-red-600 to-red-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Ma Collection</h2>
              <p className="text-gray-400">Gérez vos NFT et suivez vos progrès</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-purple-400">{stats.totalNFTs}</div>
            <div className="text-sm text-gray-400">NFT possédés</div>
            <div className="text-lg font-semibold text-green-400">{stats.totalValue} CHZ</div>
            <div className="text-xs text-gray-500">Valeur totale</div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-500">
            Succès
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500">
            Analytiques
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-500">
            Récompenses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Répartition par rareté */}
            <Card className="bg-[#1a1a1a] border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Répartition par Rareté
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.rarityBreakdown).map(([rarity, count]) => (
                  <div key={rarity} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${rarityColors[rarity as keyof typeof rarityColors]}`}
                      />
                      <span className="text-sm text-gray-300">{rarity}</span>
                    </div>
                    <Badge
                      className={`bg-gradient-to-r ${rarityColors[rarity as keyof typeof rarityColors]} text-white`}
                    >
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Répartition par équipe */}
            <Card className="bg-[#1a1a1a] border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-blue-400" />
                Répartition par Équipe
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.teamBreakdown).map(([team, count]) => (
                  <div key={team}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{team}</span>
                      <span className="text-sm font-semibold text-white">{String(count)}</span>
                    </div>
                    <Progress value={(Number(count) / Number(stats.totalNFTs)) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Progression de collection */}
            <Card className="bg-[#1a1a1a] border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Progression
              </h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-400">{stats.completionRate}%</div>
                <div className="text-sm text-gray-400">Collection complétée</div>
              </div>
              <Progress value={stats.completionRate} className="h-3 mb-3" />
              <div className="text-xs text-gray-500 text-center">{stats.totalNFTs} / 68 NFT disponibles</div>
            </Card>
          </div>

          {/* Objectifs rapides */}
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              Objectifs Rapides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Prochain NFT Rare</span>
                  <Badge className="bg-blue-500/20 text-blue-400">3 CHZ</Badge>
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">75% économisé</div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Collection PSG</span>
                  <Badge className="bg-blue-600/20 text-blue-400">2 NFT</Badge>
                </div>
                <Progress value={60} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">12/20 NFT PSG</div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">NFT Légendaire</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">150 CHZ</Badge>
                </div>
                <Progress value={30} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">45/150 CHZ économisés</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              Succès et Réalisations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
                      : "bg-gray-800/50 border-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${achievement.unlocked ? "text-white" : "text-gray-400"}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-green-500 text-white">
                        <Trophy className="w-3 h-3 mr-1" />
                        Débloqué
                      </Badge>
                    )}
                  </div>

                  {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progression</span>
                        <span className="text-xs text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Évolution de la valeur */}
            <Card className="bg-[#1a1a1a] border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Évolution de la Valeur
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Valeur actuelle</span>
                  <span className="text-lg font-bold text-green-400">{stats.totalValue} CHZ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Variation 7j</span>
                  <span className="text-sm font-semibold text-green-400">+12.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Variation 30j</span>
                  <span className="text-sm font-semibold text-green-400">+28.3%</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-gray-500">Performance vs marché: +15%</div>
              </div>
            </Card>

            {/* Activité récente */}
            <Card className="bg-[#1a1a1a] border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                Activité Récente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                  <div>
                    <div className="text-sm text-white">NFT acheté</div>
                    <div className="text-xs text-gray-400">Mbappé Goal #67</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400">+150 CHZ</div>
                    <div className="text-xs text-gray-500">Il y a 2h</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                  <div>
                    <div className="text-sm text-white">NFT vendu</div>
                    <div className="text-xs text-gray-400">Neymar Skill #23</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-red-400">-75 CHZ</div>
                    <div className="text-xs text-gray-500">Il y a 1j</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                  <div>
                    <div className="text-sm text-white">Succès débloqué</div>
                    <div className="text-xs text-gray-400">Chasseur Mythique</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-400">+50 XP</div>
                    <div className="text-xs text-gray-500">Il y a 3j</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-purple-400" />
              Récompenses Disponibles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-4 rounded-lg">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🎁</div>
                  <h4 className="font-semibold text-white">Pack Mystère</h4>
                  <p className="text-sm text-gray-400">NFT aléatoire garanti</p>
                </div>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-purple-400">100 CHZ</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">Acheter</Button>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-4 rounded-lg">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">⭐</div>
                  <h4 className="font-semibold text-white">Boost XP</h4>
                  <p className="text-sm text-gray-400">Double XP pendant 24h</p>
                </div>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-yellow-400">50 CHZ</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500">Activer</Button>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4 rounded-lg">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-semibold text-white">Échange Gratuit</h4>
                  <p className="text-sm text-gray-400">Échangez un NFT Common</p>
                </div>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-green-400">Gratuit</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500">Utiliser</Button>
              </div>
            </div>
          </Card>

          {/* Programme de fidélité */}
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-400" />
              Programme de Fidélité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Niveau actuel</span>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Collectionneur Elite
                  </Badge>
                </div>
                <Progress value={65} className="h-3 mb-2" />
                <div className="text-xs text-gray-500">1,300 / 2,000 XP pour le niveau suivant</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white">Avantages actuels:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 5% de réduction sur tous les achats</li>
                  <li>• Accès prioritaire aux drops exclusifs</li>
                  <li>• 1 pack mystère gratuit par mois</li>
                  <li>• Badge spécial dans le chat</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
