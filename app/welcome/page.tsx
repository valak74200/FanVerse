"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import GlitchText from "@/components/ui/GlitchText"
import Waves from "@/components/ui/Waves"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Sparkles,
  Zap,
  Trophy,
  Users,
  Coins,
  Star,
  ChevronRight,
  Wifi,
  Shield,
  TrendingUp,
  Hexagon,
  Activity,
  Lightbulb,
  FileCode,      // Utilise FileCode au lieu de Code2
  Grid,
  Wifi as WifiIcon,  // Remplace Satellite
  Gamepad2,
  Crown,
  Diamond,
  Layers,        // Utilise Layers (existe dans lucide-react)
  Brain,         // Utilise Brain (existe dans lucide-react)
  Hash,          // Remplace Binary
  Sparkles as Gem,  // Utilise Sparkles comme Gem
  Activity as RadarIcon  // Utilise Activity comme Radar
} from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const slides = [
    {
      title: "Bienvenue dans FanVerse",
      subtitle: "L'expérience ultime des fans de football",
      description: "Propulsé par Chiliz & Socios.com",
      icon: <Hexagon className="w-16 h-16" />,
      gradient: "from-primary to-warning",
      bgIcon: <Layers className="w-96 h-96 opacity-10" />
    },
    {
      title: "Vivez le Match",
      subtitle: "Stade virtuel immersif en 3D",
      description: "Ressentez l'émotion comme si vous y étiez",
      icon: <Gamepad2 className="w-16 h-16" />,
      gradient: "from-blue-500 to-purple-500",
      bgIcon: <Activity className="w-96 h-96 opacity-10" />
    },
    {
      title: "Pariez & Gagnez",
      subtitle: "Paris sociaux avec vos CHZ",
      description: "Prédisez, pariez, et remportez des récompenses",
      icon: <Brain className="w-16 h-16" />,
      gradient: "from-green-500 to-emerald-500",
      bgIcon: <Hash className="w-96 h-96 opacity-10" />
    },
    {
      title: "NFTs Exclusifs",
      subtitle: "Collectionnez les moments uniques",
      description: "Des NFTs basés sur les émotions des fans",
      icon: <Gem className="w-16 h-16" />,
      gradient: "from-purple-500 to-pink-500",
      bgIcon: <Crown className="w-96 h-96 opacity-10" />
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const handleEnter = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/home")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Fond animé futuriste amélioré */}
      <div className="fixed inset-0 z-0">
        <Waves 
          lineColor="rgba(255, 107, 53, 0.3)"
          backgroundColor="rgba(0, 0, 0, 0.9)"
          waveSpeedX={0.01}
          waveSpeedY={0.005}
          waveAmpX={20}
          waveAmpY={15}
          xGap={25}
          yGap={50}
          friction={0.98}
          tension={0.002}
          maxCursorMove={50}
        />
        
        {/* Grille cyberpunk animée */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Effet de parallaxe avec la souris */}
      <div 
        className="fixed inset-0 z-5 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-warning/10 rounded-full blur-3xl" />
      </div>

      {/* Particules flottantes améliorées */}
      <div className="fixed inset-0 z-10">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{ 
              y: [null, -200],
              scale: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`
            }}
          >
            <Hexagon className="w-2 h-2 text-primary/50" />
          </motion.div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo animé amélioré */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
          className="mb-12"
        >
          <div className="relative">
            {/* Anneaux orbitaux */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-40 h-40 -m-4"
            >
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
              <div className="absolute inset-2 border border-warning/20 rounded-full rotate-45" />
              <div className="absolute inset-4 border border-success/20 rounded-full -rotate-45" />
            </motion.div>
            
            {/* Logo central */}
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(255, 107, 53, 0.5)",
                  "0 0 40px rgba(255, 107, 53, 0.8)",
                  "0 0 20px rgba(255, 107, 53, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-32 h-32 bg-gradient-to-br from-primary via-warning to-primary rounded-3xl flex items-center justify-center backdrop-blur-xl border border-primary/30"
            >
              <RadarIcon className="w-16 h-16 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Slides de présentation améliorés */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto relative"
          >
            {/* Icône de fond */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {slides[currentSlide].bgIcon}
            </div>
            
            {/* Contenu */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`inline-flex p-4 rounded-3xl bg-gradient-to-r ${slides[currentSlide].gradient} mb-6 shadow-2xl`}
              >
                {slides[currentSlide].icon}
              </motion.div>
              
              <GlitchText
                speed={0.5}
                className="text-5xl md:text-7xl font-bold mb-4 text-neon"
                enableShadows={true}
              >
                {slides[currentSlide].title}
              </GlitchText>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl text-primary mb-4"
              >
                {slides[currentSlide].subtitle}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-400 mb-12"
              >
                {slides[currentSlide].description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicateurs de slides améliorés */}
        <div className="flex items-center space-x-4 mb-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: index === currentSlide ? 1.5 : 1,
                  opacity: index === currentSlide ? 1 : 0.5
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-gray-600"
                }`}
              />
              {index === currentSlide && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 w-2 h-2 rounded-full border-2 border-primary"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Bouton d'entrée amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleEnter}
            disabled={isLoading}
            className="group relative px-16 py-8 text-xl font-bold btn-futuristic overflow-hidden"
          >
            {/* Effet de scan */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="flex items-center space-x-3"
              >
                <RadarIcon className="w-6 h-6" />
                <span>Initialisation...</span>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-3">
                <span>Entrer dans FanVerse</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.div>
              </div>
            )}
          </Button>
        </motion.div>

        {/* Stats en temps réel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 grid grid-cols-3 gap-8 text-center"
        >
          <Card className="p-4 bg-white/5 backdrop-blur-xl border-primary/20">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">47K+</p>
            <p className="text-xs text-gray-400">Fans actifs</p>
          </Card>
          <Card className="p-4 bg-white/5 backdrop-blur-xl border-warning/20">
            <Coins className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">89M</p>
            <p className="text-xs text-gray-400">CHZ échangés</p>
          </Card>
          <Card className="p-4 bg-white/5 backdrop-blur-xl border-success/20">
            <Trophy className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-gray-400">Matchs live</p>
          </Card>
        </motion.div>

        {/* Footer avec logos partenaires */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-0 right-0"
        >
          <div className="flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Sécurisé par Blockchain</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5" />
              <span className="text-sm">Powered by Chiliz</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Socios.com Partner</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Effets de lumière animés améliorés */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <motion.div
          animate={{
            x: ["-100%", "200%"],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5
          }}
          className="absolute top-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-xl"
        />
        <motion.div
          animate={{
            y: ["-100%", "200%"],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 2
          }}
          className="absolute left-1/2 w-1 h-96 bg-gradient-to-b from-transparent via-warning to-transparent blur-xl"
        />
      </div>

      {/* Ligne de scan futuriste */}
      <div className="scan-line" />
    </div>
  )
} 