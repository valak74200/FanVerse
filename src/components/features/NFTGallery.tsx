import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Star,
  Sparkles,
  Heart,
  ShoppingCart,
  TrendingUp,
  Clock,
  Coins,
  Search,
  Grid,
  List,
  Diamond
} from "lucide-react"

interface NFT {
  id: string
  title: string
  description: string
  player: string
  team: "PSG" | "BARCA"
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  price: number
  currency: "CHZ" | "PSG" | "BAR"
  image: string
  likes: number
  emotion: string
  isOwned: boolean
  isForSale: boolean
}

interface NFTGalleryProps {
  nfts: NFT[]
  onBuy?: (nftId: string) => void
  onSell?: (nftId: string) => void
  onLike?: (nftId: string) => void
}

export function NFTGallery({ 
  nfts,
  onBuy,
  onSell,
  onLike
}: NFTGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [rarityFilter, setRarityFilter] = useState<string>("all")

  const rarityColors = {
    Common: "from-gray-400 to-gray-600",
    Rare: "from-blue-400 to-blue-600",
    Epic: "from-purple-400 to-purple-600",
    Legendary: "from-yellow-400 to-orange-500",
    Mythic: "from-pink-400 to-red-500",
  }

  const filteredNFTs = nfts.filter(nft => {
    // Apply search filter
    if (searchTerm && !nft.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !nft.player.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    
    // Apply rarity filter
    if (rarityFilter !== "all" && nft.rarity !== rarityFilter) {
      return false
    }
    
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher NFT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/30 border-gray-700 text-white"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="p-2 bg-black/30 border border-gray-700 rounded text-white"
          >
            <option value="all">Toutes raretés</option>
            <option value="Common">Common</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
            <option value="Mythic">Mythic</option>
          </select>
          
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="border-gray-700 text-gray-400 hover:text-white"
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* NFT Gallery */}
      <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
        {filteredNFTs.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className={`overflow-hidden bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-2 ${
              nft.isOwned ? "border-green-500/50" : "border-gray-800"
            } hover:border-primary/40 transition-all duration-300`}>
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary/20 to-warning/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Diamond className="w-24 h-24 text-white/20" />
                </div>
                <Badge className={`absolute top-4 right-4 bg-gradient-to-r ${rarityColors[nft.rarity]} text-white border-0`}>
                  {nft.rarity}
                </Badge>
                <Badge className="absolute top-4 left-4 bg-black/60 text-white border-0">
                  {nft.emotion}
                </Badge>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg mb-1">{nft.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{nft.player}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Prix actuel</p>
                    <p className="text-xl font-bold text-warning">{nft.price} {nft.currency}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-400 cursor-pointer" onClick={() => onLike?.(nft.id)} />
                    <span className="text-sm">{nft.likes}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {nft.isOwned ? (
                    <Button
                      onClick={() => onSell?.(nft.id)}
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      variant="outline"
                    >
                      Vendre
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onBuy?.(nft.id)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Acheter
                    </Button>
                  )}
                  <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
                    Détails
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredNFTs.length === 0 && (
        <Card className="bg-gray-900/95 border-gray-800 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Aucun NFT trouvé</h3>
          <p className="text-gray-400">Essayez de modifier vos filtres de recherche</p>
        </Card>
      )}
    </div>
  )
}