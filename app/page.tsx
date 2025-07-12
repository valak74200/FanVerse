"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Header from "./components/fanverse/chiliz/Header"
import Dashboard from "./components/fanverse/chiliz/Dashboard"
import Web3Background from "./components/fanverse/chiliz/Web3Background"
import StadeViewer3D from "./components/fanverse/chiliz/StadeViewer3D"

const textVariants: any = {
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

const glowVariants: any = {
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

const floatingVariants: any = {
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
  const router = useRouter()
  const [showDashboard, setShowDashboard] = useState(false)
  const [show3DStade, setShow3DStade] = useState(false)
  const [isFullscreen3D, setIsFullscreen3D] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleLaunchTribune = () => {
    router.push('/tribune')
  }

  const handleShow3DStade = () => {
    setShow3DStade(true)
  }

  const handleToggleFullscreen3D = () => {
    setIsFullscreen3D(!isFullscreen3D)
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Web3Background />
      <div className="relative z-10 flex-grow flex flex-col">
        <Header onLaunch={handleLaunchTribune} />
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

                {/* Boutons d'action */}
                <motion.div
                  className="flex flex-col items-center space-y-6 mt-12"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3, duration: 0.8 }}
                >
                  <motion.button
                    className="px-12 py-6 bg-gradient-to-r from-primary via-accent-comp to-primary text-white rounded-full font-bold text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/60 transition-all duration-500 border border-primary/20 hover:border-primary/40"
                    whileHover={{ 
                      scale: 1.08, 
                      y: -4,
                      boxShadow: "0 25px 50px -12px rgba(255, 99, 71, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLaunchTribune}
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent-comp)) 50%, hsl(var(--primary)) 100%)",
                      textShadow: "0 0 20px rgba(255, 255, 255, 0.5)"
                    }}
                  >
                    <span className="relative z-10">Découvrir FanVerse</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-comp/20 to-primary/20 rounded-full blur-lg"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.button>

                  {/* Bouton pour afficher le stade 3D */}
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-accent-comp/80 to-primary/80 text-white rounded-full font-semibold text-lg shadow-lg shadow-accent-comp/20 hover:shadow-accent-comp/40 transition-all duration-500 border border-accent-comp/30 hover:border-accent-comp/50"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      boxShadow: "0 20px 40px -10px rgba(255, 165, 0, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShow3DStade}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.5, duration: 0.6 }}
                  >
                    <span className="relative z-10">Voir le Stade 3D</span>
                  </motion.button>
                </motion.div>

                {/* Composant 3D du stade */}
                <AnimatePresence>
                  {show3DStade && (
                    <motion.div
                      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShow3DStade(false)}
                    >
                      <motion.div
                        className="w-full max-w-4xl h-[80vh]"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <StadeViewer3D
                          isFullscreen={isFullscreen3D}
                          onToggleFullscreen={handleToggleFullscreen3D}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
