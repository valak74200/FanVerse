"use client"

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { EmotionType } from '@/store/slices/emotionSlice'
import { useAppSelector } from '@/store'
import * as THREE from 'three'

interface EmotionEffectsProps {
  activeEmotion: EmotionType | null
  isAnimating: boolean
}

export function EmotionEffects({ activeEmotion, isAnimating }: EmotionEffectsProps) {
  const effectsRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { emotions } = useAppSelector(state => state.emotion)

  // Particle system for emotion effects
  const particleCount = 1000
  const particles = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry())
  const particlePositions = useRef<Float32Array>(new Float32Array(particleCount * 3))
  const particleVelocities = useRef<Float32Array>(new Float32Array(particleCount * 3))
  const particleColors = useRef<Float32Array>(new Float32Array(particleCount * 3))

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

    particles.current.setAttribute('position', new THREE.BufferAttribute(particlePositions.current, 3))
    particles.current.setAttribute('color', new THREE.BufferAttribute(particleColors.current, 3))
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
          case 'love':
            particleColors.current[i3] = 1 // Red
            particleColors.current[i3 + 1] = 0.2 // Green
            particleColors.current[i3 + 2] = 0.8 // Blue
            break
          case 'rage':
            particleColors.current[i3] = 1 // Red
            particleColors.current[i3 + 1] = 0 // Green
            particleColors.current[i3 + 2] = 0 // Blue
            break
          case 'shock':
            particleColors.current[i3] = 1 // Red
            particleColors.current[i3 + 1] = 1 // Green
            particleColors.current[i3 + 2] = 0 // Blue
            break
          case 'sad':
            particleColors.current[i3] = 0.2 // Red
            particleColors.current[i3 + 1] = 0.2 // Green
            particleColors.current[i3 + 2] = 1 // Blue
            break
          case 'boring':
            particleColors.current[i3] = 0.5 // Red
            particleColors.current[i3 + 1] = 0.5 // Green
            particleColors.current[i3 + 2] = 0.5 // Blue
            break
        }
      }

      // Update buffer attributes
      particles.current.attributes.position.needsUpdate = true
      particles.current.attributes.color.needsUpdate = true

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
            position={[0, 30, 0]}
            color="#ff4500"
            intensity={intensity * 3}
            distance={100}
          />
        )
      case 'love':
        return (
          <pointLight
            position={[0, 30, 0]}
            color="#ff69b4"
            intensity={intensity * 2}
            distance={80}
          />
        )
      case 'rage':
        return (
          <pointLight
            position={[0, 30, 0]}
            color="#ff0000"
            intensity={intensity * 4}
            distance={120}
          />
        )
      case 'shock':
        return (
          <pointLight
            position={[0, 30, 0]}
            color="#ffff00"
            intensity={intensity * 5}
            distance={60}
          />
        )
      case 'sad':
        return (
          <pointLight
            position={[0, 30, 0]}
            color="#4169e1"
            intensity={intensity * 1.5}
            distance={70}
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
        <primitive object={particles.current} />
        <pointsMaterial
          size={2}
          vertexColors
          transparent
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
                  <mesh key={i} position={[x, 40, z]}>
                    <sphereGeometry args={[1]} />
                    <meshStandardMaterial
                      color="#ff4500"
                      emissive="#ff4500"
                      emissiveIntensity={emotions[activeEmotion].intensity}
                    />
                  </mesh>
                )
              })}
            </group>
          )}

          {/* Hearts for love */}
          {activeEmotion === 'love' && (
            <group>
              {Array.from({ length: 10 }).map((_, i) => (
                <mesh
                  key={i}
                  position={[
                    (Math.random() - 0.5) * 60,
                    20 + Math.random() * 20,
                    (Math.random() - 0.5) * 60
                  ]}
                >
                  <sphereGeometry args={[0.5]} />
                  <meshStandardMaterial
                    color="#ff69b4"
                    emissive="#ff69b4"
                    emissiveIntensity={emotions[activeEmotion].intensity * 0.5}
                  />
                </mesh>
              ))}
            </group>
          )}

          {/* Lightning for shock */}
          {activeEmotion === 'shock' && (
            <group>
              <mesh position={[0, 50, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 100]} />
                <meshStandardMaterial
                  color="#ffff00"
                  emissive="#ffff00"
                  emissiveIntensity={emotions[activeEmotion].intensity}
                />
              </mesh>
            </group>
          )}
        </>
      )}
    </group>
  )
}