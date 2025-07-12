"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, Award, Lock, Calculator } from "lucide-react"

export function StakingPage() {
  const [selectedPool, setSelectedPool] = useState("chz-pool")
  const [stakeAmount, setStakeAmount] = useState("")

  const stakingPools = [
    {
      id: "chz-pool",
      name: "CHZ Staking Pool",
      apy: "12.5%",
      totalStaked: "2,847,592 CHZ",
      myStake: "1,250 CHZ",
      rewards: "156.25 CHZ",
      lockPeriod: "30 days",
      minStake: "100 CHZ",
      status: "active",
      icon: "🌶️"
    },
    {
      id: "psg-pool",
      name: "PSG Fan Token Pool",
      apy: "18.7%",
      totalStaked: "456,789 PSG",
      myStake: "75 PSG",
      rewards: "14.03 PSG",
      lockPeriod: "60 days",
      minStake: "10 PSG",
      status: "active",
      icon: "⚽"
    },
    {
      id: "bar-pool",
      name: "Barcelona Fan Token Pool",
      apy: "15.2%",
      totalStaked: "789,123 BAR",
      myStake: "0 BAR",
      rewards: "0 BAR",
      lockPeriod: "45 days",
      minStake: "10 BAR",
      status: "available",
      icon: "🔴"
    },
    {
      id: "lp-pool",
      name: "CHZ-ETH LP Pool",
      apy: "24.8%",
      totalStaked: "1,234,567 LP",
      myStake: "0 LP",
      rewards: "0 LP",
      lockPeriod: "90 days",
      minStake: "1 LP",
      status: "high-risk",
      icon: "💎"
    }
  ]

  const stakingStats = [
    {
      title: "Total Staked Value",
      value: "$4,567.89",
      change: "+12.5%",
      icon: Coins,
      color: "from-chiliz-red to-chiliz-orange"
    },
    {
      title: "Total Rewards Earned",
      value: "234.56 CHZ",
      change: "+8.2%",
      icon: Award,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Average APY",
      value: "16.8%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Active Stakes",
      value: "3",
      change: "0",
      icon: Lock,
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Staking</h1>
          <p className="text-gray-400">Earn rewards by staking your tokens</p>
        </div>
        <Button variant="gradient">
          <Calculator className="w-4 h-4 mr-2" />
          Rewards Calculator
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stakingStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">{stat.change}</span>
                  <span className="text-gray-400 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Staking Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Staking Pools</CardTitle>
              <p className="text-gray-400 text-sm">Choose a pool to start earning rewards</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stakingPools.map((pool, index) => (
                  <motion.div
                    key={pool.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPool === pool.id
                        ? "border-chiliz-red bg-chiliz-red/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                    onClick={() => setSelectedPool(pool.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{pool.icon}</div>
                        <div>
                          <div className="font-semibold text-white">{pool.name}</div>
                          <div className="text-sm text-gray-400">Min: {pool.minStake}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{pool.apy}</div>
                        <div className="text-xs text-gray-400">APY</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Total Staked</div>
                        <div className="text-white font-medium">{pool.totalStaked}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Lock Period</div>
                        <div className="text-white font-medium">{pool.lockPeriod}</div>
                      </div>
                    </div>

                    {pool.myStake !== "0 CHZ" && pool.myStake !== "0 PSG" && pool.myStake !== "0 BAR" && pool.myStake !== "0 LP" && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">My Stake:</span>
                          <span className="text-white font-medium">{pool.myStake}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Rewards:</span>
                          <span className="text-green-400 font-medium">{pool.rewards}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        pool.status === "active" ? "bg-green-500/20 text-green-400" :
                        pool.status === "available" ? "bg-blue-500/20 text-blue-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {pool.status === "active" ? "Active" :
                         pool.status === "available" ? "Available" : "High Risk"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Staking Interface */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Stake Tokens</CardTitle>
              <p className="text-gray-400 text-sm">Enter amount to stake</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-chiliz-red"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-400">CHZ</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {["25%", "50%", "75%", "MAX"].map((percent) => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        const maxAmount = 1000 // Example max balance
                        const percentage = percent === "MAX" ? 100 : Number.parseInt(percent)
                        setStakeAmount(((maxAmount * percentage) / 100).toString())
                      }}
                    >
                      {percent}
                    </Button>
                  ))}
                \
