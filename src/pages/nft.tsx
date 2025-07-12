import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { NFTGallery } from "@/components/features/NFTGallery"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users,
  TrendingUp,
  Star,
  Coins
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

export default function NFTPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userTokens, setUserTokens] = useState(1250)
  const [emotionLevel, setEmotionLevel] = useState(45)
  
  const liveStats = {
    totalFans: 47829,
    activeUsers: 2847,
    totalBets: 156,
    totalVolume: 89420
  }

  const nftCollections = [
    {
      id: "1",
      title: "Goal Celebration #23",
      description: "Mbappé's incredible celebration after scoring the winning goal",
      player: "Kylian Mbappé",
      team: "PSG",
      rarity: "Legendary",
      price: 500,
      currency: "CHZ",
      image: "/api/placeholder/300/300",
      likes: 342,
      emotion: "Joy",
      isOwned: false,
      isForSale: true
    },
    {
      id: "2",
      title: "Victory Roar #12",
      description: "The crowd's reaction to the last-minute equalizer",
      player: "PSG Ultras",
      team: "PSG",
      rarity: "Epic",
      price: 250,
      currency: "CHZ",
      image: "/api/placeholder/300/300",
      likes: 218,
      emotion: "Hype",
      isOwned: true,
      isForSale: false
    },
    {
      id: "3",
      title: "Champions Night #45",
      description: "Historic moment from the Champions League final",
      player: "Team Celebration",
      team: "PSG",
      rarity: "Mythic",
      price: 1200,
      currency: "CHZ",
      image: "/api/placeholder/300/300",
      likes: 567,
      emotion: "Pride",
      isOwned: false,
      isForSale: true
    },
    {
      id: "4",
      title: "Tifo Masterpiece #8",
      description: "The incredible fan-made tifo covering the entire stand",
      player: "Fan Art",
      team: "PSG",
      rarity: "Rare",
      price: 150,
      currency: "CHZ",
      image: "/api/placeholder/300/300",
      likes: 124,
      emotion: "Passion",
      isOwned: false,
      isForSale: true
    },
    {
      id: "5",
      title: "Penalty Save #67",
      description: "The goalkeeper's incredible save during the penalty shootout",
      player: "Gianluigi Donnarumma",
      team: "PSG",
      rarity: "Epic",
      price: 350,
      currency: "CHZ",
      image: "/api/placeholder/300/300",
      likes: 289,
      emotion: "Tension",
      isOwned: true,
      isForSale: false
    },
    {
      id: "6",
      title: "Derby Victory #3",
      description: "The moment of triumph in the heated local derby",
      player: "Team Celebration",
      team: "PSG",
      rarity: "Legendary",
      price: 800,
      currency: "CHZ",
      image: "/api/placeholder/300/300",
      likes: 445,
      emotion: "Triumph",
      isOwned: false,
      isForSale: true
    }
  ]

  const handleBuyNFT = (nftId: string) => {
    // Simuler l'achat d'un NFT
    const nft = nftCollections.find(n => n.id === nftId)
    if (nft && !nft.isOwned && nft.price <= userTokens) {
      setUserTokens(prev => prev - nft.price)
      console.log(`NFT acheté: ${nft.title} pour ${nft.price} ${nft.currency}`)
    }
  }

  const handleSellNFT = (nftId: string) => {
    // Simuler la vente d'un NFT
    const nft = nftCollections.find(n => n.id === nftId)
    if (nft && nft.isOwned) {
      setUserTokens(prev => prev + nft.price)
      console.log(`NFT vendu: ${nft.title} pour ${nft.price} ${nft.currency}`)
    }
  }

  const handleLikeNFT = (nftId: string) => {
    console.log(`NFT aimé: ${nftId}`)
  }

  return (
    <MainLayout
      activeView="nft"
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-warning to-emotion-joy bg-clip-text text-transparent">
                MoodNFT
              </h1>
              <p className="text-text-secondary mt-2">Collections NFT exclusives basées sur les émotions des fans</p>
            </div>
          </div>
        </div>

        {/* Statistiques du marché */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Volume total</p>
                <p className="text-lg font-bold text-warning">125.4K CHZ</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-400">NFTs créés</p>
                <p className="text-lg font-bold text-success">1,847</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Propriétaires</p>
                <p className="text-lg font-bold text-primary">892</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Prix moyen</p>
                <p className="text-lg font-bold text-purple-400">450 CHZ</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Galerie NFT */}
        <NFTGallery 
          nfts={nftCollections}
          onBuy={handleBuyNFT}
          onSell={handleSellNFT}
          onLike={handleLikeNFT}
        />
      </div>
    </MainLayout>
  )
}