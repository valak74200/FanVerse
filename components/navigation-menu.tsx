"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Users,
  MessageCircle,
  Trophy,
  Settings,
  Plus,
  Search,
  Gamepad2,
  TrendingUp,
  Star,
  Zap,
  Sparkles,
  ShoppingCart,
  Wallet,
  BarChart3,
} from "lucide-react"

interface NavigationMenuProps {
  activeSection: string
  onSectionChange: (section: string) => void
  notifications: number
}

export function NavigationMenu({ activeSection, onSectionChange, notifications }: NavigationMenuProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const menuItems = [
    {
      id: "stadium",
      label: "Stade",
      icon: Home,
      badge: null,
      gradient: "from-blue-500 to-cyan-500",
      description: "Expérience immersive 3D",
    },
    {
      id: "groups",
      label: "Communautés",
      icon: Users,
      badge: "3",
      gradient: "from-purple-500 to-pink-500",
      description: "Rejoignez vos tribus",
    },
    {
      id: "chat",
      label: "Chat Social",
      icon: MessageCircle,
      badge: notifications > 0 ? notifications.toString() : null,
      gradient: "from-green-500 to-emerald-500",
      description: "Discussions en temps réel",
    },
    {
      id: "nft-moments",
      label: "NFT Moments",
      icon: Sparkles,
      badge: "HOT",
      gradient: "from-pink-500 to-purple-500",
      description: "Collectionnez l'histoire",
    },
    {
      id: "nft-marketplace",
      label: "Marketplace",
      icon: ShoppingCart,
      badge: "NEW",
      gradient: "from-orange-500 to-red-500",
      description: "Tradez vos NFT",
    },
    {
      id: "nft-collection",
      label: "Collection",
      icon: Star,
      badge: null,
      gradient: "from-yellow-500 to-orange-500",
      description: "Vos trésors numériques",
    },
    {
      id: "betting",
      label: "Paris Web3",
      icon: TrendingUp,
      badge: null,
      gradient: "from-red-500 to-pink-500",
      description: "Prédictions décentralisées",
    },
    {
      id: "tournaments",
      label: "Tournois",
      icon: Trophy,
      badge: "LIVE",
      gradient: "from-yellow-500 to-orange-500",
      description: "Compétitions épiques",
    },
    {
      id: "games",
      label: "Mini-Jeux",
      icon: Gamepad2,
      badge: "P2E",
      gradient: "from-indigo-500 to-purple-500",
      description: "Play-to-Earn",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: null,
      gradient: "from-teal-500 to-cyan-500",
      description: "Données en temps réel",
    },
  ]

  const quickActions = [
    {
      id: "create-group",
      label: "Créer",
      icon: Plus,
      gradient: "from-purple-500 to-pink-500",
      action: () => console.log("Create group"),
    },
    {
      id: "search",
      label: "Explorer",
      icon: Search,
      gradient: "from-blue-500 to-cyan-500",
      action: () => console.log("Search"),
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: Wallet,
      gradient: "from-green-500 to-emerald-500",
      badge: "2.4K",
      action: () => console.log("Wallet"),
    },
  ]

  return (
    <Card className="bg-gradient-to-b from-[#1a1a1a]/95 to-[#0a0a0a]/95 backdrop-blur-xl border-purple-500/20 h-full overflow-hidden">
      <div className="p-4">
        {/* Header avec effet glassmorphisme */}
        <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {isExpanded && (
              <div>
                <h2 className="font-bold text-white text-lg">FanVerse</h2>
                <div className="text-xs text-purple-400">Web3 Sports</div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white hover:bg-purple-500/20 rounded-lg"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions rapides avec design Web3 */}
        {isExpanded && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-purple-400" />
              Actions Rapides
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className={`relative border-gray-700/50 hover:border-purple-500/50 bg-gradient-to-r ${action.gradient}/10 hover:${action.gradient}/20 text-white flex flex-col h-20 p-2 rounded-xl transition-all duration-300 hover:scale-105 group`}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                  {action.badge && (
                    <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1 min-w-0 h-4 rounded-full">
                      {action.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator className="mb-6 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        {/* Menu principal avec design futuriste */}
        <div className="space-y-2">
          {isExpanded && (
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center">
              <Star className="w-4 h-4 mr-2 text-purple-400" />
              Navigation
            </h3>
          )}

          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <Button
                variant={activeSection === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onSectionChange(item.id)}
                className={`w-full justify-start relative transition-all duration-300 rounded-xl ${
                  activeSection === item.id
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-purple-500/25 scale-105`
                    : "text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:scale-102"
                } ${isExpanded ? "h-14 px-4" : "h-12 px-2"}`}
              >
                <div className={`flex items-center ${isExpanded ? "space-x-3" : "justify-center"}`}>
                  <div className={`${activeSection === item.id ? "animate-pulse" : ""}`}>
                    <item.icon className="w-5 h-5" />
                  </div>

                  {isExpanded && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>

                      {item.badge && (
                        <Badge
                          className={`ml-2 text-xs ${
                            item.badge === "LIVE"
                              ? "bg-red-500 animate-pulse"
                              : item.badge === "NEW"
                                ? "bg-green-500"
                                : item.badge === "HOT"
                                  ? "bg-orange-500 animate-bounce"
                                  : item.badge === "P2E"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                          } text-white shadow-lg`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>

                {/* Indicateur actif avec effet néon */}
                {activeSection === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white via-purple-300 to-white rounded-r-full shadow-lg shadow-white/50" />
                )}
              </Button>

              {/* Tooltip pour mode réduit */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Statut en ligne avec design Web3 */}
        {isExpanded && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
              <div>
                <span className="text-sm text-green-400 font-medium">Connecté au Web3</span>
                <div className="text-xs text-gray-400">2,847 fans en ligne</div>
              </div>
            </div>

            {/* Barre de progression de l'activité */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Activité réseau</span>
                <span>98%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full w-[98%] animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
