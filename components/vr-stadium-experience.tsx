"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Billboard } from "@react-three/drei"
import * as THREE from "three"

interface VRStadiumExperienceProps {
  matchTime: { minutes: number; seconds: number }
  collectiveEmotion: number
}

export function VRStadiumExperience({ matchTime, collectiveEmotion }: VRStadiumExperienceProps) {
  const [vrPosition, setVrPosition] = useState(new THREE.Vector3(0, 5, -30))
  const scoreboardRef = useRef<THREE.Group>(null)

  // VR-specific stadium enhancements
  const VRScoreboard = () => (
    <group ref={scoreboardRef} position={[0, 20, -52]}>
      <mesh>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#000000" emissive="#001122" emissiveIntensity={0.2} />
      </mesh>

      {/* Match Info */}
      <Text
        position={[0, 2, 0.1]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        PSG 2 - 1 BARCELONA
      </Text>

      {/* Timer */}
      <Text position={[0, 0, 0.1]} fontSize={1} color="#00ff00" anchorX="center" anchorY="middle">
        {matchTime.minutes}:{matchTime.seconds.toString().padStart(2, "0")}
      </Text>

      {/* Collective Emotion Meter */}
      <Text position={[0, -2, 0.1]} fontSize={0.8} color="#3b82f6" anchorX="center" anchorY="middle">
        CROWD ENERGY: {collectiveEmotion}%
      </Text>
    </group>
  )

  // VR Crowd Atmosphere
  const VRCrowdEffects = () => {
    const crowdSoundRef = useRef<THREE.Group>(null)

    useFrame(() => {
      if (crowdSoundRef.current) {
        // Simulate 3D spatial audio positioning
        const intensity = collectiveEmotion / 100
        crowdSoundRef.current.children.forEach((child, i) => {
          const mesh = child as THREE.Mesh
          const time = Date.now() * 0.001
          mesh.scale.setScalar(1 + Math.sin(time + i) * intensity * 0.3)
        })
      }
    })

    return (
      <group ref={crowdSoundRef}>
        {/* Sound visualization spheres around stadium */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2
          const x = Math.cos(angle) * 45
          const z = Math.sin(angle) * 45

          return (
            <mesh key={i} position={[x, 10, z]}>
              <sphereGeometry args={[0.5]} />
              <meshStandardMaterial
                color="#3b82f6"
                transparent
                opacity={0.3 + (collectiveEmotion / 100) * 0.4}
                emissive="#3b82f6"
                emissiveIntensity={collectiveEmotion / 200}
              />
            </mesh>
          )
        })}
      </group>
    )
  }

  // VR Player Highlights
  const VRPlayerHighlights = () => {
    const highlightedPlayers = [
      { position: [10, -1, 8], name: "MBAPPÉ", team: "PSG" },
      { position: [-8, -1, -5], name: "MESSI", team: "BARCA" },
    ]

    return (
      <group>
        {highlightedPlayers.map((player, i) => (
          <group key={i} position={player.position}>
            {/* Player highlight ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
              <ringGeometry args={[1.5, 2, 32]} />
              <meshStandardMaterial
                color={player.team === "PSG" ? "#003f7f" : "#a50044"}
                transparent
                opacity={0.6}
                emissive={player.team === "PSG" ? "#003f7f" : "#a50044"}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Player name billboard */}
            <Billboard position={[0, 3, 0]}>
              <Text
                fontSize={0.5}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
              >
                {player.name}
              </Text>
            </Billboard>
          </group>
        ))}
      </group>
    )
  }

  // VR Immersive Particles
  const VRAtmosphereParticles = () => {
    const particlesRef = useRef<THREE.Group>(null)

    useFrame(() => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.001
        particlesRef.current.children.forEach((child, i) => {
          const mesh = child as THREE.Mesh
          const time = Date.now() * 0.001
          mesh.position.y += Math.sin(time + i * 0.1) * 0.01
        })
      }
    })

    return (
      <group ref={particlesRef}>
        {Array.from({ length: 100 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 100
          const y = Math.random() * 30 + 5
          const z = (Math.random() - 0.5) * 100

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.6}
                emissive="#ffffff"
                emissiveIntensity={0.2}
              />
            </mesh>
          )
        })}
      </group>
    )
  }

  return (
    <group>
      <VRScoreboard />
      <VRCrowdEffects />
      <VRPlayerHighlights />
      <VRAtmosphereParticles />

      {/* VR Floor Grid for spatial reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.1} wireframe />
      </mesh>
    </group>
  )
}
