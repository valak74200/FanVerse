"use client"
import { useEffect, useRef } from "react"

export default function GridOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frameId: number
    let time = 0
    const gridSize = 30
    const dotSize = 1
    const lineThickness = 0.5

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const draw = () => {
      time += 0.002
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const offsetX = (time * 10) % gridSize
      const offsetY = (time * 5) % gridSize

      for (let x = -offsetX; x < canvas.width; x += gridSize) {
        for (let y = -offsetY; y < canvas.height; y += gridSize) {
          const distToCenter = Math.sqrt(
            Math.pow(x + offsetX - canvas.width / 2, 2) + Math.pow(y + offsetY - canvas.height / 2, 2),
          )
          const opacity = Math.max(0, 0.5 - distToCenter / (Math.max(canvas.width, canvas.height) * 1.2))

          // Draw lines
          ctx.strokeStyle = `hsla(var(--primary), ${opacity * 0.5})`
          ctx.lineWidth = lineThickness
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + gridSize, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + gridSize)
          ctx.stroke()

          // Draw dots
          ctx.fillStyle = `hsla(var(--primary), ${opacity})`
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      frameId = requestAnimationFrame(draw)
    }

    window.addEventListener("resize", resize)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-9 pointer-events-none"
      style={{ zIndex: -9 }}
    />
  )
}
