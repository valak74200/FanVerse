"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Trophy, Users, MoreHorizontal } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "send",
    description: "Sent CHZ to 0x1234...5678",
    amount: "-150.00 CHZ",
    time: "2 minutes ago",
    status: "completed",
    icon: ArrowUpRight,
    color: "text-red-500",
  },
  {
    id: 2,
    type: "receive",
    description: "Received staking rewards",
    amount: "+25.50 CHZ",
    time: "1 hour ago",
    status: "completed",
    icon: ArrowDownLeft,
    color: "text-green-500",
  },
  {
    id: 3,
    type: "tournament",
    description: "Won Champions League prediction",
    amount: "+500.00 CHZ",
    time: "3 hours ago",
    status: "completed",
    icon: Trophy,
    color: "text-yellow-500",
  },
  {
    id: 4,
    type: "team",
    description: "Joined FC Barcelona fan group",
    amount: "",
    time: "5 hours ago",
    status: "completed",
    icon: Users,
    color: "text-blue-500",
  },
  {
    id: 5,
    type: "send",
    description: "Sent CHZ to 0x9876...4321",
    amount: "-75.25 CHZ",
    time: "1 day ago",
    status: "pending",
    icon: ArrowUpRight,
    color: "text-red-500",
  },
]

export function RecentActivity() {
  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <p className="text-gray-400 text-sm">Your latest transactions</p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-chiliz-red/5 transition-colors"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r from-chiliz-red/20 to-chiliz-orange/20 rounded-lg flex items-center justify-center`}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{activity.description}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p
                      className={`text-sm font-medium ${
                        activity.amount.startsWith("+") ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {activity.amount}
                    </p>
                  )}
                  <p className={`text-xs ${activity.status === "completed" ? "text-green-500" : "text-yellow-500"}`}>
                    {activity.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-chiliz-red hover:bg-chiliz-red/10">
            View All Activity
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
