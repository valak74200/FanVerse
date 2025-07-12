'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SocialBettingMVP } from "@/components/social-betting-mvp"
import { AdvancedChat } from "@/components/chat/AdvancedChat"
import { NFTMoments } from "@/components/nft-moments"
import { NFTMarketplace } from "@/components/nft-marketplace"
import { NFTCollection } from "@/components/nft-collection"
import { EmotionPanel } from "@/components/stadium/EmotionPanel"
import { VirtualStadium } from "@/components/stadium/VirtualStadium"
import { GlitchText } from "@/components/ui/GlitchText"
import { FuturisticBackground } from "@/components/ui/FuturisticBackground"
import { GlassCard } from "@/components/ui/GlassCard"
import { FuturisticButton } from "@/components/ui/FuturisticButton"
import { 
  Users, 
  MessageCircle, 
  Trophy, 
  Coins, 
  TrendingUp, 
  Zap,
  Menu,
  X,
  ChevronDown,
  Star,
  Flame,
  Crown,
  Shield
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Dashboard() {
  const [selectedChatGroup, setSelectedChatGroup] = useState("general")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const chatGroups = [
    { id: "general", name: "Chat Général", members: 1247, icon: MessageCircle, color: "bg-blue-500" },
    { id: "psg", name: "PSG Ultras", members: 892, icon: Crown, color: "bg-blue-600" },
    { id: "barca", name: "Barça Supporters", members: 756, icon: Shield, color: "bg-red-500" },
    { id: "madrid", name: "Real Madrid", members: 634, icon: Star, color: "bg-white" },
    { id: "vip", name: "VIP Lounge", members: 89, icon: Flame, color: "bg-yellow-500" }
  ]

  const stats = [
    { 
      title: "Fans Connectés", 
      value: "12,847", 
      change: "+15%", 
      icon: Users,
      color: "from-orange-500 to-yellow-500"
    },
    { 
      title: "CHZ Gagnés", 
      value: "2,456", 
      change: "+23%", 
      icon: Coins,
      color: "from-green-500 to-emerald-500"
    },
    { 
      title: "Paris Actifs", 
      value: "89", 
      change: "+8%", 
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Énergie", 
      value: "95%", 
      change: "+5%", 
      icon: Zap,
      color: "from-purple-500 to-pink-500"
    }
  ]

  const quickActions = [
    { name: "Parier", icon: Trophy, color: "bg-gradient-to-r from-orange-500 to-yellow-500" },
    { name: "NFT", icon: Star, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { name: "Staking", icon: Coins, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { name: "Social", icon: Users, color: "bg-gradient-to-r from-blue-500 to-cyan-500" }
  ]

  return (
    <MotionConfig reducedMotion="user">
      <FuturisticBackground color="#FF6B35">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar Toggle for Mobile */}
          <motion.button
            className="fixed top-4 left-4 z-50 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FuturisticButton size="sm">
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </FuturisticButton>
          </motion.button>

          {/* Sidebar */}
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed lg:relative z-40 w-80 h-full"
              >
                <GlassCard className="h-full rounded-none lg:rounded-r-2xl border-l-0">
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                      <GlitchText 
                        text="CHILIZ ARENA" 
                        className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"
                      />
                      <p className="text-sm text-gray-400 mt-2">Stade Virtuel Web3</p>
                    </div>

                    <Separator className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20" />

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <GlassCard className="p-3 text-center">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${stat.color} mx-auto mb-2 flex items-center justify-center`}>
                              <stat.icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-lg font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-gray-400">{stat.title}</div>
                            <Badge variant="secondary" className="text-xs mt-1 bg-green-500/20 text-green-400">
                              {stat.change}
                            </Badge>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>

                    <Separator className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20" />

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-3">Actions Rapides</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action, index) => (
                          <motion.div
                            key={action.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <FuturisticButton 
                              className={`w-full ${action.color} text-white border-0`}
                              size="sm"
                            >
                              <action.icon className="h-4 w-4 mr-2" />
                              {action.name}
                            </FuturisticButton>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20" />

                    {/* Chat Groups */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-300 mb-3">Groupes de Discussion</h3>
                      <div className="space-y-2">
                        {chatGroups.slice(0, 3).map((group, index) => (
                          <motion.button
                            key={group.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedChatGroup(group.id)}
                            className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                              selectedChatGroup === group.id
                                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full ${group.color} flex items-center justify-center`}>
                                <group.icon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-medium">{group.name}</div>
                                <div className="text-xs opacity-70">{group.members} membres</div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border-b border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <GlitchText 
                    text="Stade Virtuel" 
                    className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"
                  />
                  <p className="text-gray-400 mt-1">Vivez l'expérience immersive Web3</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    En Direct
                  </Badge>
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </motion.header>

            {/* Main Grid */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                {/* Stadium Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="xl:col-span-2"
                >
                  <GlassCard className="h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-white flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-orange-400" />
                          Stade Virtuel 3D
                        </CardTitle>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          Match en cours
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-80px)]">
                      <div className="h-full rounded-lg overflow-hidden border border-white/10">
                        <VirtualStadium />
                      </div>
                    </CardContent>
                  </GlassCard>
                </motion.div>

                {/* Chat & Emotions Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col space-y-6"
                >
                  {/* Chat Group Selector */}
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">Groupe de Chat</h3>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        {chatGroups.find(g => g.id === selectedChatGroup)?.members} membres
                      </Badge>
                    </div>
                    <Select value={selectedChatGroup} onValueChange={setSelectedChatGroup}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/10">
                        {chatGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id} className="text-white hover:bg-white/10">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${group.color}`}></div>
                              <span>{group.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GlassCard>

                  {/* Chat */}
                  <GlassCard className="flex-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-white flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2 text-blue-400" />
                        Chat en Direct
                        <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <AdvancedChat />
                    </CardContent>
                  </GlassCard>

                  {/* Emotion Panel */}
                  <GlassCard className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                      Émotions du Stade
                    </h3>
                    <EmotionPanel />
                  </GlassCard>
                </motion.div>
              </div>

              {/* Additional Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {/* Social Betting */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <GlassCard>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-white flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                        Paris Sociaux
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SocialBettingMVP />
                    </CardContent>
                  </GlassCard>
                </motion.div>

                {/* NFT Moments */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <GlassCard>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-white flex items-center">
                        <Star className="h-4 w-4 mr-2 text-purple-400" />
                        NFT Moments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <NFTMoments />
                    </CardContent>
                  </GlassCard>
                </motion.div>

                {/* NFT Collection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <GlassCard>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-white flex items-center">
                        <Crown className="h-4 w-4 mr-2 text-yellow-400" />
                        Ma Collection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <NFTCollection />
                    </CardContent>
                  </GlassCard>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </FuturisticBackground>
    </MotionConfig>
  )
}