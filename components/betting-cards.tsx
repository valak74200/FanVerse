"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Timer, TrendingUp, Target } from "lucide-react"

interface BetOption {
  id: string
  title: string
  timeLeft: { minutes: number; seconds: number }
  options: Array<{ name: string; odds: string; percentage: number }>
  totalPool: string
}

export function BettingCards() {
  const [bets, setBets] = useState([
    {
      id: "first-goal",
      title: "First Goal: Mbappé vs Messi",
      timeLeft: { minutes: 2, seconds: 34 },
      options: [
        { name: "Mbappé", odds: "2.1x", percentage: 65 },
        { name: "Messi", odds: "3.2x", percentage: 35 },
      ],
      totalPool: "12.4 ETH",
    },
    {
      id: "final-score",
      title: "Final Score Prediction",
      timeLeft: { minutes: 45, seconds: 12 },
      options: [
        { name: "PSG Win", odds: "1.8x", percentage: 45 },
        { name: "Draw", odds: "3.5x", percentage: 25 },
        { name: "Barca Win", odds: "2.4x", percentage: 30 },
      ],
      totalPool: "28.7 ETH",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setBets((prev) =>
        prev.map((bet) => {
          const newSeconds = bet.timeLeft.seconds - 1
          if (newSeconds < 0) {
            const newMinutes = bet.timeLeft.minutes - 1
            if (newMinutes < 0) {
              return bet // Stop countdown at 0
            }
            return {
              ...bet,
              timeLeft: { minutes: newMinutes, seconds: 59 },
            }
          }
          return {
            ...bet,
            timeLeft: { ...bet.timeLeft, seconds: newSeconds },
          }
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {bets.map((bet) => (
        <Card key={bet.id} className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">{bet.title}</h3>
            <Badge variant="outline" className="text-orange-400 border-orange-400">
              <Timer className="w-3 h-3 mr-1" />
              {bet.timeLeft.minutes}:{bet.timeLeft.seconds.toString().padStart(2, "0")}
            </Badge>
          </div>

          <div className="space-y-2 mb-3">
            {bet.options.map((option, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{option.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 font-medium">{option.odds}</span>
                    <span className="text-gray-500">{option.percentage}%</span>
                  </div>
                </div>
                <Progress value={option.percentage} className="h-1" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              Pool: {bet.totalPool}
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Target className="w-3 h-3 mr-1" />
              Bet
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
