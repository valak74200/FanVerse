"use client"

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAppSelector } from '@/hooks/redux'
import * as THREE from 'three'

type EmotionType = 'hype' | 'joy' | 'anger' | 'sadness' | 'surprise' | 'fear'

interface CrowdSystemProps {
  density: number
  activeEmotion: EmotionType | null
  isAnimating: boolean
  performance: 'low' | 'medium' | 'high'
}

interface SpectatorData {
  position: THREE.Vector3
  baseY: number
  team: 'PSG' | 'BARCA' | 'NEUTRAL'
  section: number
  animationOffset: number
  emotionIntensity: number
}

export function CrowdSystem({ density, activeEmotion, isAnimating, performance }: CrowdSystemProps) {
  const crowdRef = useRef(null)
  const { emotions } = useAppSelector(state => state.emotion)

  // Generate spectator positions based on performance and density
  const spectators = useMemo(() => {
    const count = (() => {
      switch (performance) {
        case 'low': return Math.floor(200 * density)
        case 'medium': return Math.floor(800 * density)
        case 'high': return Math.floor(1500 * density)
        default: return Math.floor(800 * density)
      }
    })()

    const spectatorData: SpectatorData[] = []

    for (let i = 0; i < count; i++) {
      const section = Math.floor(i / (count / 8)) // 8 sections
      const angle = (i / count) * Math.PI * 2
      const radius = 38 + Math.random() * 12
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const baseY = 3 + Math.random() * 15

      // Assign team based on section
      const team = section % 3 === 0 ? 'PSG' : section % 3 === 1 ? 'BARCA' : 'NEUTRAL'

      spectatorData.push({
        position: new THREE.Vector3(x, baseY, z),
        baseY,
        team,
        section,
        animationOffset: Math.random() * Math.PI * 2,
        emotionIntensity: 0,
      })
    }

    return spectatorData
  }, [density, performance])

  useFrame((state) => {
    if (!crowdRef.current) return

    const time = state.clock.elapsedTime
    const children = crowdRef.current.children

    children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      const spectator = spectators[i]
      if (!spectator) return

      // Base wave animation
      const waveOffset = spectator.animationOffset
      const waveHeight = Math.sin(time * 2 + waveOffset) * 0.3

      // Emotion-based animation
      let emotionMultiplier = 1
      let emotionHeight = 0

      if (activeEmotion && isAnimating) {
        const emotionData = emotions[activeEmotion]
        emotionMultiplier = 1 + emotionData.intensity * 2

        switch (activeEmotion) {
          case 'hype':
            emotionHeight = Math.sin(time * 8 + waveOffset) * emotionData.intensity * 2
            break
          case 'anger':
            emotionHeight = Math.sin(time * 12 + waveOffset) * emotionData.intensity * 1.5
            break
          case 'joy':
            emotionHeight = Math.sin(time * 4 + waveOffset) * emotionData.intensity * 1
            break
          case 'surprise':
            emotionHeight = Math.random() * emotionData.intensity * 3
            break
          case 'sadness':
            emotionHeight = -emotionData.intensity * 0.5
            break
          case 'fear':
            emotionHeight = Math.sin(time * 0.5 + waveOffset) * emotionData.intensity * 0.2
            break
        }
      }

      // Apply animations
      mesh.position.y = spectator.baseY + waveHeight * emotionMultiplier + emotionHeight

      // Rotation based on emotion
      if (activeEmotion === 'hype' || activeEmotion === 'joy') {
        mesh.rotation.y = Math.sin(time * 4 + waveOffset) * 0.3
      } else if (activeEmotion === 'anger') {
        mesh.rotation.y = Math.sin(time * 8 + waveOffset) * 0.5
      }

      // Scale based on emotion intensity
      const scaleMultiplier = activeEmotion ? 1 + emotions[activeEmotion].intensity * 0.2 : 1
      mesh.scale.setScalar(scaleMultiplier)
    })
  })

  // Shared materials to reduce texture units
  const psgMaterial = useMemo(() => new (THREE as any).MeshBasicMaterial({ 
    color: '#003f7f' 
  }), [])
  const barcaMaterial = useMemo(() => new (THREE as any).MeshBasicMaterial({ 
    color: '#a50044' 
  }), [])
  const neutralMaterial = useMemo(() => new (THREE as any).MeshBasicMaterial({ 
    color: '#666666' 
  }), [])

  // Get team material
  const getTeamMaterial = (team: SpectatorData['team']) => {
    switch (team) {
      case 'PSG': return psgMaterial
      case 'BARCA': return barcaMaterial
      default: return neutralMaterial
    }
  }

  return (
    <group ref={crowdRef}>
      {spectators.map((spectator, i) => (
        <mesh
          key={i}
          position={spectator.position}
          material={getTeamMaterial(spectator.team)}
          castShadow={performance !== 'low'}
          receiveShadow={performance !== 'low'}
        >
          <boxGeometry args={[0.3, 1.2, 0.3]} />
        </mesh>
      ))}
    </group>
  )
}