"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, MoreHorizontal } from "lucide-react"

export function PortfolioChart() {
  const chartData = [
    { time: "00:00", value: 100 },
    { time: "04:00", value: 120 },
    { time: "08:00", value: 110 },
    { time: "12:00", value: 140 },
    { time: "16:00", value: 135 },
    { time: "20:00", value: 155 },
    { time: "24:00", value: 148 },
  ]

  const maxValue = Math.max(...chartData.map((d) => d.value))
  const minValue = Math.min(...chartData.map((d) => d.value))

  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Portfolio Performance</CardTitle>
            <p className="text-gray-400 text-sm">Last 24 hours</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5%
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid Lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="rgba(255, 0, 0, 0.1)" strokeWidth="1" />
              ))}

              {/* Chart Line */}
              <motion.path
                d={`M ${chartData
                  .map(
                    (point, index) =>
                      `${(index / (chartData.length - 1)) * 400},${
                        200 - ((point.value - minValue) / (maxValue - minValue)) * 180
                      }`,
                  )
                  .join(" L ")}`}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF0000" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>

              {/* Data Points */}
              {chartData.map((point, index) => (
                <motion.circle
                  key={index}
                  cx={(index / (chartData.length - 1)) * 400}
                  cy={200 - ((point.value - minValue) / (maxValue - minValue)) * 180}
                  r="4"
                  fill="#FF0000"
                  className="chiliz-glow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                />
              ))}
            </svg>

            {/* Time Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
              {chartData.map((point, index) => (
                <span key={index}>{point.time}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
