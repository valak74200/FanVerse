import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  direction: number
}

interface AnimatedBackgroundProps {
  particleCount?: number
  primaryColor?: string
  secondaryColor?: string
  interactive?: boolean
}

export function AnimatedBackground({
  particleCount = 50,
  primaryColor = "rgba(255, 107, 53, 0.8)",
  secondaryColor = "rgba(255, 210, 63, 0.5)",
  interactive = true
}: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
      direction: Math.random() * 360,
    }))
    setParticles(newParticles)

    // Mouse tracking
    if (interactive) {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        })
      }

      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [particleCount, interactive])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 53, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 53, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Animated Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
            x: [
              `${particle.x}%`,
              `${(particle.x + Math.cos(particle.direction) * particle.speed * 10) % 100}%`,
              `${(particle.x + Math.cos(particle.direction) * particle.speed * 20) % 100}%`,
            ],
            y: [
              `${particle.y}%`,
              `${(particle.y + Math.sin(particle.direction) * particle.speed * 10) % 100}%`,
              `${(particle.y + Math.sin(particle.direction) * particle.speed * 20) % 100}%`,
            ],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(45deg, 
                ${primaryColor}, 
                ${secondaryColor}
              )`,
              boxShadow: `0 0 ${particle.size * 3}px ${primaryColor}`,
            }}
          />
        </motion.div>
      ))}

      {/* Mouse Interaction Effect */}
      {interactive && (
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Floating Orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          initial={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
        />
      ))}
    </div>
  )
}