"use client"

import React, { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Billboard } from "@react-three/drei"
import * as THREE from "three"

interface FanAvatarProps {
  position: [number, number, number]
  fanData: {
    name: string
    team: "home" | "away"
    vipLevel: number
    emotion: "hype" | "love" | "shock" | "rage" | "neutral"
    isActive: boolean
  }
  crowdVolume: number
}

export function FanAvatar({ position, fanData, crowdVolume }: FanAvatarProps) {
  const avatarRef = useRef(null)
  const bodyRef = useRef(null)
  const headRef = useRef(null)
  const armsRef = useRef(null)

  // Couleurs d'équipe
  const teamColors = {
    home: { primary: "#1e40af", secondary: "#3b82f6", accent: "#60a5fa" },
    away: { primary: "#dc2626", secondary: "#ef4444", accent: "#f87171" }
  }

  const colors = teamColors[fanData.team]

  // Couleurs d'émotion
  const emotionColors = {
    hype: "#ff6b35",
    love: "#ff1744",
    shock: "#ffeb3b",
    rage: "#d32f2f",
    neutral: "#9e9e9e"
  }

  // Animation basée sur l'émotion et le volume
  useFrame((state: any) => {
    if (avatarRef.current && bodyRef.current && headRef.current && armsRef.current) {
      const time = state.clock.getElapsedTime()
      const intensity = (crowdVolume / 100) * (fanData.isActive ? 1.5 : 0.8)
      
      // Animation de base
      const baseAnimation = Math.sin(time * 2 + position[0] * 0.1) * intensity * 0.3
      
      // Animation spécifique à l'émotion
      let emotionMultiplier = 1
      switch (fanData.emotion) {
        case "hype":
          emotionMultiplier = 2
          // Saut plus prononcé
          avatarRef.current.position.y = position[1] + Math.abs(Math.sin(time * 4)) * intensity * 0.8
          break
        case "love":
          emotionMultiplier = 1.2
          // Balancement doux
          avatarRef.current.rotation.z = Math.sin(time * 1.5) * 0.1 * intensity
          break
        case "shock":
          emotionMultiplier = 0.5
          // Mouvement saccadé
          headRef.current.rotation.x = Math.sin(time * 8) * 0.2 * intensity
          break
        case "rage":
          emotionMultiplier = 1.8
          // Agitation
          armsRef.current.rotation.z = Math.sin(time * 6) * 0.3 * intensity
          break
        default:
          emotionMultiplier = 0.6
      }

      // Mouvement des bras
      armsRef.current.children.forEach((arm: any, i: number) => {
        const armMesh = arm as THREE.Mesh
        const armOffset = i === 0 ? 1 : -1
        armMesh.rotation.z = Math.sin(time * 3 + armOffset) * 0.4 * intensity * emotionMultiplier
      })

      // Rotation de la tête
      headRef.current.rotation.y = Math.sin(time * 1.2) * 0.2 * intensity
    }
  })

  return (
    <group ref={avatarRef} position={position as any}>
      {/* Corps principal */}
      <mesh ref={bodyRef} position={[0, 0, 0] as any}>
        <cylinderGeometry args={[0.3, 0.4, 1.2, 8]} />
        <meshStandardMaterial 
          color={colors.primary}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Tête */}
      <mesh ref={headRef} position={[0, 0.9, 0] as any}>
        <sphereGeometry args={[0.25, 12, 8]} />
        <meshStandardMaterial 
          color="#ffdbac"
          roughness={0.8}
        />
      </mesh>

      {/* Bras */}
      <group ref={armsRef} position={[0, 0.3, 0] as any}>
        {/* Bras gauche */}
        <mesh position={[-0.45, 0, 0] as any}>
          <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        
        {/* Bras droit */}
        <mesh position={[0.45, 0, 0] as any}>
          <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </group>

      {/* Jambes */}
      <group position={[0, -0.8, 0] as any}>
        <mesh position={[-0.15, 0, 0] as any}>
          <cylinderGeometry args={[0.12, 0.15, 0.8, 6]} />
          <meshStandardMaterial color={colors.secondary} />
        </mesh>
        <mesh position={[0.15, 0, 0] as any}>
          <cylinderGeometry args={[0.12, 0.15, 0.8, 6]} />
          <meshStandardMaterial color={colors.secondary} />
        </mesh>
      </group>

      {/* Accessoires VIP */}
      {fanData.vipLevel > 0 && (
        <mesh position={[0, 1.3, 0] as any}>
          <cylinderGeometry args={[0.15, 0.2, 0.1, 8]} />
          <meshStandardMaterial 
            color="#ffd700"
            emissive="#ffaa00"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Écharpe d'équipe */}
      <mesh position={[0, 0.5, 0] as any} rotation={[0, 0, Math.PI / 6] as any}>
        <boxGeometry args={[0.8, 0.1, 0.05]} />
        <meshStandardMaterial color={colors.accent} />
      </mesh>

      {/* Aura d'émotion */}
      {fanData.emotion !== "neutral" && (
        <mesh position={[0, 0, 0] as any}>
          <sphereGeometry args={[0.8, 16, 8]} />
          <meshStandardMaterial 
            color={emotionColors[fanData.emotion]}
            transparent
            opacity={0.1}
            emissive={emotionColors[fanData.emotion]}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {/* Nom du supporter */}
      <Billboard position={[0, 1.8, 0] as any}>
        <Text
          fontSize={0.15}
          color={colors.primary}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {fanData.name}
        </Text>
      </Billboard>
    </group>
  )
}

// Générateur de tribune avec supporters
export function StadiumTribune({ 
  section, 
  crowdVolume, 
  emotionData 
}: { 
  section: "north" | "south" | "east" | "west"
  crowdVolume: number
  emotionData: { [key: string]: number }
}) {
  const fans = useMemo(() => {
    const fanList = []
    const sectionConfig = {
      north: { startAngle: -Math.PI / 4, endAngle: Math.PI / 4, team: "home" as const },
      south: { startAngle: 3 * Math.PI / 4, endAngle: 5 * Math.PI / 4, team: "away" as const },
      east: { startAngle: Math.PI / 4, endAngle: 3 * Math.PI / 4, team: "home" as const },
      west: { startAngle: 5 * Math.PI / 4, endAngle: 7 * Math.PI / 4, team: "away" as const }
    }

    const config = sectionConfig[section]
    const fanCount = 80 + Math.floor(Math.random() * 40)

    for (let i = 0; i < fanCount; i++) {
      const angle = config.startAngle + (config.endAngle - config.startAngle) * Math.random()
      const radius = 35 + Math.random() * 15
      const height = 2 + Math.random() * 20
      
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = height

      const emotions = ["hype", "love", "shock", "rage", "neutral"] as const
      const emotion = emotions[Math.floor(Math.random() * emotions.length)]

      fanList.push({
        id: `fan-${section}-${i}`,
        position: [x, y, z] as [number, number, number],
        fanData: {
          name: `Fan${i + 1}`,
          team: config.team,
          vipLevel: Math.random() > 0.9 ? 1 : 0,
          emotion,
          isActive: Math.random() > 0.3
        }
      })
    }

    return fanList
  }, [section])

  return (
    <group>
      {fans.map((fan) => (
        <FanAvatar
          key={fan.id}
          position={fan.position}
          fanData={fan.fanData}
          crowdVolume={crowdVolume}
        />
      ))}
    </group>
  )
}

// Composant principal des supporters
export function EnhancedFanAvatars({ 
  crowdVolume, 
  emotionData 
}: { 
  crowdVolume: number
  emotionData: { [key: string]: number }
}) {
  return (
    <group>
      <StadiumTribune section="north" crowdVolume={crowdVolume} emotionData={emotionData} />
      <StadiumTribune section="south" crowdVolume={crowdVolume} emotionData={emotionData} />
      <StadiumTribune section="east" crowdVolume={crowdVolume} emotionData={emotionData} />
      <StadiumTribune section="west" crowdVolume={crowdVolume} emotionData={emotionData} />
    </group>
  )
} 