"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/fanverse/chiliz/Header"
import Dashboard from "./components/fanverse/chiliz/Dashboard"

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2 + 0.5,
      duration: 0.5,
    },
  }),
}

export default function FanVersePage() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative z-10 flex-grow flex flex-col">
        <Header onLaunch={() => setShowDashboard(true)} />
        <main className="flex-grow flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!showDashboard ? (
              <motion.div
                key="landing"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
              >
                <motion.h1
                  custom={0}
                  variants={textVariants}
                  className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight"
                >
                  THE BLOCKCHAIN
                </motion.h1>
                <motion.h2
                  custom={1}
                  variants={textVariants}
                  className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight text-shadow"
                  style={{
                    textShadow: "0 0 15px hsl(var(--primary) / 0.5), 0 0 30px hsl(var(--primary) / 0.3)",
                  }}
                >
                  FOR FAN ENGAGEMENT
                </motion.h2>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full pt-16"
              >
                <Dashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
