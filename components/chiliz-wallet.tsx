"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Wallet, Copy, ExternalLink, History, ChevronDown, Shield, Star } from "lucide-react"

interface ChilizWalletProps {
  onBalanceChange?: (balance: number) => void
}

export function ChilizWallet({ onBalanceChange }: ChilizWalletProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(0)
  const [fanTokens, setFanTokens] = useState({
    PSG: 150.5,
    BAR: 89.2,
    CHZ: 2450.8,
  })
  const [showHistory, setShowHistory] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const walletData = {
    address: "0x742d35Cc6634C0532925a3b8D404fddF4f3f",
    network: "Chiliz Chain",
    activeBets: 3,
    pendingBets: 1,
    totalWinnings: 125.4,
    fanLevel: "Ultra",
    reputation: 4.8,
  }

  const recentTransactions = [
    {
      type: "bet",
      amount: "50 PSG",
      description: "First Goal Bet",
      status: "pending",
      timestamp: "2 min ago",
    },
    {
      type: "win",
      amount: "75 CHZ",
      description: "Score Prediction",
      status: "completed",
      timestamp: "15 min ago",
    },
    {
      type: "trade",
      amount: "25 BAR",
      description: "Fan Token Swap",
      status: "completed",
      timestamp: "1 hour ago",
    },
    {
      type: "reward",
      amount: "10 PSG",
      description: "Loyalty Bonus",
      status: "completed",
      timestamp: "2 hours ago",
    },
  ]

  const quickBetAmounts = [
    { amount: "10", token: "CHZ" },
    { amount: "25", token: "PSG" },
    { amount: "50", token: "BAR" },
  ]

  useEffect(() => {
    // Simulation de connexion automatique
    const timer = setTimeout(() => {
      setIsConnected(true)
      setBalance(2450.8)
      onBalanceChange?.(2450.8)
    }, 1000)

    return () => clearTimeout(timer)
  }, [onBalanceChange])

  const connectWallet = async () => {
    setIsLoading(true)
    // Simulation de connexion
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(true)
    setBalance(2450.8)
    setIsLoading(false)
    onBalanceChange?.(2450.8)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setBalance(0)
    setFanTokens({ PSG: 0, BAR: 0, CHZ: 0 })
    onBalanceChange?.(0)
  }

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Connecter Chiliz Wallet</h3>
          <p className="text-gray-400 text-sm">Connectez votre wallet pour parier avec vos Fan Tokens</p>
          <Button
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connexion...</span>
              </div>
            ) : (
              "Connecter Wallet"
            )}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a2a] border-purple-500/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center text-white">
          <Wallet className="w-4 h-4 mr-2 text-purple-400" />
          Chiliz Wallet
        </h3>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-600 text-white">
            <Shield className="w-3 h-3 mr-1" />
            Connecté
          </Badge>
          <Button variant="ghost" size="sm" onClick={disconnectWallet} className="text-gray-400 hover:text-white">
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Adresse du wallet */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Adresse</span>
          <Button variant="ghost" size="sm" className="h-6 p-1 text-purple-400">
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-xs font-mono text-purple-400 truncate bg-purple-500/10 px-2 py-1 rounded">
          {walletData.address}
        </p>
      </div>

      {/* Fan Tokens */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Fan Tokens</h4>
        <div className="space-y-2">
          {Object.entries(fanTokens).map(([token, amount]) => (
            <div key={token} className="flex items-center justify-between bg-gray-800/50 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    token === "PSG" ? "bg-blue-600" : token === "BAR" ? "bg-red-600" : "bg-purple-600"
                  }`}
                >
                  {token}
                </div>
                <span className="text-white font-medium">{amount.toFixed(1)}</span>
              </div>
              <div className="text-right">
                <div className="text-green-400 text-sm">+2.4%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4 bg-gray-700" />

      {/* Paris rapides */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Paris Rapides</p>
        <div className="grid grid-cols-3 gap-2">
          {quickBetAmounts.map((bet, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent text-white"
            >
              {bet.amount} {bet.token}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-4 bg-gray-700" />

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">{walletData.activeBets}</div>
          <div className="text-xs text-gray-400">Paris Actifs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{walletData.totalWinnings}</div>
          <div className="text-xs text-gray-400">CHZ Gagnés</div>
        </div>
      </div>

      {/* Niveau de fan */}
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Niveau Fan</span>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            {walletData.fanLevel}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={85} className="flex-1 h-2" />
          <span className="text-xs text-gray-400">85%</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">Réputation: {walletData.reputation}/5.0</div>
      </div>

      {/* Historique des transactions */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHistory(!showHistory)}
        className="w-full justify-between text-gray-400 hover:text-white"
      >
        <span className="flex items-center">
          <History className="w-4 h-4 mr-2" />
          Activité Récente
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? "rotate-180" : ""}`} />
      </Button>

      {showHistory && (
        <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
          {recentTransactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between text-xs bg-gray-800/30 p-2 rounded">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    tx.status === "pending"
                      ? "bg-yellow-400"
                      : tx.type === "win"
                        ? "bg-green-400"
                        : tx.type === "reward"
                          ? "bg-purple-400"
                          : "bg-blue-400"
                  }`}
                />
                <span className="text-gray-300">{tx.description}</span>
              </div>
              <div className="text-right">
                <div
                  className={`font-medium ${
                    tx.type === "win" || tx.type === "reward" ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {tx.type === "win" || tx.type === "reward" ? "+" : "-"}
                  {tx.amount}
                </div>
                <div className="text-gray-500 text-xs">{tx.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
