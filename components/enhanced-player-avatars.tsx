"use client"

import React, { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Billboard } from "@react-three/drei"
import * as THREE from "three"

interface PlayerAvatarProps {
  position: [number, number, number]
  playerData: {
    name: string
    number: number
    team: "home" | "away"
    role: "goalkeeper" | "defender" | "midfielder" | "forward"
    isHighlighted: boolean
    currentAction: "running" | "kicking" | "celebrating" | "idle"
    hasball: boolean
  }
  ballPosition?: [number, number, number]
}

export function PlayerAvatar({ position, playerData, ballPosition }: PlayerAvatarProps) {
  const playerRef = useRef(null)
  const bodyRef = useRef(null)
  const headRef = useRef(null)
  const legsRef = useRef(null)
  const armsRef = useRef(null)
  const [animationTime, setAnimationTime] = useState(0)

  // Couleurs d'équipe
  const teamColors = {
    home: { 
      primary: "#1e40af", 
      secondary: "#ffffff", 
      accent: "#3b82f6",
      goalkeeper: "#22c55e"
    },
    away: { 
      primary: "#dc2626", 
      secondary: "#ffffff", 
      accent: "#ef4444",
      goalkeeper: "#f59e0b"
    }
  }

  const colors = teamColors[playerData.team]
  const jerseyColor = playerData.role === "goalkeeper" ? colors.goalkeeper : colors.primary

  // Animations basées sur l'action
  useFrame((state: any) => {
    if (playerRef.current && bodyRef.current && headRef.current && legsRef.current && armsRef.current) {
      const time = state.clock.getElapsedTime()
      setAnimationTime(time)

      // Animation basée sur l'action
      switch (playerData.currentAction) {
        case "running":
          // Course - mouvement des jambes et bras
          legsRef.current.children.forEach((leg: any, i: number) => {
            const legMesh = leg as THREE.Mesh
            const legOffset = i === 0 ? 1 : -1
            legMesh.rotation.x = Math.sin(time * 8 + legOffset) * 0.6
          })
          
          armsRef.current.children.forEach((arm: any, i: number) => {
            const armMesh = arm as THREE.Mesh
            const armOffset = i === 0 ? -1 : 1
            armMesh.rotation.x = Math.sin(time * 8 + armOffset) * 0.4
          })
          
          // Légère inclinaison du corps
          bodyRef.current.rotation.x = Math.sin(time * 4) * 0.1
          break

        case "kicking":
          // Frappe - jambe qui se lève
          const rightLeg = legsRef.current.children[1] as THREE.Mesh
          rightLeg.rotation.x = Math.sin(time * 12) * 0.8
          
          // Bras pour l'équilibre
          armsRef.current.children.forEach((arm: any, i: number) => {
            const armMesh = arm as THREE.Mesh
            armMesh.rotation.z = Math.sin(time * 6) * 0.3 * (i === 0 ? 1 : -1)
          })
          break

        case "celebrating":
          // Célébration - bras en l'air
          armsRef.current.children.forEach((arm: any) => {
            const armMesh = arm as THREE.Mesh
            armMesh.rotation.x = -Math.PI / 2 + Math.sin(time * 4) * 0.2
          })
          
          // Saut de joie
          playerRef.current.position.y = position[1] + Math.abs(Math.sin(time * 6)) * 0.5
          
          // Rotation de la tête
          headRef.current.rotation.y = Math.sin(time * 3) * 0.3
          break

        default:
          // Idle - respiration légère
          bodyRef.current.position.y = Math.sin(time * 2) * 0.05
          headRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
      }

      // Highlight effect
      if (playerData.isHighlighted) {
        const highlightIntensity = Math.sin(time * 4) * 0.3 + 0.7
        const material = bodyRef.current.material as THREE.MeshStandardMaterial
        material.emissiveIntensity = highlightIntensity * 0.2
      }
    }
  })

  return (
    <group ref={playerRef} position={position as any}>
      {/* Corps principal */}
      <mesh ref={bodyRef} position={[0, 0, 0] as any}>
        <cylinderGeometry args={[0.35, 0.4, 1.4, 8]} />
        <meshStandardMaterial 
          color={jerseyColor}
          roughness={0.6}
          metalness={0.1}
          emissive={playerData.isHighlighted ? jerseyColor : "#000000"}
          emissiveIntensity={playerData.isHighlighted ? 0.1 : 0}
        />
      </mesh>

      {/* Tête */}
      <mesh ref={headRef} position={[0, 1.0, 0] as any}>
        <sphereGeometry args={[0.28, 12, 8]} />
        <meshStandardMaterial 
          color="#ffdbac"
          roughness={0.8}
        />
      </mesh>

      {/* Cheveux */}
      <mesh position={[0, 1.2, 0] as any}>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshStandardMaterial 
          color="#4a4a4a"
          roughness={0.9}
        />
      </mesh>

      {/* Bras */}
      <group ref={armsRef} position={[0, 0.4, 0] as any}>
        {/* Bras gauche */}
        <mesh position={[-0.5, 0, 0] as any}>
          <cylinderGeometry args={[0.09, 0.11, 0.9, 6]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        
        {/* Bras droit */}
        <mesh position={[0.5, 0, 0] as any}>
          <cylinderGeometry args={[0.09, 0.11, 0.9, 6]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </group>

      {/* Jambes */}
      <group ref={legsRef} position={[0, -0.9, 0] as any}>
        {/* Jambe gauche */}
        <mesh position={[-0.18, 0, 0] as any}>
          <cylinderGeometry args={[0.13, 0.16, 0.9, 6]} />
          <meshStandardMaterial color={colors.secondary} />
        </mesh>
        
        {/* Jambe droite */}
        <mesh position={[0.18, 0, 0] as any}>
          <cylinderGeometry args={[0.13, 0.16, 0.9, 6]} />
          <meshStandardMaterial color={colors.secondary} />
        </mesh>
      </group>

      {/* Chaussures */}
      <group position={[0, -1.5, 0] as any}>
        <mesh position={[-0.18, 0, 0.1] as any}>
          <boxGeometry args={[0.2, 0.15, 0.4]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.18, 0, 0.1] as any}>
          <boxGeometry args={[0.2, 0.15, 0.4]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Numéro sur le maillot */}
      <Billboard position={[0, 0.2, 0.41] as any}>
        <Text
          fontSize={0.3}
          color={colors.secondary}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {playerData.number}
        </Text>
      </Billboard>

      {/* Nom du joueur */}
      <Billboard position={[0, 2.0, 0] as any}>
        <Text
          fontSize={0.18}
          color={jerseyColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {playerData.name}
        </Text>
      </Billboard>

      {/* Indicateur de possession du ballon */}
      {playerData.hasball && (
        <mesh position={[0, 2.5, 0] as any}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshStandardMaterial 
            color="#ffff00"
            transparent
            opacity={0.6}
            emissive="#ffff00"
            emissiveIntensity={0.4}
          />
        </mesh>
      )}

      {/* Aura pour le joueur mis en avant */}
      {playerData.isHighlighted && (
        <mesh position={[0, 0, 0] as any}>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
          <meshStandardMaterial 
            color={jerseyColor}
            transparent
            opacity={0.3}
            emissive={jerseyColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}

// Ballon de football 3D
export function SoccerBall({ position }: { position: [number, number, number] }) {
  const ballRef = useRef(null)

  useFrame((state: any) => {
    if (ballRef.current) {
      const time = state.clock.getElapsedTime()
      ballRef.current.rotation.x = time * 2
      ballRef.current.rotation.y = time * 1.5
    }
  })

  return (
    <mesh ref={ballRef} position={position as any}>
      <sphereGeometry args={[0.22, 16, 12]} />
      <meshStandardMaterial 
        color="#ffffff"
        roughness={0.8}
        metalness={0.1}
      />
      
      {/* Motifs du ballon */}
      <mesh>
        <sphereGeometry args={[0.221, 16, 12]} />
        <meshStandardMaterial 
          color="#000000"
          transparent
          opacity={0.3}
          roughness={0.9}
        />
      </mesh>
    </mesh>
  )
}

// Équipe complète
export function PlayerTeam({ 
  team, 
  formation = "4-3-3",
  highlightedPlayer,
  ballPosition 
}: { 
  team: "home" | "away"
  formation?: string
  highlightedPlayer?: number
  ballPosition?: [number, number, number]
}) {
  const formations = {
    "4-3-3": {
      goalkeeper: [[0, 0, team === "home" ? -45 : 45]],
      defenders: [
        [-15, 0, team === "home" ? -35 : 35],
        [-5, 0, team === "home" ? -35 : 35],
        [5, 0, team === "home" ? -35 : 35],
        [15, 0, team === "home" ? -35 : 35]
      ],
      midfielders: [
        [-10, 0, team === "home" ? -20 : 20],
        [0, 0, team === "home" ? -20 : 20],
        [10, 0, team === "home" ? -20 : 20]
      ],
      forwards: [
        [-10, 0, team === "home" ? -5 : 5],
        [0, 0, team === "home" ? -5 : 5],
        [10, 0, team === "home" ? -5 : 5]
      ]
    }
  }

  const positions = formations[formation as keyof typeof formations]
  
  const players = [
    { name: "Gardien", number: 1, role: "goalkeeper", positions: positions.goalkeeper },
    { name: "Défenseur", number: 2, role: "defender", positions: positions.defenders },
    { name: "Milieu", number: 8, role: "midfielder", positions: positions.midfielders },
    { name: "Attaquant", number: 10, role: "forward", positions: positions.forwards }
  ]

  return (
    <group>
      {players.map((playerType, typeIndex) => 
        playerType.positions.map((pos, posIndex) => {
          const playerNumber = typeIndex * 3 + posIndex + 1
          const isHighlighted = highlightedPlayer === playerNumber
          const hasball = ballPosition && 
            Math.abs(ballPosition[0] - pos[0]) < 2 && 
            Math.abs(ballPosition[2] - pos[2]) < 2

          return (
            <PlayerAvatar
              key={`${team}-${playerNumber}`}
              position={pos as [number, number, number]}
              playerData={{
                name: `${playerType.name} ${posIndex + 1}`,
                number: playerNumber,
                team,
                role: playerType.role as any,
                isHighlighted,
                currentAction: hasball ? "kicking" : isHighlighted ? "celebrating" : "idle",
                hasball: Boolean(hasball)
              }}
              ballPosition={ballPosition}
            />
          )
        })
      )}
    </group>
  )
}

// Composant principal du match
export function EnhancedPlayerAvatars({ 
  highlightedPlayer,
  ballPosition = [0, 0.5, 0] 
}: { 
  highlightedPlayer?: number
  ballPosition?: [number, number, number]
}) {
  return (
    <group>
      {/* Équipe domicile */}
      <PlayerTeam 
        team="home" 
        formation="4-3-3"
        highlightedPlayer={highlightedPlayer}
        ballPosition={ballPosition}
      />
      
      {/* Équipe visiteur */}
      <PlayerTeam 
        team="away" 
        formation="4-3-3"
        highlightedPlayer={highlightedPlayer}
        ballPosition={ballPosition}
      />
      
      {/* Ballon */}
      <SoccerBall position={ballPosition} />
    </group>
  )
} 