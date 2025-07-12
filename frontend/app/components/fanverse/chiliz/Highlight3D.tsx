"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Heart, ThumbsDown, Rocket, Play, Share2, Download } from "lucide-react"
import { useSoundEffects } from "./SoundEffects"
import { useHapticFeedback } from "./MobileGestures"

interface Highlight3DProps {
  id: string
  title: string
  timestamp: string
  peakEmotion: {
    name: string
    icon: React.ReactNode
    color: string
  }
  image: string
  price: number
  mints: number
  onMint?: () => void
  onPlay?: () => void
  onShare?: () => void
}

export default function Highlight3D({
  id,
  title,
  timestamp,
  peakEmotion,
  image,
  price,
  mints,
  onMint,
  onPlay,
  onShare
}: Highlight3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const { playClick, playHover, playSuccess } = useSoundEffects()
  const { lightVibration, successVibration } = useHapticFeedback()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePosition({ x, y })
  }

  const handleMint = () => {
    playSuccess()
    successVibration()
    onMint?.()
  }

  const handlePlay = () => {
    playClick()
    lightVibration()
    setIsPlaying(!isPlaying)
    onPlay?.()
  }

  const handleShare = () => {
    playClick()
    lightVibration()
    onShare?.()
  }

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => {
        setIsHovered(true)
        playHover()
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        className="relative"
        animate={{
          rotateX: isHovered ? (mousePosition.y - 150) * 0.05 : 0,
          rotateY: isHovered ? (mousePosition.x - 150) * 0.05 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-primary/20 shadow-xl">
          {/* Effet de lueur au survol */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent-comp/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
          
          {/* Image avec effet 3D */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              style={{
                transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
              }}
            />
            
            {/* Overlay avec informations */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Badge d'émotion flottant */}
            <motion.div
              className="absolute top-4 right-4"
              animate={{
                scale: isHovered ? 1.2 : 1,
                rotateZ: isHovered ? 5 : 0,
              }}
              style={{
                transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
              }}
            >
              <Badge className={`${peakEmotion.color} bg-black/50 backdrop-blur-sm border-current`}>
                {peakEmotion.icon}
                <span className="ml-1">{peakEmotion.name}</span>
              </Badge>
            </motion.div>
            
            {/* Bouton play central */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  style={{
                    transform: "translateZ(40px)",
                  }}
                >
                  <Button
                    onClick={handlePlay}
                    className="rounded-full w-16 h-16 bg-primary/90 hover:bg-primary shadow-lg shadow-primary/50 border-2 border-white/20"
                  >
                    <Play className="w-6 h-6 text-white" fill="white" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Timestamp */}
            <div className="absolute bottom-4 left-4 text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
              {timestamp}
            </div>
          </div>
          
          <CardContent className="p-4">
            <motion.h3
              className="font-bold text-lg mb-2 text-white"
              style={{
                transform: isHovered ? "translateZ(10px)" : "translateZ(0px)",
              }}
            >
              {title}
            </motion.h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span>{mints} mints</span>
                <span>•</span>
                <span className="text-primary font-bold">{price} CHZ</span>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <motion.div
              className="flex space-x-2"
              style={{
                transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
              }}
            >
              <Button
                onClick={handleMint}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
              >
                <Zap className="w-4 h-4 mr-2" />
                Mint NFT
              </Button>
              
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                className="border-accent-comp/50 hover:bg-accent-comp/10"
              >
                <Download className="w-4 h-4" />
              </Button>
            </motion.div>
            
            {/* Indicateur de progression du mint */}
            <motion.div
              className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden"
              style={{
                transform: isHovered ? "translateZ(5px)" : "translateZ(0px)",
              }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent-comp"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((mints / 500) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
            
            <div className="text-xs text-gray-400 mt-1">
              {mints}/500 mints disponibles
            </div>
          </CardContent>
          
          {/* Particules flottantes */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    initial={{
                      x: mousePosition.x,
                      y: mousePosition.y,
                      opacity: 0,
                    }}
                    animate={{
                      x: mousePosition.x + (Math.random() - 0.5) * 100,
                      y: mousePosition.y + (Math.random() - 0.5) * 100,
                      opacity: [0, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    style={{
                      transform: "translateZ(50px)",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
      
      {/* Ombre 3D */}
      <motion.div
        className="absolute inset-0 bg-black/20 blur-xl -z-10"
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.8 : 0.3,
        }}
        style={{
          transform: `translateY(${isHovered ? "20px" : "10px"}) translateZ(-10px)`,
        }}
      />
    </motion.div>
  )
}

// Composant pour afficher une grille de highlights 3D
export function Highlight3DGrid({ highlights }: { highlights: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {highlights.map((highlight, index) => (
        <motion.div
          key={highlight.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Highlight3D {...highlight} />
        </motion.div>
      ))}
    </div>
  )
} 