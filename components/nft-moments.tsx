"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Camera, Eye, Heart, Share2, Download, ShoppingCart, Crown, Gift } from "lucide-react"

interface NFTMoment {
  id: string
  title: string
  description: string
  player: string
  team: "PSG" | "BARCA"
  timestamp: string
  matchMinute: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  price: number
  currency: "CHZ" | "PSG" | "BAR"
  image: string
  video: string
  stats: {
    views: number
    likes: number
    shares: number
    owners: number
  }
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  isOwned: boolean
  isForSale: boolean
  edition: {
    current: number
    total: number
  }
  createdAt: string
  capturedBy: string
}

interface NFTMomentsProps {
  onMomentCapture?: (moment: NFTMoment) => void
  matchEvents: Array<{ type: string; player: string; time: string }>
}

export function NFTMoments({ onMomentCapture, matchEvents }: NFTMomentsProps) {
  const [moments, setMoments] = useState<NFTMoment[]>([
    {
      id: "mbappe-goal-67",
      title: "Mbappé's Lightning Strike",
      description: "Incredible solo run and finish by Kylian Mbappé",
      player: "Kylian Mbappé",
      team: "PSG",
      timestamp: "2024-01-15T20:67:23Z",
      matchMinute: "67'",
      rarity: "Legendary",
      price: 150,
      currency: "PSG",
      image: "/placeholder.svg?height=300&width=400&text=Mbappé+Goal",
      video: "/placeholder-video.mp4",
      stats: {
        views: 12847,
        likes: 3421,
        shares: 892,
        owners: 45,
      },
      attributes: [
        { trait_type: "Speed", value: 98 },
        { trait_type: "Skill", value: 95 },
        { trait_type: "Rarity Score", value: 9.2 },
        { trait_type: "Match Importance", value: "High" },
        { trait_type: "Crowd Reaction", value: "Explosive" },
      ],
      isOwned: true,
      isForSale: false,
      edition: { current: 23, total: 100 },
      createdAt: "2024-01-15T20:67:25Z",
      capturedBy: "Alex_Ultra",
    },
    {
      id: "ter-stegen-save-45",
      title: "Ter Stegen's Miracle Save",
      description: "Impossible reflex save that defied physics",
      player: "Marc-André ter Stegen",
      team: "BARCA",
      timestamp: "2024-01-15T20:45:12Z",
      matchMinute: "45'",
      rarity: "Epic",
      price: 75,
      currency: "BAR",
      image: "/placeholder.svg?height=300&width=400&text=Ter+Stegen+Save",
      video: "/placeholder-video.mp4",
      stats: {
        views: 8934,
        likes: 2156,
        shares: 567,
        owners: 78,
      },
      attributes: [
        { trait_type: "Reflexes", value: 99 },
        { trait_type: "Positioning", value: 94 },
        { trait_type: "Rarity Score", value: 8.7 },
        { trait_type: "Save Difficulty", value: "Impossible" },
        { trait_type: "Impact", value: "Game Changing" },
      ],
      isOwned: false,
      isForSale: true,
      edition: { current: 156, total: 250 },
      createdAt: "2024-01-15T20:45:15Z",
      capturedBy: "SaveMaster99",
    },
    {
      id: "messi-assist-23",
      title: "Messi's Magic Pass",
      description: "Impossible through ball that split the defense",
      player: "Lionel Messi",
      team: "BARCA",
      timestamp: "2024-01-15T20:23:45Z",
      matchMinute: "23'",
      rarity: "Mythic",
      price: 300,
      currency: "CHZ",
      image: "/placeholder.svg?height=300&width=400&text=Messi+Pass",
      video: "/placeholder-video.mp4",
      stats: {
        views: 25678,
        likes: 8934,
        shares: 2341,
        owners: 12,
      },
      attributes: [
        { trait_type: "Vision", value: 100 },
        { trait_type: "Precision", value: 99 },
        { trait_type: "Rarity Score", value: 9.8 },
        { trait_type: "Creativity", value: "Genius" },
        { trait_type: "Historical Value", value: "Legendary" },
      ],
      isOwned: false,
      isForSale: true,
      edition: { current: 3, total: 10 },
      createdAt: "2024-01-15T20:23:48Z",
      capturedBy: "MessiCollector",
    },
  ])

  const [selectedMoment, setSelectedMoment] = useState<NFTMoment | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureProgress, setCaptureProgress] = useState(0)
  const [filter, setFilter] = useState<"all" | "owned" | "marketplace">("all")
  const [rarityFilter, setRarityFilter] = useState<string>("all")

  const rarityColors = {
    Common: "from-gray-400 to-gray-600",
    Rare: "from-blue-400 to-blue-600",
    Epic: "from-purple-400 to-purple-600",
    Legendary: "from-yellow-400 to-orange-500",
    Mythic: "from-pink-400 to-red-500",
  }

  const rarityIcons = {
    Common: "⚪",
    Rare: "🔵",
    Epic: "🟣",
    Legendary: "🟡",
    Mythic: "🔴",
  }

  // Simulation de capture automatique de moments
  useEffect(() => {
    const captureInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% de chance de capturer un moment
        simulateCapture()
      }
    }, 15000) // Vérifier toutes les 15 secondes

    return () => clearInterval(captureInterval)
  }, [])

  const simulateCapture = () => {
    const players = ["Mbappé", "Messi", "Lewandowski", "Neymar", "Pedri", "Hakimi"]
    const actions = ["Goal", "Save", "Assist", "Skill", "Tackle", "Pass"]
    const rarities: NFTMoment["rarity"][] = ["Common", "Rare", "Epic", "Legendary", "Mythic"]

    const randomPlayer = players[Math.floor(Math.random() * players.length)]
    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)]

    const newMoment: NFTMoment = {
      id: `moment-${Date.now()}`,
      title: `${randomPlayer}'s ${randomAction}`,
      description: `Epic ${randomAction.toLowerCase()} by ${randomPlayer}`,
      player: randomPlayer,
      team: Math.random() > 0.5 ? "PSG" : "BARCA",
      timestamp: new Date().toISOString(),
      matchMinute: `${Math.floor(Math.random() * 90)}'`,
      rarity: randomRarity,
      price: Math.floor(Math.random() * 200) + 50,
      currency: Math.random() > 0.5 ? "CHZ" : "PSG",
      image: `/placeholder.svg?height=300&width=400&text=${randomPlayer}+${randomAction}`,
      video: "/placeholder-video.mp4",
      stats: {
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 100),
        owners: Math.floor(Math.random() * 50) + 1,
      },
      attributes: [
        { trait_type: "Skill Level", value: Math.floor(Math.random() * 20) + 80 },
        { trait_type: "Rarity Score", value: Math.random() * 2 + 8 },
        { trait_type: "Impact", value: "High" },
      ],
      isOwned: false,
      isForSale: true,
      edition: {
        current: Math.floor(Math.random() * 100) + 1,
        total: Math.floor(Math.random() * 500) + 100,
      },
      createdAt: new Date().toISOString(),
      capturedBy: "AI_Capture_Bot",
    }

    // Animation de capture
    setIsCapturing(true)
    setCaptureProgress(0)

    const progressInterval = setInterval(() => {
      setCaptureProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsCapturing(false)
          setMoments((prev) => [newMoment, ...prev])
          onMomentCapture?.(newMoment)
          return 0
        }
        return prev + 10
      })
    }, 100)
  }

  const buyMoment = (momentId: string) => {
    setMoments((prev) =>
      prev.map((moment) => (moment.id === momentId ? { ...moment, isOwned: true, isForSale: false } : moment)),
    )
  }

  const sellMoment = (momentId: string) => {
    setMoments((prev) =>
      prev.map((moment) => (moment.id === momentId ? { ...moment, isOwned: false, isForSale: true } : moment)),
    )
  }

  const filteredMoments = moments.filter((moment) => {
    if (filter === "owned" && !moment.isOwned) return false
    if (filter === "marketplace" && !moment.isForSale) return false
    if (rarityFilter !== "all" && moment.rarity !== rarityFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">NFT Moments</h2>
              <p className="text-gray-400">Collectionnez les moments épiques du match</p>
            </div>
          </div>

          <Button
            onClick={simulateCapture}
            disabled={isCapturing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Camera className="w-4 h-4 mr-2" />
            {isCapturing ? "Capture..." : "Capturer Moment"}
          </Button>
        </div>

        {/* Barre de capture */}
        {isCapturing && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-400">Capture en cours...</span>
              <span className="text-sm text-gray-400">{captureProgress}%</span>
            </div>
            <Progress value={captureProgress} className="h-2" />
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-wrap gap-3">
          <div className="flex space-x-2">
            {["all", "owned", "marketplace"].map((filterType) => (
              <Button
                key={filterType}
                size="sm"
                variant={filter === filterType ? "default" : "outline"}
                onClick={() => setFilter(filterType as any)}
                className={filter === filterType ? "bg-purple-500" : "border-gray-700"}
              >
                {filterType === "all" ? "Tous" : filterType === "owned" ? "Mes NFT" : "Marketplace"}
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-8 bg-gray-700" />

          <div className="flex space-x-2">
            {["all", "Common", "Rare", "Epic", "Legendary", "Mythic"].map((rarity) => (
              <Button
                key={rarity}
                size="sm"
                variant={rarityFilter === rarity ? "default" : "outline"}
                onClick={() => setRarityFilter(rarity)}
                className={`${
                  rarityFilter === rarity
                    ? `bg-gradient-to-r ${rarity !== "all" ? rarityColors[rarity as keyof typeof rarityColors] : "bg-purple-500"}`
                    : "border-gray-700"
                }`}
              >
                {rarity !== "all" && rarityIcons[rarity as keyof typeof rarityIcons]}{" "}
                {rarity === "all" ? "Toutes" : rarity}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grille des moments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMoments.map((moment) => (
          <Card
            key={moment.id}
            className={`bg-gradient-to-br from-[#1a1a1a] to-[#2a1a2a] border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              moment.isOwned ? "border-green-500/50" : "border-gray-800"
            }`}
            onClick={() => setSelectedMoment(moment)}
          >
            {/* Image/Vidéo */}
            <div className="relative">
              <img
                src={moment.image || "/placeholder.svg"}
                alt={moment.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              {/* Badges overlay */}
              <div className="absolute top-3 left-3 flex space-x-2">
                <Badge className={`bg-gradient-to-r ${rarityColors[moment.rarity]} text-white`}>
                  {rarityIcons[moment.rarity]} {moment.rarity}
                </Badge>
                {moment.isOwned && (
                  <Badge className="bg-green-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Possédé
                  </Badge>
                )}
              </div>

              {/* Stats overlay */}
              <div className="absolute bottom-3 right-3 bg-black/70 rounded-lg px-2 py-1">
                <div className="flex items-center space-x-2 text-xs text-white">
                  <Eye className="w-3 h-3" />
                  <span>{moment.stats.views.toLocaleString()}</span>
                  <Heart className="w-3 h-3" />
                  <span>{moment.stats.likes.toLocaleString()}</span>
                </div>
              </div>

              {/* Édition limitée */}
              <div className="absolute top-3 right-3 bg-black/70 rounded-lg px-2 py-1">
                <span className="text-xs text-white">
                  #{moment.edition.current}/{moment.edition.total}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white truncate">{moment.title}</h3>
                <Badge className={`${moment.team === "PSG" ? "bg-blue-600" : "bg-red-600"} text-white`}>
                  {moment.team}
                </Badge>
              </div>

              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{moment.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">
                  <span>{moment.player}</span> • <span>{moment.matchMinute}</span>
                </div>
                <div className="text-sm text-gray-500">Par {moment.capturedBy}</div>
              </div>

              {/* Prix et actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-purple-400">
                    {moment.price} {moment.currency}
                  </span>
                  <span className="text-xs text-gray-500">(~${(moment.price * 0.1).toFixed(2)})</span>
                </div>

                <div className="flex space-x-2">
                  {moment.isOwned ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        sellMoment(moment.id)
                      }}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Vendre
                    </Button>
                  ) : moment.isForSale ? (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        buyMoment(moment.id)
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Acheter
                    </Button>
                  ) : (
                    <Badge className="bg-gray-600 text-white">Non disponible</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de détail */}
      {selectedMoment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Badge className={`bg-gradient-to-r ${rarityColors[selectedMoment.rarity]} text-white`}>
                    {rarityIcons[selectedMoment.rarity]} {selectedMoment.rarity}
                  </Badge>
                  <h2 className="text-2xl font-bold text-white">{selectedMoment.title}</h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedMoment(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Média */}
                <div className="space-y-4">
                  <img
                    src={selectedMoment.image || "/placeholder.svg"}
                    alt={selectedMoment.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir Vidéo
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-700 bg-transparent">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-700 bg-transparent">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Détails */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                    <p className="text-gray-400">{selectedMoment.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Joueur</span>
                      <p className="text-white font-medium">{selectedMoment.player}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Équipe</span>
                      <p className="text-white font-medium">{selectedMoment.team}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Minute</span>
                      <p className="text-white font-medium">{selectedMoment.matchMinute}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Édition</span>
                      <p className="text-white font-medium">
                        #{selectedMoment.edition.current}/{selectedMoment.edition.total}
                      </p>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Statistiques</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-400">Vues</span>
                        </div>
                        <p className="text-lg font-bold text-white">{selectedMoment.stats.views.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-400">Likes</span>
                        </div>
                        <p className="text-lg font-bold text-white">{selectedMoment.stats.likes.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Share2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">Partages</span>
                        </div>
                        <p className="text-lg font-bold text-white">{selectedMoment.stats.shares.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-400">Propriétaires</span>
                        </div>
                        <p className="text-lg font-bold text-white">{selectedMoment.stats.owners}</p>
                      </div>
                    </div>
                  </div>

                  {/* Attributs */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Attributs</h3>
                    <div className="space-y-2">
                      {selectedMoment.attributes.map((attr, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                          <span className="text-sm text-gray-400">{attr.trait_type}</span>
                          <span className="text-sm text-white font-medium">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-purple-400">
                          {selectedMoment.price} {selectedMoment.currency}
                        </span>
                        <p className="text-sm text-gray-500">~${(selectedMoment.price * 0.1).toFixed(2)} USD</p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {selectedMoment.isOwned ? (
                        <>
                          <Button
                            onClick={() => sellMoment(selectedMoment.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            Mettre en Vente
                          </Button>
                          <Button variant="outline" className="border-gray-700 bg-transparent">
                            <Gift className="w-4 h-4 mr-2" />
                            Offrir
                          </Button>
                        </>
                      ) : selectedMoment.isForSale ? (
                        <Button
                          onClick={() => buyMoment(selectedMoment.id)}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Acheter Maintenant
                        </Button>
                      ) : (
                        <Button disabled className="flex-1 bg-gray-600">
                          Non Disponible
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
