"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { PortfolioChart } from "@/components/portfolio-chart"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortfolioChart />
              <RecentActivity />
            </div>
            <QuickActions />
          </motion.div>
        )
      case "wallet":
        return (
          <motion.div
            key="wallet"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Wallet Section</h2>
            <p className="text-gray-400">Wallet functionality coming soon...</p>
          </motion.div>
        )
      case "staking":
        return (
          <motion.div
            key="staking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Staking Section</h2>
            <p className="text-gray-400">Staking functionality coming soon...</p>
          </motion.div>
        )
      case "marketplace":
        return (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Marketplace Section</h2>
            <p className="text-gray-400">Marketplace functionality coming soon...</p>
          </motion.div>
        )
      case "community":
        return (
          <motion.div
            key="community"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Community Section</h2>
            <p className="text-gray-400">Community functionality coming soon...</p>
          </motion.div>
        )
      case "analytics":
        return (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Analytics Section</h2>
            <p className="text-gray-400">Analytics functionality coming soon...</p>
          </motion.div>
        )
      case "rewards":
        return (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Rewards Section</h2>
            <p className="text-gray-400">Rewards functionality coming soon...</p>
          </motion.div>
        )
      case "settings":
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Settings Section</h2>
            <p className="text-gray-400">Settings functionality coming soon...</p>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10">
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="lg:ml-64">
          <DashboardHeader />

          <main className="p-6">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
