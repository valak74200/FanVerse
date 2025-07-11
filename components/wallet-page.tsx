"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, ArrowDownLeft, ArrowUpRight, Copy, QrCode, History, TrendingUp, Shield, Plus, Minus } from "lucide-react"

export function WalletPage() {
  const [selectedToken, setSelectedToken] = useState("CHZ")

  const tokens = [
    {
      symbol: "CHZ",
      name: "Chiliz",
      balance: "2,847.52",
      usdValue: "1,423.76",
      change: "+12.5%",
      trend: "up",
      logo: "🌶️",
    },
    {
      symbol: "PSG",
      name: "Paris Saint-Germain",
      balance: "156.23",
      usdValue: "234.45",
      change: "+8.2%",
      trend: "up",
      logo: "⚽",
    },
    {
      symbol: "BAR",
      name: "FC Barcelona",
      balance: "89.67",
      usdValue: "178.90",
      change: "-2.1%",
      trend: "down",
      logo: "🔴",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "0.5432",
      usdValue: "1,234.56",
      change: "+15.3%",
      trend: "up",
      logo: "💎",
    },
  ]

  const transactions = [
    {
      id: 1,
      type: "receive",
      token: "CHZ",
      amount: "+150.00",
      from: "Staking Rewards",
      time: "2 minutes ago",
      status: "completed",
      hash: "0x1234...5678",
    },
    {
      id: 2,
      type: "send",
      token: "PSG",
      amount: "-25.50",
      to: "0x9876...4321",
      time: "1 hour ago",
      status: "completed",
      hash: "0x2345...6789",
    },
    {
      id: 3,
      type: "swap",
      token: "CHZ",
      amount: "100.00 → 50.00 PSG",
      from: "DEX Swap",
      time: "3 hours ago",
      status: "completed",
      hash: "0x3456...7890",
    },
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
          <h1 className="text-3xl font-bold text-white">Wallet</h1>
          <p className="text-gray-400">Manage your digital assets</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <QrCode className="w-4 h-4 mr-2" />
            Receive
          </Button>
          <Button variant="gradient" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Total Portfolio Value</CardTitle>
                <p className="text-gray-400 text-sm">Across all networks</p>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-green-500 text-sm">Secured</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-2">$3,071.67</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500">+$234.56 (8.3%)</span>
              <span className="text-gray-400">24h</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Token List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokens.map((token, index) => (
                  <motion.div
                    key={token.symbol}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedToken === token.symbol
                        ? "border-chiliz-red bg-chiliz-red/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                    onClick={() => setSelectedToken(token.symbol)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{token.logo}</div>
                        <div>
                          <div className="font-semibold text-white">{token.symbol}</div>
                          <div className="text-sm text-gray-400">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{token.balance}</div>
                        <div className="text-sm text-gray-400">${token.usdValue}</div>
                        <div className={`text-xs ${token.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                          {token.change}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="gradient" className="h-20 flex flex-col">
                  <Send className="w-6 h-6 mb-2" />
                  <span>Send</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <ArrowDownLeft className="w-6 h-6 mb-2" />
                  <span>Receive</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <Plus className="w-6 h-6 mb-2" />
                  <span>Buy</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <Minus className="w-6 h-6 mb-2" />
                  <span>Sell</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Wallet Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <span className="font-mono text-sm text-gray-300">0x742d35Cc6634C0532925a3b8D404fddF4f3f</span>
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
              <p className="text-gray-400 text-sm">Your latest activity</p>
            </div>
            <Button variant="ghost" size="sm">
              <History className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-chiliz-red/5 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "receive"
                          ? "bg-green-500/20"
                          : tx.type === "send"
                            ? "bg-red-500/20"
                            : "bg-blue-500/20"
                      }`}
                    >
                      {tx.type === "receive" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-500" />
                      ) : tx.type === "send" ? (
                        <ArrowUpRight className="w-5 h-5 text-red-500" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {tx.type === "receive" ? "Received" : tx.type === "send" ? "Sent" : "Swapped"} {tx.token}
                      </div>
                      <div className="text-sm text-gray-400">
                        {tx.from || tx.to} • {tx.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${tx.type === "receive" ? "text-green-500" : "text-white"}`}>
                      {tx.amount}
                    </div>
                    <div className="text-xs text-gray-400">{tx.hash}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
