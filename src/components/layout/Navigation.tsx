import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Users, 
  Zap,
  Star,
  Home
} from "lucide-react"

interface NavigationTab {
  id: string
  label: string
  icon: any
  color: string
  description: string
  badge?: string
  isNew?: boolean
}

interface NavigationProps {
  activeView: string
  onViewChange: (view: string) => void
  className?: string
}

export function Navigation({ activeView, onViewChange, className = "" }: NavigationProps) {
  const tabs: NavigationTab[] = [
    { 
      id: "home", 
      label: "Accueil", 
      icon: Home, 
      color: "from-primary to-warning", 
      description: "Dashboard principal"
    },
    { 
      id: "stadium", 
      label: "MetaTribune", 
      icon: Trophy, 
      color: "from-psg-blue to-psg-red", 
      description: "Stade 3D immersif",
      badge: "LIVE"
    },
    { 
      id: "social", 
      label: "CrewMates", 
      icon: Users, 
      color: "from-primary to-warning", 
      description: "Communauté fans",
      badge: "2.8K"
    },
    { 
      id: "betting", 
      label: "FanPulse", 
      icon: Zap, 
      color: "from-success to-primary", 
      description: "Paris & Émotions",
      isNew: true
    },
    { 
      id: "nft", 
      label: "MoodNFT", 
      icon: Star, 
      color: "from-warning to-emotion-joy", 
      description: "Collection NFT",
      badge: "NEW"
    }
  ]

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={`relative z-40 p-4 md:p-6 ${className}`}
    >
      {/* Navigation Desktop */}
      <div className="hidden md:flex justify-center space-x-4">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              onClick={() => onViewChange(tab.id)}
              className={`
                relative px-8 py-4 rounded-2xl border-0 transition-all duration-300 group overflow-hidden
                ${activeView === tab.id 
                  ? `bg-gradient-to-r ${tab.color} shadow-chiliz scale-105` 
                  : 'bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-primary/20 hover:border-primary/40'
                }
              `}
            >
              <div className="flex items-center space-x-3 relative z-10">
                <tab.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </div>
              </div>
              
              {/* Badge */}
              {tab.badge && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 animate-pulse">
                  {tab.badge}
                </Badge>
              )}
              
              {/* Indicateur NEW */}
              {tab.isNew && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
              )}
              
              {/* Effet de survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {activeView === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Navigation Mobile */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              className="relative flex-shrink-0"
            >
              <Button
                onClick={() => onViewChange(tab.id)}
                className={`
                  relative px-4 py-3 rounded-xl border-0 transition-all duration-300 min-w-[120px]
                  ${activeView === tab.id 
                    ? `bg-gradient-to-r ${tab.color} shadow-chiliz` 
                    : 'bg-black/50 border border-primary/20'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    <tab.icon className="w-4 h-4" />
                    {tab.badge && (
                      <Badge className="bg-primary text-white text-xs px-1 py-0.5">
                        {tab.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs font-medium">{tab.label}</div>
                </div>
                
                {tab.isNew && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse"></div>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}