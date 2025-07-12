"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeaderChiliz } from "@/components/ui/header-chiliz"
import { NavigationChiliz } from "@/components/ui/navigation-chiliz"
import Link from "next/link"
import { 
  Star,
  Sparkles,
  Heart,
  ShoppingCart,
  TrendingUp,
  Clock,
  Coins,
  ArrowLeft,
  Settings,
  Grid,
  List,
  Diamond
} from "lucide-react"

export default function NFTPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userTokens, setUserTokens] = useState(1250)
  const [emotionLevel, setEmotionLevel] = useState(45)
  const [activeView, setActiveView] = useState("nft")
  const [viewMode, setViewMode] = useState("grid")
  
  const liveStats = {
    totalFans: 47829,
    activeUsers: 2847,
    totalBets: 156,
    totalVolume: 89420
  }

  const nftCollections = [
    {
      id: 1,
      name: "Goal Celebration #23",
      collection: "Mbappé Moments",
      price: 500,
      rarity: "Legendary",
      image: "/api/placeholder/300/300",
      likes: 342,
      emotion: "Joy"
    },
    {
      id: 2,
      name: "Victory Roar #12",
      collection: "PSG Ultras",
      price: 250,
      rarity: "Epic",
      image: "/api/placeholder/300/300",
      likes: 218,
      emotion: "Hype"
    },
    {
      id: 3,
      name: "Champions Night #45",
      collection: "Historic Moments",
      price: 1200,
      rarity: "Mythic",
      image: "/api/placeholder/300/300",
      likes: 567,
      emotion: "Pride"
    },
    {
      id: 4,
      name: "Tifo Masterpiece #8",
      collection: "Fan Art",
      price: 150,
      rarity: "Rare",
      image: "/api/placeholder/300/300",
      likes: 124,
      emotion: "Passion"
    },
    {
      id: 5,
      name: "Penalty Save #67",
      collection: "Goalkeeper Glory",
      price: 350,
      rarity: "Epic",
      image: "/api/placeholder/300/300",
      likes: 289,
      emotion: "Tension"
    },
    {
      id: 6,
      name: "Derby Victory #3",
      collection: "Rivalry Moments",
      price: 800,
      rarity: "Legendary",
      image: "/api/placeholder/300/300",
      likes: 445,
      emotion: "Triumph"
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Mythic": return "from-purple-400 to-pink-400"
      case "Legendary": return "from-yellow-400 to-orange-400"
      case "Epic": return "from-blue-400 to-purple-400"
      case "Rare": return "from-green-400 to-blue-400"
      default: return "from-gray-400 to-gray-500"
    }
  }

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
            if (view !== "nft") {
              window.location.href = view === "stadium" ? "/stadium" : view === "tribune" ? "/tribune" : view === "social" ? "/social" : "/betting"
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-warning to-emotion-joy bg-clip-text text-transparent">
                MoodNFT
              </h1>
              <p className="text-text-secondary mt-2">Collections NFT exclusives basées sur les émotions des fans</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
              <Button className="btn-chiliz">
                <Sparkles className="w-4 h-4 mr-2" />
                Créer NFT
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Statistiques du marché */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Volume total</p>
                <p className="text-2xl font-bold text-warning">125.4K CHZ</p>
              </div>
              <Coins className="w-8 h-8 text-warning/20" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">NFTs créés</p>
                <p className="text-2xl font-bold text-success">1,847</p>
              </div>
              <Star className="w-8 h-8 text-success/20" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Propriétaires</p>
                <p className="text-2xl font-bold text-primary">892</p>
              </div>
              <Heart className="w-8 h-8 text-primary/20" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Prix moyen</p>
                <p className="text-2xl font-bold text-purple-400">450 CHZ</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400/20" />
            </div>
          </Card>
        </motion.div>

        {/* Galerie NFT */}
        <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
          {nftCollections.map((nft, index) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all">
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-warning/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Diamond className="w-24 h-24 text-white/20" />
                  </div>
                  <Badge className={`absolute top-4 right-4 bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white border-0`}>
                    {nft.rarity}
                  </Badge>
                  <Badge className="absolute top-4 left-4 bg-black/60 text-white border-0">
                    {nft.emotion}
                  </Badge>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                  <p className="text-sm text-text-secondary mb-4">{nft.collection}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-text-secondary">Prix actuel</p>
                      <p className="text-xl font-bold text-warning">{nft.price} CHZ</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span className="text-sm">{nft.likes}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-gradient-to-r from-primary to-warning hover:opacity-90">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Acheter
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Détails
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bouton voir plus */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Charger plus de NFTs
          </Button>
        </div>
      </main>
    </div>
  )
} 