"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Star, Clock, Users, Flame, ShoppingCart, Eye, Heart } from "lucide-react"

interface MarketplaceListing {
  id: string
  nftId: string
  title: string
  player: string
  team: "PSG" | "BARCA"
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  price: number
  currency: "CHZ" | "PSG" | "BAR"
  previousPrice?: number
  seller: string
  timeLeft: string
  image: string
  stats: {
    views: number
    likes: number
    watchers: number
  }
  isHot: boolean
  isNew: boolean
  priceHistory: Array<{ price: number; date: string }>
}

export function NFTMarketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([
    {
      id: "listing-1",
      nftId: "messi-goal-89",
      title: "Messi's Last Minute Winner",
      player: "Lionel Messi",
      team: "BARCA",
      rarity: "Mythic",
      price: 500,
      currency: "CHZ",
      previousPrice: 450,
      seller: "MessiCollector",
      timeLeft: "2h 34m",
      image: "/placeholder.svg?height=300&width=400&text=Messi+Winner",
      stats: {
        views: 15678,
        likes: 4523,
        watchers: 89,
      },
      isHot: true,
      isNew: false,
      priceHistory: [
        { price: 400, date: "2024-01-10" },
        { price: 450, date: "2024-01-12" },
        { price: 500, date: "2024-01-15" },
      ],
    },
    {
      id: "listing-2",
      nftId: "neymar-skill-56",
      title: "Neymar's Rainbow Flick",
      player: "Neymar Jr",
      team: "PSG",
      rarity: "Legendary",
      price: 200,
      currency: "PSG",
      seller: "SkillMaster",
      timeLeft: "1d 12h",
      image: "/placeholder.svg?height=300&width=400&text=Neymar+Skill",
      stats: {
        views: 8934,
        likes: 2156,
        watchers: 45,
      },
      isHot: false,
      isNew: true,
      priceHistory: [
        { price: 180, date: "2024-01-13" },
        { price: 200, date: "2024-01-15" },
      ],
    },
    {
      id: "listing-3",
      nftId: "pedri-pass-78",
      title: "Pedri's Perfect Through Ball",
      player: "Pedri",
      team: "BARCA",
      rarity: "Epic",
      price: 125,
      currency: "BAR",
      previousPrice: 140,
      seller: "VisionMaster",
      timeLeft: "6h 45m",
      image: "/placeholder.svg?height=300&width=400&text=Pedri+Pass",
      stats: {
        views: 5432,
        likes: 1234,
        watchers: 23,
      },
      isHot: false,
      isNew: false,
      priceHistory: [
        { price: 150, date: "2024-01-08" },
        { price: 140, date: "2024-01-10" },
        { price: 125, date: "2024-01-15" },
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"price" | "time" | "popularity">("popularity")
  const [filterRarity, setFilterRarity] = useState<string>("all")
  const [filterTeam, setFilterTeam] = useState<string>("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  const rarityColors = {
    Common: "from-gray-400 to-gray-600",
    Rare: "from-blue-400 to-blue-600",
    Epic: "from-purple-400 to-purple-600",
    Legendary: "from-yellow-400 to-orange-500",
    Mythic: "from-pink-400 to-red-500",
  }

  const filteredListings = listings
    .filter((listing) => {
      if (
        searchTerm &&
        !listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !listing.player.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false
      if (filterRarity !== "all" && listing.rarity !== filterRarity) return false
      if (filterTeam !== "all" && listing.team !== filterTeam) return false
      if (priceRange.min && listing.price < Number.parseInt(priceRange.min)) return false
      if (priceRange.max && listing.price > Number.parseInt(priceRange.max)) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "time":
          return a.timeLeft.localeCompare(b.timeLeft)
        case "popularity":
          return b.stats.views - a.stats.views
        default:
          return 0
      }
    })

  const buyNFT = (listingId: string) => {
    setListings((prev) => prev.filter((listing) => listing.id !== listingId))
  }

  const addToWatchlist = (listingId: string) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === listingId
          ? { ...listing, stats: { ...listing.stats, watchers: listing.stats.watchers + 1 } }
          : listing,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Marketplace NFT</h2>
            <p className="text-gray-400">Découvrez et achetez des moments uniques</p>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% cette semaine
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{listings.length} NFT disponibles</Badge>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher NFT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="popularity">Plus populaires</option>
            <option value="price">Prix croissant</option>
            <option value="time">Fin d'enchère</option>
          </select>

          {/* Filtre rareté */}
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="all">Toutes raretés</option>
            <option value="Common">Common</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
            <option value="Mythic">Mythic</option>
          </select>

          {/* Filtre équipe */}
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="all">Toutes équipes</option>
            <option value="PSG">PSG</option>
            <option value="BARCA">Barcelona</option>
          </select>
        </div>

        {/* Filtres de prix */}
        <div className="flex items-center space-x-4 mt-4">
          <span className="text-sm text-gray-400">Prix:</span>
          <Input
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
            className="w-24 bg-gray-800 border-gray-700 text-white"
          />
          <span className="text-gray-400">-</span>
          <Input
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
            className="w-24 bg-gray-800 border-gray-700 text-white"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPriceRange({ min: "", max: "" })}
            className="border-gray-700 text-gray-400"
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Statistiques du marché */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Volume 24h</p>
              <p className="text-lg font-bold text-white">2,847 CHZ</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Prix moyen</p>
              <p className="text-lg font-bold text-white">156 CHZ</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Propriétaires</p>
              <p className="text-lg font-bold text-white">1,234</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">NFT vendus</p>
              <p className="text-lg font-bold text-white">89</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Grille des NFT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredListings.map((listing) => (
          <Card
            key={listing.id}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a2a] border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={listing.image || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                <Badge className={`bg-gradient-to-r ${rarityColors[listing.rarity]} text-white`}>
                  {listing.rarity}
                </Badge>
                {listing.isHot && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    <Flame className="w-3 h-3 mr-1" />
                    HOT
                  </Badge>
                )}
                {listing.isNew && <Badge className="bg-green-500/20 text-green-400 border-green-500/30">NEW</Badge>}
              </div>

              {/* Temps restant */}
              <div className="absolute top-3 right-3 bg-black/70 rounded-lg px-2 py-1">
                <div className="flex items-center space-x-1 text-xs text-white">
                  <Clock className="w-3 h-3" />
                  <span>{listing.timeLeft}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="absolute bottom-3 left-3 bg-black/70 rounded-lg px-2 py-1">
                <div className="flex items-center space-x-2 text-xs text-white">
                  <Eye className="w-3 h-3" />
                  <span>{listing.stats.views.toLocaleString()}</span>
                  <Heart className="w-3 h-3" />
                  <span>{listing.stats.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-sm truncate">{listing.title}</h3>
                <Badge className={`${listing.team === "PSG" ? "bg-blue-600" : "bg-red-600"} text-white text-xs`}>
                  {listing.team}
                </Badge>
              </div>

              <p className="text-sm text-gray-400 mb-3">{listing.player}</p>

              {/* Prix */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-purple-400">
                      {listing.price} {listing.currency}
                    </span>
                    {listing.previousPrice && (
                      <span
                        className={`text-xs ${
                          listing.price > listing.previousPrice ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {listing.price > listing.previousPrice ? "+" : ""}
                        {(((listing.price - listing.previousPrice) / listing.previousPrice) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Par {listing.seller}</p>
                </div>
              </div>

              {/* Watchers */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>{listing.stats.watchers} observateurs</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => buyNFT(listing.id)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Acheter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addToWatchlist(listing.id)}
                  className="border-gray-700 text-gray-400 hover:text-white"
                >
                  <Star className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card className="bg-[#1a1a1a] border-gray-800 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Aucun NFT trouvé</h3>
          <p className="text-gray-400">Essayez de modifier vos filtres de recherche</p>
        </Card>
      )}
    </div>
  )
}
