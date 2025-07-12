"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const colors = [
      "rgba(252, 165, 165, 0.8)", // red-300
      "rgba(253, 186, 116, 0.8)", // orange-300
      "rgba(252, 211, 77, 0.8)",  // yellow-300
      "rgba(134, 239, 172, 0.8)", // green-300
      "rgba(147, 197, 253, 0.8)", // blue-300
      "rgba(196, 181, 253, 0.8)", // purple-300
    ]

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (x?: number, y?: number): Particle => {
      const size = Math.random() * 3 + 1
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 200 + 100,
      }
    }

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life++
        particle.x += particle.vx
        particle.y += particle.vy

        // Attraction vers la souris
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }

        // Friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Fade out
        particle.opacity = Math.max(0, particle.opacity - 0.005)

        // Rebond sur les bords
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8

        return particle.life < particle.maxLife && particle.opacity > 0
      })

      // Ajouter de nouvelles particules
      if (particlesRef.current.length < 150) {
        particlesRef.current.push(createParticle())
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(particle => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Effet de lueur
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Connexions entre particules proches
      ctx.strokeStyle = "rgba(252, 165, 165, 0.1)"
      ctx.lineWidth = 1
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 80) {
            ctx.globalAlpha = (80 - distance) / 80 * 0.3
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      // Créer des particules au passage de la souris
      if (Math.random() < 0.3) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY))
      }
    }

    const handleClick = (e: MouseEvent) => {
      // Explosion de particules au clic
      for (let i = 0; i < 15; i++) {
        const particle = createParticle(e.clientX, e.clientY)
        const angle = (Math.PI * 2 * i) / 15
        particle.vx = Math.cos(angle) * 5
        particle.vy = Math.sin(angle) * 5
        particle.size = Math.random() * 4 + 2
        particlesRef.current.push(particle)
      }
    }

    // Initialisation
    resize()
    for (let i = 0; i < 100; i++) {
      particlesRef.current.push(createParticle())
    }

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  )
} 