"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, Users, Trophy, Zap } from "lucide-react"

const stats = [
  {
    title: "Total Balance",
    value: "$12,847.52",
    change: "+12.5%",
    trend: "up",
    icon: Wallet,
    color: "from-chiliz-red to-chiliz-orange",
  },
  {
    title: "Staking Rewards",
    value: "847.23 CHZ",
    change: "+8.2%",
    trend: "up",
    icon: Trophy,
    color: "from-chiliz-orange to-chiliz-yellow",
  },
  {
    title: "Community Rank",
    value: "#1,247",
    change: "-23",
    trend: "down",
    icon: Users,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Energy Points",
    value: "15,642",
    change: "+156",
    trend: "up",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
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
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="text-gray-400 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
