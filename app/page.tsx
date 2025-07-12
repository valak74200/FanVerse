"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Header from "./components/fanverse/chiliz/Header"
import Dashboard from "./components/fanverse/chiliz/Dashboard"
import Web3Dashboard from "./components/fanverse/chiliz/Web3Dashboard"
import Web3Background from "./components/fanverse/chiliz/Web3Background"

const textVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.3 + 0.8,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const glowVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: [0, 1.2, 1], 
    opacity: [0, 0.8, 0.6],
    transition: {
      duration: 2,
      delay: 1.5,
      ease: "easeOut"
    }
  }
}

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function FanVersePage() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [showWeb3Dashboard, setShowWeb3Dashboard] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, -100])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Web3Background />
      <div className="relative z-10 flex-grow flex flex-col">
        <Header onLaunch={() => setShowDashboard(true)} />
        <main className="flex-grow flex items-center justify-center relative">
          {/* Curseur personnalisé lumineux */}
          <motion.div
            className="fixed w-6 h-6 rounded-full bg-primary/30 backdrop-blur-sm border border-primary/50 pointer-events-none z-50"
            style={{
              left: mousePosition.x - 12,
              top: mousePosition.y - 12,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <AnimatePresence mode="wait">
            {!showDashboard ? (
              <motion.div
                key="landing"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95, y: -50 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative"
                style={{ y }}
              >
                {/* Effet de lueur d'arrière-plan */}
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                />
                
                {/* Éléments flottants décoratifs */}
                <motion.div
                  className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-conic from-primary/20 to-transparent rounded-full blur-2xl"
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                />
                <motion.div
                  className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-conic from-accent-comp/20 to-transparent rounded-full blur-2xl"
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 1, duration: 5 }}
                />

                <motion.h1
                  custom={0}
                  variants={textVariants}
                  className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-tight relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                    THE BLOCKCHAIN
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent-comp/30 blur-xl opacity-0"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.h1>
                
                <motion.h2
                  custom={1}
                  variants={textVariants}
                  className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-tight relative mt-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{
                    textShadow: "0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.2)",
                  }}
                >
                  <span className="bg-gradient-to-r from-primary via-accent-comp to-primary bg-clip-text text-transparent">
                    FOR FAN ENGAGEMENT
                  </span>
                </motion.h2>

                {/* Ligne de séparation animée */}
                <motion.div
                  className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-8"
                  initial={{ width: 0 }}
                  animate={{ width: 128 }}
                  transition={{ delay: 2, duration: 1 }}
                />

                {/* Sous-titre avec effet de frappe */}
                <motion.p
                  className="text-xl md:text-2xl text-gray-300 mt-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 1 }}
                >
                  Révolutionnez l'expérience des fans avec la blockchain
                </motion.p>

                {/* Boutons d'action flottants */}
                <motion.div
                  className="flex gap-6 justify-center mt-12"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3, duration: 0.8 }}
                >
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDashboard(true)}
                  >
                    Découvrir FanVerse
                  </motion.button>
                  <motion.button
                    className="px-8 py-4 bg-transparent border-2 border-accent-comp text-accent-comp rounded-full font-semibold text-lg hover:bg-accent-comp/10 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    En savoir plus
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full pt-16"
              >
                <Dashboard onClose={() => setShowDashboard(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
