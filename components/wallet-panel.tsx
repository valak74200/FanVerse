"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, Copy, ExternalLink, History, ChevronDown } from "lucide-react"

export function WalletPanel() {
  const [showHistory, setShowHistory] = useState(false)

  const walletData = {
    address: "0x742d35Cc6634C0532925a3b8D404fddF4f3f",
    balance: "2.4",
    usdValue: "4,320.00",
    network: "Ethereum Mainnet",
    activeBets: 3,
    pendingBets: 1,
    totalWinnings: "0.8",
  }

  const recentTransactions = [
    { type: "bet", amount: "0.1 ETH", description: "First Goal Bet", status: "pending" },
    { type: "win", amount: "0.3 ETH", description: "Score Prediction", status: "completed" },
    { type: "bet", amount: "0.2 ETH", description: "Corner Kick Bet", status: "completed" },
  ]

  const quickBetAmounts = ["0.1", "0.5", "1.0"]

  return (
    <Card className="bg-[#1a1a1a] border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <Wallet className="w-4 h-4 mr-2" />
          Wallet
        </h3>
        <Badge className="bg-green-600">Connected</Badge>
      </div>

      {/* Wallet Address */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Address</span>
          <Button variant="ghost" size="sm" className="h-6 p-1">
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-xs font-mono text-blue-400 truncate">{walletData.address}</p>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{walletData.balance} ETH</div>
          <div className="text-sm text-gray-400">${walletData.usdValue}</div>
          <div className="text-xs text-gray-500 mt-1">{walletData.network}</div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Quick Bet Amounts */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Quick Bet</p>
        <div className="grid grid-cols-3 gap-2">
          {quickBetAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              className="border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 bg-transparent"
            >
              {amount} ETH
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-center">
        <div>
          <div className="text-lg font-bold text-blue-400">{walletData.activeBets}</div>
          <div className="text-xs text-gray-400">Active Bets</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-400">{walletData.totalWinnings}</div>
          <div className="text-xs text-gray-400">ETH Won</div>
        </div>
      </div>

      {/* Transaction History Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHistory(!showHistory)}
        className="w-full justify-between text-gray-400 hover:text-white"
      >
        <span className="flex items-center">
          <History className="w-4 h-4 mr-2" />
          Recent Activity
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? "rotate-180" : ""}`} />
      </Button>

      {/* Transaction History */}
      {showHistory && (
        <div className="mt-3 space-y-2">
          {recentTransactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    tx.status === "pending" ? "bg-yellow-400" : tx.type === "win" ? "bg-green-400" : "bg-blue-400"
                  }`}
                />
                <span className="text-gray-300">{tx.description}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className={tx.type === "win" ? "text-green-400" : "text-gray-400"}>
                  {tx.type === "win" ? "+" : "-"}
                  {tx.amount}
                </span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
