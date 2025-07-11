"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, ArrowUpDown, Plus, Zap, Trophy, Users } from "lucide-react"

const actions = [
  {
    title: "Send CHZ",
    description: "Transfer tokens instantly",
    icon: Send,
    color: "from-chiliz-red to-chiliz-orange",
    action: "send",
  },
  {
    title: "Swap Tokens",
    description: "Exchange cryptocurrencies",
    icon: ArrowUpDown,
    color: "from-blue-500 to-cyan-500",
    action: "swap",
  },
  {
    title: "Stake CHZ",
    description: "Earn rewards by staking",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    action: "stake",
  },
  {
    title: "Join Tournament",
    description: "Compete and win prizes",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
    action: "tournament",
  },
  {
    title: "Create Team",
    description: "Build your fan community",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    action: "team",
  },
  {
    title: "Buy Fan Tokens",
    description: "Support your favorite team",
    icon: Plus,
    color: "from-indigo-500 to-purple-500",
    action: "buy",
  },
]

export function QuickActions() {
  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <p className="text-gray-400 text-sm">Frequently used features</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {actions.map((action, index) => (
              <motion.div
                key={action.action}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-chiliz-red/10 border border-transparent hover:border-chiliz-red/30 rounded-lg"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-white text-sm">{action.title}</p>
                    <p className="text-xs text-gray-400">{action.description}</p>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
