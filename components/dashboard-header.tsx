"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bell, Search, Users, Wallet, ChevronDown } from "lucide-react"

export function DashboardHeader() {
  return (
    <motion.header
      className="sticky top-0 z-30 glass-chiliz border-b border-chiliz-red/20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between p-4">
        {/* Search */}
        <motion.div
          className="flex-1 max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tokens, NFTs, or users..."
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-chiliz-red/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-chiliz-red"
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-chiliz-red rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>

          {/* Wallet Info */}
          <Card className="glass-card px-4 py-2">
            <div className="flex items-center space-x-3">
              <Wallet className="w-4 h-4 text-chiliz-orange" />
              <div>
                <p className="text-sm font-medium text-white">2,847.52 CHZ</p>
                <p className="text-xs text-gray-400">$1,423.76</p>
              </div>
            </div>
          </Card>

          {/* Profile */}
          <Button variant="ghost" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-chiliz-red to-chiliz-orange rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="hidden md:block text-white">0x1234...5678</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.header>
  )
}
