"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  type: 'block' | 'transaction' | 'validator' | 'user'
  connections: number[]
  pulse: number
  data: string
}

interface DataStream {
  x: number
  y: number
  targetX: number
  targetY: number
  progress: number
  speed: number
  color: string
  data: string
}

export default function Web3Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const dataStreamsRef = useRef<DataStream[]>([])
  const animationRef = useRef<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Données blockchain simulées
    const blockchainData = [
      "0x1a2b3c4d5e6f...",
      "Block #847392",
      "Gas: 21000",
      "Tx: 0xabcd...",
      "Validator: 0x9876...",
      "Stake: 32 ETH",
      "Reward: 0.05 CHZ",
      "Consensus: PoS",
      "Finality: 12s",
      "TPS: 10000"
    ]

    const createNode = (x?: number, y?: number, type?: Node['type']): Node => {
      const nodeTypes: Node['type'][] = ['block', 'transaction', 'validator', 'user']
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: type === 'block' ? 8 : type === 'validator' ? 6 : 4,
        type: type ?? nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        data: blockchainData[Math.floor(Math.random() * blockchainData.length)]
      }
    }

    const createDataStream = (fromNode: Node, toNode: Node): DataStream => {
      return {
        x: fromNode.x,
        y: fromNode.y,
        targetX: toNode.x,
        targetY: toNode.y,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01,
        color: fromNode.type === 'block' ? '#ff6b35' : 
               fromNode.type === 'validator' ? '#4ecdc4' : 
               fromNode.type === 'transaction' ? '#45b7d1' : '#96ceb4',
        data: fromNode.data
      }
    }

    const initializeNetwork = () => {
      nodesRef.current = []
      // Créer les nœuds
      for (let i = 0; i < 50; i++) {
        nodesRef.current.push(createNode())
      }

      // Créer les connexions
      nodesRef.current.forEach((node, index) => {
        const nearbyNodes = nodesRef.current
          .map((otherNode, otherIndex) => ({ node: otherNode, index: otherIndex }))
          .filter(({ node: otherNode, index: otherIndex }) => {
            if (otherIndex === index) return false
            const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y)
            return distance < 150
          })
          .sort((a, b) => {
            const distA = Math.hypot(node.x - a.node.x, node.y - a.node.y)
            const distB = Math.hypot(node.x - b.node.x, node.y - b.node.y)
            return distA - distB
          })
          .slice(0, 3)

        node.connections = nearbyNodes.map(({ index }) => index)
      })
    }

    const updateNodes = () => {
      nodesRef.current.forEach((node, index) => {
        // Mouvement des nœuds
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.1

        // Attraction vers la souris désactivée
        // const dx = mousePosition.x - node.x
        // const dy = mousePosition.y - node.y
        // const distance = Math.sqrt(dx * dx + dy * dy)
        
        // if (distance < 100) {
        //   const force = (100 - distance) / 100 * 0.001
        //   node.vx += (dx / distance) * force
        //   node.vy += (dy / distance) * force
        // }

        // Rebond sur les bords
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Créer des flux de données occasionnellement
        if (Math.random() < 0.005 && node.connections.length > 0) {
          const targetIndex = node.connections[Math.floor(Math.random() * node.connections.length)]
          const targetNode = nodesRef.current[targetIndex]
          if (targetNode) {
            dataStreamsRef.current.push(createDataStream(node, targetNode))
          }
        }
      })

      // Mettre à jour les flux de données
      dataStreamsRef.current = dataStreamsRef.current.filter(stream => {
        stream.progress += stream.speed
        
        const currentX = stream.x + (stream.targetX - stream.x) * stream.progress
        const currentY = stream.y + (stream.targetY - stream.y) * stream.progress
        
        stream.x = currentX
        stream.y = currentY
        
        return stream.progress < 1
      })

      // Limiter le nombre de flux de données
      if (dataStreamsRef.current.length > 20) {
        dataStreamsRef.current = dataStreamsRef.current.slice(-20)
      }
    }

    const drawNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dessiner les connexions
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      nodesRef.current.forEach(node => {
        node.connections.forEach(connectionIndex => {
          const connectedNode = nodesRef.current[connectionIndex]
          if (connectedNode) {
            const distance = Math.hypot(node.x - connectedNode.x, node.y - connectedNode.y)
            const opacity = Math.max(0, (150 - distance) / 150 * 0.3)
            
            ctx.globalAlpha = opacity
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(connectedNode.x, connectedNode.y)
            ctx.stroke()
          }
        })
      })

      // Dessiner les nœuds
      nodesRef.current.forEach(node => {
        const pulseSize = Math.sin(node.pulse) * 2 + node.size
        
        // Couleur selon le type
        const colors = {
          block: '#ff6b35',
          transaction: '#45b7d1',
          validator: '#4ecdc4',
          user: '#96ceb4'
        }
        
        ctx.globalAlpha = 0.8
        ctx.fillStyle = colors[node.type]
        
        // Nœud principal
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Effet de lueur
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize * 2, 0, Math.PI * 2)
        ctx.fill()
        
        // Hexagone pour les blocs
        if (node.type === 'block') {
          ctx.globalAlpha = 0.6
          ctx.strokeStyle = colors[node.type]
          ctx.lineWidth = 2
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3
            const x = node.x + Math.cos(angle) * (pulseSize + 5)
            const y = node.y + Math.sin(angle) * (pulseSize + 5)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.stroke()
        }
      })

      // Dessiner les flux de données
      dataStreamsRef.current.forEach(stream => {
        ctx.globalAlpha = 0.8
        ctx.fillStyle = stream.color
        ctx.shadowBlur = 10
        ctx.shadowColor = stream.color
        
        // Particule de données
        ctx.beginPath()
        ctx.arc(stream.x, stream.y, 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Traînée
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.arc(stream.x, stream.y, 8, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 0
      })

      // Dessiner la grille hexagonale en arrière-plan
      ctx.globalAlpha = 0.05
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      const hexSize = 50
      for (let x = 0; x < canvas.width + hexSize; x += hexSize * 1.5) {
        for (let y = 0; y < canvas.height + hexSize; y += hexSize * Math.sqrt(3)) {
          const offsetX = (y / (hexSize * Math.sqrt(3))) % 2 === 1 ? hexSize * 0.75 : 0
          drawHexagon(ctx, x + offsetX, y, hexSize / 2)
        }
      }

      ctx.globalAlpha = 1
    }

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        const px = x + Math.cos(angle) * size
        const py = y + Math.sin(angle) * size
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
    }

    const animate = () => {
      updateNodes()
      drawNetwork()
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleClick = (e: MouseEvent) => {
      // Créer un nouveau nœud au clic
      const newNode = createNode(e.clientX, e.clientY, 'transaction')
      nodesRef.current.push(newNode)
      
      // Créer des connexions avec les nœuds proches
      const nearbyNodes = nodesRef.current
        .map((node, index) => ({ node, index }))
        .filter(({ node }) => {
          const distance = Math.hypot(newNode.x - node.x, newNode.y - node.y)
          return distance < 100 && distance > 0
        })
        .slice(0, 3)
      
      newNode.connections = nearbyNodes.map(({ index }) => index)
      
      // Limiter le nombre de nœuds
      if (nodesRef.current.length > 80) {
        nodesRef.current = nodesRef.current.slice(-80)
      }
    }

    resize()
    initializeNetwork()
    
    window.addEventListener('resize', resize)
    // window.addEventListener('mousemove', handleMouseMove)
    // window.addEventListener('click', handleClick)
    
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      // window.removeEventListener('mousemove', handleMouseMove)
      // window.removeEventListener('click', handleClick)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  )
} 