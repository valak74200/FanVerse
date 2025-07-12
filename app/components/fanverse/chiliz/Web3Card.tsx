"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Shield, 
  Cpu, 
  Database, 
  Network, 
  Lock, 
  Unlock,
  TrendingUp,
  Activity,
  Hexagon
} from "lucide-react"
import { useSoundEffects } from "./SoundEffects"
import { useHapticFeedback } from "./MobileGestures"

interface Web3CardProps {
  title: string
  description: string
  icon?: React.ReactNode
  value?: string | number
  change?: number
  status?: 'active' | 'inactive' | 'pending' | 'success' | 'error'
  type?: 'primary' | 'secondary' | 'accent' | 'neon'
  interactive?: boolean
  glitch?: boolean
  children?: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function Web3Card({
  title,
  description,
  icon,
  value,
  change,
  status = 'active',
  type = 'primary',
  interactive = true,
  glitch = false,
  children,
  onClick,
  className = ""
}: Web3CardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [glitchEffect, setGlitchEffect] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { playHover, playClick, playSuccess } = useSoundEffects()
  const { lightVibration, mediumVibration } = useHapticFeedback()

  // Effet de glitch aléatoire
  useEffect(() => {
    if (!glitch) return
    
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchEffect(true)
        setTimeout(() => setGlitchEffect(false), 150)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [glitch])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePosition({ x, y })
  }

  const handleClick = () => {
    if (!interactive) return
    
    setIsActive(true)
    setTimeout(() => setIsActive(false), 200)
    
    playClick()
    mediumVibration()
    onClick?.()
  }

  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400'
      case 'inactive': return 'text-gray-400 border-gray-400'
      case 'pending': return 'text-yellow-400 border-yellow-400'
      case 'success': return 'text-primary border-primary'
      case 'error': return 'text-red-400 border-red-400'
      default: return 'text-green-400 border-green-400'
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'primary':
        return 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60'
      case 'secondary':
        return 'bg-gradient-to-br from-gray-900/80 to-gray-800/60 border-gray-600/30 hover:border-gray-500/60'
      case 'accent':
        return 'bg-gradient-to-br from-accent-comp/20 to-accent-comp/5 border-accent-comp/30 hover:border-accent-comp/60'
      case 'neon':
        return 'bg-gradient-to-br from-purple-900/20 to-pink-900/5 border-purple-500/30 hover:border-pink-500/60'
      default:
        return 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60'
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className={`group relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => {
        setIsHovered(true)
        interactive && playHover()
        interactive && lightVibration()
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{
        perspective: "1000px",
        cursor: interactive ? "pointer" : "default"
      }}
    >
      {/* Effet de lueur externe */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent-comp/20 to-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          scale: isHovered ? 1.05 : 1,
          opacity: isHovered ? 0.6 : 0,
        }}
      />

      {/* Carte principale */}
      <motion.div
        className="relative"
        animate={{
          rotateX: isHovered ? (mousePosition.y - 100) * 0.1 : 0,
          rotateY: isHovered ? (mousePosition.x - 150) * 0.1 : 0,
          scale: isActive ? 0.95 : isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <Card className={`
          overflow-hidden backdrop-blur-md border-2 transition-all duration-300
          ${getTypeStyles()}
          ${glitchEffect ? 'animate-pulse' : ''}
          ${isActive ? 'shadow-2xl shadow-primary/50' : ''}
        `}>
          {/* Effet holographique */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              x: isHovered ? ['-100%', '100%'] : '-100%',
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              ease: "linear"
            }}
          />

          {/* Overlay de réactivité à la souris */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />

          {/* Grille hexagonale de fond */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
                  <polygon points="25,2 45,15 45,35 25,48 5,35 5,15" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>

          {/* Header avec status et icône */}
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && (
                  <motion.div
                    className="p-2 rounded-lg bg-black/20 backdrop-blur-sm"
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                      rotate: isHovered ? 5 : 0,
                    }}
                    style={{
                      transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
                    }}
                  >
                    {icon}
                  </motion.div>
                )}
                <div>
                  <CardTitle className="text-lg font-bold text-white">
                    {title}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">{description}</p>
                </div>
              </div>
              
              {/* Badge de status */}
              <motion.div
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                style={{
                  transform: isHovered ? "translateZ(15px)" : "translateZ(0px)",
                }}
              >
                <Badge className={`${getStatusColor()} bg-black/30 backdrop-blur-sm`}>
                  <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
                  {status.toUpperCase()}
                </Badge>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            {/* Valeur principale */}
            {value && (
              <motion.div
                className="mb-4"
                style={{
                  transform: isHovered ? "translateZ(10px)" : "translateZ(0px)",
                }}
              >
                <div className="text-3xl font-bold text-white font-mono">
                  {value}
                </div>
                {change !== undefined && (
                  <div className={`text-sm flex items-center gap-1 ${
                    change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {change > 0 ? '+' : ''}{change}%
                  </div>
                )}
              </motion.div>
            )}

            {/* Contenu personnalisé */}
            {children && (
              <motion.div
                style={{
                  transform: isHovered ? "translateZ(5px)" : "translateZ(0px)",
                }}
              >
                {children}
              </motion.div>
            )}

            {/* Barres de données animées */}
            <div className="space-y-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent-comp"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 100}%` }}
                      transition={{ duration: 2, delay: i * 0.2 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {Math.floor(Math.random() * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Effet de scan */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{
                    top: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Coins décoratifs */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50" />
        </Card>
      </motion.div>

      {/* Ombre 3D */}
      <motion.div
        className="absolute inset-0 bg-black/20 blur-xl -z-10"
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.6 : 0.2,
        }}
        style={{
          transform: `translateY(${isHovered ? "15px" : "5px"}) translateZ(-10px)`,
        }}
      />
    </motion.div>
  )
}

// Composants spécialisés
export function StatsCard({ title, value, change, icon }: {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
}) {
  return (
    <Web3Card
      title={title}
      description="Statistiques en temps réel"
      value={value}
      change={change}
      icon={icon || <Activity className="w-5 h-5 text-primary" />}
      type="primary"
    />
  )
}

export function NetworkCard({ title, status, description }: {
  title: string
  status: 'active' | 'inactive' | 'pending'
  description: string
}) {
  return (
    <Web3Card
      title={title}
      description={description}
      status={status}
      icon={<Network className="w-5 h-5 text-accent-comp" />}
      type="accent"
    />
  )
}

export function SecurityCard({ title, isSecure, description }: {
  title: string
  isSecure: boolean
  description: string
}) {
  return (
    <Web3Card
      title={title}
      description={description}
      status={isSecure ? 'success' : 'error'}
      icon={isSecure ? <Lock className="w-5 h-5 text-green-400" /> : <Unlock className="w-5 h-5 text-red-400" />}
      type="secondary"
    />
  )
} 