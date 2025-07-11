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
  Bell,
  Gamepad2,
  TrendingUp,
  Calendar,
  Star,
  Zap,
  Sparkles,
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
    },
    {
      id: "groups",
      label: "Groupes",
      icon: Users,
      badge: "3",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageCircle,
      badge: notifications > 0 ? notifications.toString() : null,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "tournaments",
      label: "Tournois",
      icon: Trophy,
      badge: "LIVE",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "betting",
      label: "Paris",
      icon: TrendingUp,
      badge: null,
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "nft-moments",
      label: "NFT Moments",
      icon: Sparkles,
      badge: "HOT",
      gradient: "from-pink-500 to-purple-500",
    },
    {
      id: "games",
      label: "Mini-Jeux",
      icon: Gamepad2,
      badge: "NEW",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: "calendar",
      label: "Calendrier",
      icon: Calendar,
      badge: null,
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      id: "leaderboard",
      label: "Classement",
      icon: Star,
      badge: null,
      gradient: "from-amber-500 to-yellow-500",
    },
  ]

  const quickActions = [
    {
      id: "create-group",
      label: "Créer Groupe",
      icon: Plus,
      action: () => console.log("Create group"),
    },
    {
      id: "search",
      label: "Rechercher",
      icon: Search,
      action: () => console.log("Search"),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: notifications,
      action: () => console.log("Notifications"),
    },
  ]

  return (
    <Card className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-gray-800 h-full">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {isExpanded && <h2 className="font-bold text-white">FanVerse</h2>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions rapides */}
        {isExpanded && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Actions Rapides</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="relative border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent text-white flex flex-col h-16 p-2"
                >
                  <action.icon className="w-4 h-4 mb-1" />
                  <span className="text-xs">{action.label}</span>
                  {action.badge && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-0 h-4">
                      {action.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator className="mb-6 bg-gray-700" />

        {/* Menu principal */}
        <div className="space-y-2">
          {isExpanded && <h3 className="text-sm font-medium text-gray-400 mb-3">Navigation</h3>}

          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onSectionChange(item.id)}
              className={`w-full justify-start relative transition-all duration-200 ${
                activeSection === item.id
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isExpanded ? "mr-3" : ""}`} />
              {isExpanded && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge
                      className={`ml-2 text-xs ${
                        item.badge === "LIVE"
                          ? "bg-red-500 animate-pulse"
                          : item.badge === "NEW"
                            ? "bg-green-500"
                            : "bg-blue-500"
                      } text-white`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}

              {/* Indicateur actif */}
              {activeSection === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
              )}
            </Button>
          ))}
        </div>

        {/* Statut en ligne */}
        {isExpanded && (
          <div className="mt-6 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">En ligne</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">2,847 fans connectés</div>
          </div>
        )}
      </div>
    </Card>
  )
}
