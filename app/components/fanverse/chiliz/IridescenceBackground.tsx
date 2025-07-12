"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface IridescenceBackgroundProps {
  intensity?: number
  speed?: number
  colors?: string[]
  interactive?: boolean
  particleCount?: number
  className?: string
}

export default function IridescenceBackground({
  intensity = 0.8,
  speed = 1,
  colors = [
    "#ff0080", // Pink
    "#00d4ff", // Cyan
    "#ff4000", // Orange-Red
    "#8000ff", // Purple
    "#00ff80", // Green
    "#ffff00", // Yellow
    "#ff8000", // Orange
    "#0080ff", // Blue
  ],
  interactive = true,
  particleCount = 50,
  className = "",
}: IridescenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const controls = useAnimation()

  // Particles system
  const particlesRef = useRef<Particle[]>([])

  class Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    color: string
    opacity: number
    life: number
    maxLife: number
    hue: number
    saturation: number
    lightness: number

    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.vx = (Math.random() - 0.5) * 2 * speed
      this.vy = (Math.random() - 0.5) * 2 * speed
      this.radius = Math.random() * 3 + 1
      this.hue = Math.random() * 360
      this.saturation = 70 + Math.random() * 30
      this.lightness = 50 + Math.random() * 30
      this.color = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`
      this.opacity = Math.random() * 0.8 + 0.2
      this.maxLife = 100 + Math.random() * 200
      this.life = this.maxLife
    }

    update(canvas: HTMLCanvasElement) {
      this.x += this.vx
      this.y += this.vy
      this.life--

      // Bounce off walls
      if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1
      if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1

      // Update color (iridescence effect)
      this.hue += speed * 0.5
      if (this.hue >= 360) this.hue = 0
      this.color = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`

      // Update opacity based on life
      this.opacity = (this.life / this.maxLife) * intensity
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save()
      ctx.globalAlpha = this.opacity
      
      // Glow effect
      ctx.shadowBlur = 20
      ctx.shadowColor = this.color
      
      // Main particle
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
      
      // Inner glow
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness + 20}%)`
      ctx.fill()
      
      ctx.restore()
    }

    isDead() {
      return this.life <= 0
    }
  }

  // Initialize particles
  const initParticles = () => {
    particlesRef.current = []
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(
        new Particle(
          Math.random() * dimensions.width,
          Math.random() * dimensions.height
        )
      )
    }
  }

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with fade effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create iridescent background gradient
    const gradient = ctx.createRadialGradient(
      mousePosition.x,
      mousePosition.y,
      0,
      mousePosition.x,
      mousePosition.y,
      Math.max(canvas.width, canvas.height) * 0.5
    )

    colors.forEach((color, index) => {
      const stop = index / (colors.length - 1)
      gradient.addColorStop(stop, `${color}${Math.floor(intensity * 40).toString(16).padStart(2, "0")}`)
    })

    // Apply gradient
    ctx.save()
    ctx.globalCompositeOperation = "screen"
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      particle.update(canvas)
      particle.draw(ctx)

      // Remove dead particles
      if (particle.isDead()) {
        particlesRef.current.splice(index, 1)
        // Add new particle
        particlesRef.current.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          )
        )
      }
    })

    // Create connecting lines between nearby particles
    if (interactive) {
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.save()
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 100) * 0.2})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })
    }

    // Interactive mouse effects
    if (interactive) {
      const gradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        150
      )
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.save()
      ctx.globalCompositeOperation = "screen"
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!interactive) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Handle resize
  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  // Setup effects
  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [interactive])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    initParticles()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions])

  return (
    <>
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-0 ${className}`}
        style={{
          background: "linear-gradient(45deg, #0a0a0a, #1a1a1a, #0a0a0a)",
        }}
      />

      {/* CSS Gradient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 0, 128, ${intensity * 0.1}) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 212, 255, ${intensity * 0.1}) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 64, 0, ${intensity * 0.1}) 0%, transparent 50%),
            radial-gradient(circle at 60% 30%, rgba(128, 0, 255, ${intensity * 0.1}) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(0, 255, 128, ${intensity * 0.1}) 0%, transparent 50%)
          `,
        }}
      />

      {/* Animated Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-xl opacity-20"
            style={{
              background: `linear-gradient(45deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Mesh Gradient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              ${colors[0]}00, 
              ${colors[1]}20, 
              ${colors[2]}00, 
              ${colors[3]}20, 
              ${colors[4]}00, 
              ${colors[5]}20, 
              ${colors[6]}00, 
              ${colors[7]}20, 
              ${colors[0]}00
            )
          `,
          animation: "spin 60s linear infinite",
        }}
      />

      {/* Shimmer Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 70%
            )
          `,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}