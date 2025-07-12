"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface StadiumStructureProps {
  timeOfDay: 'day' | 'night' | 'sunset'
  performance: 'low' | 'medium' | 'high'
}

export function StadiumStructure({ timeOfDay, performance }: StadiumStructureProps) {
  const stadiumRef = useRef(null)

  useFrame((state) => {
    // Subtle stadium breathing animation
    if (stadiumRef.current) {
      stadiumRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.001
    }
  })

  // Adjust detail level based on performance setting
  const getGeometrySegments = () => {
    switch (performance) {
      case 'low': return 16
      case 'medium': return 32
      case 'high': return 64
      default: return 32
    }
  }

  const segments = getGeometrySegments()

  return (
    <group ref={stadiumRef}>
      {/* Main Stadium Bowl */}
      <group>
        {/* Lower tier */}
        <mesh position={[0, 0, 0] as any}>
          <cylinderGeometry args={[48, 52, 12, segments, 1, true]} />
          <meshBasicMaterial args={[{ color: "#2a2a2a", side: THREE.DoubleSide }]} />
        </mesh>

        {/* Upper tier */}
        <mesh position={[0, 8, 0] as any}>
          <cylinderGeometry args={[45, 49, 8, segments, 1, true]} />
          <meshBasicMaterial args={[{ color: "#1a1a1a", side: THREE.DoubleSide }]} />
        </mesh>

        {/* Roof structure */}
        <mesh position={[0, 18, 0] as any}>
          <cylinderGeometry args={[50, 50, 2, segments, 1, true]} />
          <meshBasicMaterial args={[{ color: "#0a0a0a", transparent: true, opacity: 0.9 }]} />
        </mesh>

        {/* Structural supports */}
        {Array.from({ length: performance === 'low' ? 8 : 16 }).map((_, i) => {
          const angle = (i / (performance === 'low' ? 8 : 16)) * Math.PI * 2
          const x = Math.cos(angle) * 45
          const z = Math.sin(angle) * 45
          
          return (
            <mesh key={i} position={[x, 12, z] as any} rotation={[0, angle, 0]}>
              <boxGeometry args={[2, 12, 1]} />
              <meshBasicMaterial args={[{ color: "#333333" }]} />
            </mesh>
          )
        })}
      </group>

      {/* Stadium Lighting System */}
      <group>
        {Array.from({ length: performance === 'low' ? 8 : 16 }).map((_, i) => {
          const angle = (i / (performance === 'low' ? 8 : 16)) * Math.PI * 2
          const radius = 42
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          
          return (
            <group key={i} position={[x, 16, z] as any}>
              <mesh>
                <boxGeometry args={[3, 0.5, 0.5]} />
                <meshBasicMaterial args={[{ color: timeOfDay === 'night' ? "#ffffff" : "#cccccc" }]} />
              </mesh>
              
              {/* Actual light sources - reduced count */}
              {performance !== 'low' && (
                <spotLight
                  intensity={timeOfDay === 'night' ? 2 : 0.5}
                  distance={80}
                  angle={Math.PI / 8}
                  penumbra={0.5}
                  color="#ffffff"
                  position={[0, -1, 0] as any}
                />
              )}
            </group>
          )
        })}
      </group>

      {/* Football Pitch */}
      <group position={[0, -1.95, 0] as any}>
        {/* Main grass */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[68, 105]} />
          <meshBasicMaterial args={[{ color: "#16a34a" }]} />
        </mesh>

        {/* Pitch markings */}
        <group position={[0, 0.01, 0] as any}>
          {/* Center line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 105]} />
            <meshBasicMaterial args={[{ color: "#ffffff" }]} />
          </mesh>

          {/* Center circle */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[9.15, 9.3, 32]} />
            <meshBasicMaterial args={[{ color: "#ffffff" }]} />
          </mesh>

          {/* Center spot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial args={[{ color: "#ffffff" }]} />
          </mesh>
        </group>

        {/* Goals */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[0, 2.44, side * 52.5] as any}>
            {/* Goal posts */}
            <mesh position={[-3.66, 0, 0] as any}>
              <cylinderGeometry args={[0.06, 0.06, 2.44]} />
              <meshBasicMaterial args={[{ color: "#ffffff" }]} />
            </mesh>
            <mesh position={[3.66, 0, 0] as any}>
              <cylinderGeometry args={[0.06, 0.06, 2.44]} />
              <meshBasicMaterial args={[{ color: "#ffffff" }]} />
            </mesh>
            <mesh position={[0, 1.22, 0] as any} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 7.32]} />
              <meshBasicMaterial args={[{ color: "#ffffff" }]} />
            </mesh>

            {/* Goal nets */}
            <mesh position={[0, 0.6, -1] as any}>
              <planeGeometry args={[7.32, 2.44]} />
              <meshBasicMaterial args={[{ color: "#ffffff", transparent: true, opacity: 0.3, side: THREE.DoubleSide }]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Stadium Scoreboards */}
      {performance !== 'low' && (
        <>
          <group position={[0, 25, -55] as any}>
            <mesh>
              <planeGeometry args={[20, 8]} />
              <meshBasicMaterial args={[{ color: "#000000" }]} />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={1.5}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              PSG 2 - 1 BARCELONA
            </Text>
          </group>

          <group position={[0, 25, 55] as any} rotation={[0, Math.PI, 0]}>
            <mesh>
              <planeGeometry args={[20, 8]} />
              <meshBasicMaterial args={[{ color: "#000000" }]} />
            </mesh>
          </group>
        </>
      )}

      {/* Stadium exterior facade */}
      <mesh position={[0, 7.5, 0] as any}>
        <cylinderGeometry args={[58, 60, 15, segments, 1, true]} />
        <meshBasicMaterial args={[{ color: "#1a1a1a", side: THREE.DoubleSide }]} />
      </mesh>

      {/* Entrance gates */}
      {Array.from({ length: performance === 'low' ? 4 : 8 }).map((_, i) => {
        const angle = (i / (performance === 'low' ? 4 : 8)) * Math.PI * 2
        const x = Math.cos(angle) * 59
        const z = Math.sin(angle) * 59
        
        return (
          <group key={i} position={[x, 0, z] as any} rotation={[0, angle, 0]}>
            <mesh>
              <boxGeometry args={[8, 12, 3]} />
              <meshBasicMaterial args={[{ color: "#333333" }]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}