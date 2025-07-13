"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Twitter, 
  MessageSquare, 
  Youtube, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Shield, 
  Users, 
  Trophy,
  Zap,
  Globe,
  Heart,
  Star,
  Bell,
  Settings,
  ChevronDown,
  Wallet,
  Activity
} from "lucide-react"
import { useSoundEffects } from "./SoundEffects"

const navItems = [
  { name: "Discover", icon: Globe, href: "#discover" },
  { name: "Developers", icon: Shield, href: "#developers" },
  { name: "Ecosystem", icon: Users, href: "#ecosystem" },
  { name: "Community", icon: Heart, href: "#community" }
]

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
  { name: "Discord", icon: MessageSquare, href: "#", color: "hover:text-purple-400" },
  { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-400" }
]

export default function Header({ onLaunch }: { onLaunch: () => void }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)
  const { playClick, playHover } = useSoundEffects()

  // Gérer le scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mettre à jour l'heure
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Gérer le statut en ligne
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleItemClick = (item: string) => {
    soundEnabled && playClick()
    setHoveredItem(null)
    setMobileMenuOpen(false)
  }

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled)
    playClick()
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (notifications > 0) {
      setNotifications(0)
    }
  }

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b border-primary/30 shadow-2xl shadow-primary/10' 
            : 'bg-black/30 backdrop-blur-sm border-b border-primary/10'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Effets de fond animés */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent-comp/5 pointer-events-none"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo et branding */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-8"
            >
              <motion.div 
                className="flex items-center space-x-3 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => soundEnabled && playHover()}
              >
                <div className="relative">
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-br from-primary to-accent-comp rounded-xl flex items-center justify-center shadow-lg"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                <div>
                  <span className="font-bold text-xl bg-gradient-to-r from-white via-primary to-accent-comp bg-clip-text text-transparent">
                    FanVerse
                  </span>
                  <div className="text-xs text-muted-foreground flex items-center space-x-2">
                    <span>Beta v2.0</span>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </motion.div>

              {/* Navigation desktop */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="relative"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    onMouseEnter={() => {
                      setHoveredItem(item.name)
                      soundEnabled && playHover()
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <motion.a
                      href={item.href}
                      onClick={() => handleItemClick(item.name)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-all duration-200 group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                      <span className="font-medium">{item.name}</span>
                    </motion.a>
                    {hoveredItem === item.name && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent-comp rounded-full"
                        layoutId="underline"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      />
                    )}
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* Actions et contrôles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              {/* Heure et statut */}
              <div className="hidden md:flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20">
                <div className="text-right">
                  <div className="text-sm font-mono text-primary">
                    {currentTime.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentTime.toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit' 
                    })}
                  </div>
                </div>
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Réseaux sociaux */}
              <div className="hidden md:flex items-center space-x-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className={`p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-primary/20 text-gray-400 ${social.color} transition-all duration-200 hover:scale-110 hover:shadow-lg`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => soundEnabled && playHover()}
                    onClick={() => soundEnabled && playClick()}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-primary/20 text-gray-400 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => soundEnabled && playHover()}
                >
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {notifications}
                    </motion.span>
                  )}
                </motion.button>

                {/* Dropdown notifications */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute right-0 top-12 w-80 bg-black/95 backdrop-blur-xl border border-primary/30 rounded-xl shadow-2xl shadow-primary/20 p-4 z-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span className="text-sm text-white">Nouveau pari disponible</span>
                          </div>
                        </div>
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-white">Système mis à jour</span>
                          </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-white">Nouvelle communauté</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contrôle du son */}
              <motion.button
                onClick={handleSoundToggle}
                className={`p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-primary/20 transition-all duration-200 hover:scale-110 ${
                  soundEnabled ? 'text-primary' : 'text-gray-400'
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => soundEnabled && playHover()}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </motion.button>

              {/* Bouton principal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  onClick={() => {
                    soundEnabled && playClick()
                    onLaunch()
                  }}
                  onMouseEnter={() => soundEnabled && playHover()}
                  className="relative bg-gradient-to-r from-primary via-accent-comp to-primary text-white hover:from-primary/90 hover:to-accent-comp/90 rounded-full text-sm px-6 py-3 font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 border border-primary/30 overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-comp/20 to-primary/20"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="relative z-10 flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Launch FanVerse</span>
                  </span>
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-3 h-3"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
                    <div className="relative w-full h-full bg-red-500 rounded-full" />
                  </motion.div>
                </Button>
              </motion.div>

              {/* Menu mobile */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-primary/20 text-white hover:text-primary transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => soundEnabled && playHover()}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-primary/30 lg:hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => handleItemClick(item.name)}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-primary/10 transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{item.name}</span>
                  </motion.a>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Réseaux sociaux</span>
                  <div className="flex items-center space-x-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        className={`p-2 rounded-lg bg-black/30 text-gray-400 ${social.color} transition-all duration-200`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => soundEnabled && playHover()}
                        onClick={() => soundEnabled && playClick()}
                      >
                        <social.icon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
