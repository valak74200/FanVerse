"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Wallet, TrendingUp, Users, Settings, Menu, X, Zap, Trophy, BarChart3, Coins } from "lucide-react"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "staking", label: "Staking", icon: Coins },
    { id: "marketplace", label: "Marketplace", icon: TrendingUp },
    { id: "community", label: "Community", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "rewards", label: "Rewards", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 glass-chiliz z-40"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col w-full p-6">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-chiliz-red to-chiliz-orange rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ChilizDApp</h1>
              <p className="text-xs text-gray-400">Web3 Sports Platform</p>
            </div>
          </motion.div>

          {/* Menu Items */}
          <div className="space-y-2 flex-1">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant={activeSection === item.id ? "gradient" : "ghost"}
                  className={`w-full justify-start h-12 ${
                    activeSection === item.id ? "chiliz-glow" : "hover:bg-chiliz-red/10"
                  }`}
                  onClick={() => onSectionChange(item.id)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Status */}
          <motion.div
            className="mt-auto p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Connected</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Chiliz Chain</p>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Toggle */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-chiliz-red rounded-lg chiliz-glow"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute left-0 top-0 h-full w-64 glass-chiliz"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col w-full p-6 pt-20">
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-chiliz-red to-chiliz-orange rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">ChilizDApp</h1>
                    <p className="text-xs text-gray-400">Web3 Sports Platform</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "gradient" : "ghost"}
                      className={`w-full justify-start h-12 ${
                        activeSection === item.id ? "chiliz-glow" : "hover:bg-chiliz-red/10"
                      }`}
                      onClick={() => {
                        onSectionChange(item.id)
                        setIsOpen(false)
                      }}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
