"use client"

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAppSelector } from '@/hooks/redux'
import * as THREE from 'three'

type EmotionType = 'hype' | 'joy' | 'anger' | 'sadness' | 'surprise' | 'fear'

interface EmotionEffectsProps {
  activeEmotion: EmotionType | null
  isAnimating: boolean
}

export function EmotionEffects({ activeEmotion, isAnimating }: EmotionEffectsProps) {
  const effectsRef = useRef(null)
  const particlesRef = useRef(null)
  const { emotions } = useAppSelector(state => state.emotion)

  // Particle system for emotion effects (reduced count for performance)
  const particleCount = 500
  const particlePositions = useRef(new Float32Array(particleCount * 3))
  const particleVelocities = useRef(new Float32Array(particleCount * 3))
  const particleColors = useRef(new Float32Array(particleCount * 3))

  useEffect(() => {
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Random positions around stadium
      const angle = Math.random() * Math.PI * 2
      const radius = 20 + Math.random() * 40
      
      particlePositions.current[i3] = Math.cos(angle) * radius
      particlePositions.current[i3 + 1] = Math.random() * 30 + 5
      particlePositions.current[i3 + 2] = Math.sin(angle) * radius
      
      // Random velocities
      particleVelocities.current[i3] = (Math.random() - 0.5) * 0.1
      particleVelocities.current[i3 + 1] = Math.random() * 0.2
      particleVelocities.current[i3 + 2] = (Math.random() - 0.5) * 0.1
      
      // Default colors (white)
      particleColors.current[i3] = 1
      particleColors.current[i3 + 1] = 1
      particleColors.current[i3 + 2] = 1
    }
  }, [])

  useFrame((state) => {
    if (!effectsRef.current || !particlesRef.current) return

    const time = state.clock.elapsedTime

    // Update particle system based on active emotion
    if (activeEmotion && isAnimating) {
      const emotionData = emotions[activeEmotion]
      const intensity = emotionData.intensity

      // Update particle colors and behavior based on emotion
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Update positions
        particlePositions.current[i3] += particleVelocities.current[i3] * intensity
        particlePositions.current[i3 + 1] += particleVelocities.current[i3 + 1] * intensity
        particlePositions.current[i3 + 2] += particleVelocities.current[i3 + 2] * intensity

        // Reset particles that go too far
        if (particlePositions.current[i3 + 1] > 50) {
          particlePositions.current[i3 + 1] = 0
        }

        // Set colors based on emotion
        switch (activeEmotion) {
          case 'hype':
            particleColors.current[i3] = 1 // Red
            particleColors.current[i3 + 1] = 0.5 // Green
            particleColors.current[i3 + 2] = 0 // Blue
            break
          case 'joy':
            particleColors.current[i3] = 1 // Red
            particleColors.current[i3 + 1] = 0.2 // Green
            particleColors.current[i3 + 2] = 0.8 // Blue
            break
          case 'anger':
            particleColors.current[i3] = 1 // Red
            particleColors.current[i3 + 1] = 0 // Green
            particleColors.current[i3 + 2] = 0 // Blue
            break
          case 'surprise':
            particleColors.current[i3] = 1 // Red
            particleColors.current[i3 + 1] = 1 // Green
            particleColors.current[i3 + 2] = 0 // Blue
            break
          case 'sadness':
            particleColors.current[i3] = 0.2 // Red
            particleColors.current[i3 + 1] = 0.2 // Green
            particleColors.current[i3 + 2] = 1 // Blue
            break
          case 'fear':
            particleColors.current[i3] = 0.5 // Red
            particleColors.current[i3 + 1] = 0.5 // Green
            particleColors.current[i3 + 2] = 0.5 // Blue
            break
        }
      }

      // Update buffer attributes will be handled by R3F automatically

      // Animate the entire effect group
      effectsRef.current.rotation.y = time * 0.1
      effectsRef.current.scale.setScalar(1 + Math.sin(time * 4) * intensity * 0.2)
    }
  })

  // Get emotion-specific lighting
  const getEmotionLighting = () => {
    if (!activeEmotion || !isAnimating) return null

    const emotionData = emotions[activeEmotion]
    const intensity = emotionData.intensity

    switch (activeEmotion) {
      case 'hype':
        return (
          <pointLight
            position={[0, 30, 0] as any}
            color="#ff4500"
            intensity={intensity * 3}
            distance={100}
          />
        )
      case 'joy':
        return (
          <pointLight
            position={[0, 30, 0] as any}
            color="#ff69b4"
            intensity={intensity * 2}
            distance={80}
          />
        )
      case 'anger':
        return (
          <pointLight
            position={[0, 30, 0] as any}
            color="#ff0000"
            intensity={intensity * 4}
            distance={120}
          />
        )
      case 'surprise':
        return (
          <pointLight
            position={[0, 30, 0] as any}
            color="#ffff00"
            intensity={intensity * 5}
            distance={60}
          />
        )
      case 'sadness':
        return (
          <pointLight
            position={[0, 30, 0] as any}
            color="#4169e1"
            intensity={intensity * 1.5}
            distance={70}
          />
        )
      case 'fear':
        return (
          <pointLight
            position={[0, 30, 0] as any}
            color="#666666"
            intensity={intensity * 1}
            distance={50}
          />
        )
      default:
        return null
    }
  }

  return (
    <group ref={effectsRef}>
      {/* Particle System */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions.current}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particleColors.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>

      {/* Emotion-specific lighting */}
      {getEmotionLighting()}

      {/* Stadium-wide emotion effects */}
      {activeEmotion && isAnimating && (
        <>
          {/* Fireworks for hype */}
          {activeEmotion === 'hype' && (
            <group>
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i / 5) * Math.PI * 2
                const x = Math.cos(angle) * 30
                const z = Math.sin(angle) * 30
                
                return (
                  <mesh key={i} position={[x, 40, z] as any}>
                    <sphereGeometry args={[1]} />
                    <meshBasicMaterial args={[{ color: "#ff4500" }]} />
                  </mesh>
                )
              })}
            </group>
          )}

          {/* Hearts for joy */}
          {activeEmotion === 'joy' && (
            <group>
              {Array.from({ length: 10 }).map((_, i) => (
                <mesh
                  key={i}
                  position={[
                    (Math.random() - 0.5) * 60,
                    20 + Math.random() * 20,
                    (Math.random() - 0.5) * 60
                  ] as any}
                >
                  <sphereGeometry args={[0.5]} />
                  <meshBasicMaterial args={[{ color: "#ff69b4" }]} />
                </mesh>
              ))}
            </group>
          )}

          {/* Lightning for surprise */}
          {activeEmotion === 'surprise' && (
            <group>
              <mesh position={[0, 50, 0] as any}>
                <cylinderGeometry args={[0.1, 0.1, 100]} />
                <meshBasicMaterial args={[{ color: "#ffff00" }]} />
              </mesh>
            </group>
          )}
        </>
      )}
    </group>
  )
}