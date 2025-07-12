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
  const stadiumRef = useRef<THREE.Group>(null)
  const lightsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    // Subtle stadium breathing animation
    if (stadiumRef.current) {
      stadiumRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.001
    }

    // Flicker stadium lights at night
    if (lightsRef.current && timeOfDay === 'night') {
      lightsRef.current.children.forEach((light, i) => {
        const mesh = light as THREE.Mesh
        if (mesh.material && 'emissiveIntensity' in mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial
          material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1
        }
      })
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
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[48, 52, 12, segments, 1, true]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            side={THREE.DoubleSide} 
            roughness={0.8} 
            metalness={0.1} 
          />
        </mesh>

        {/* Upper tier */}
        <mesh position={[0, 8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[45, 49, 8, segments, 1, true]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            side={THREE.DoubleSide} 
            roughness={0.7} 
            metalness={0.2} 
          />
        </mesh>

        {/* Roof structure */}
        <mesh position={[0, 18, 0]} castShadow>
          <cylinderGeometry args={[50, 50, 2, segments, 1, true]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            transparent 
            opacity={0.9} 
            roughness={0.3} 
            metalness={0.7} 
          />
        </mesh>

        {/* Structural supports */}
        {Array.from({ length: performance === 'low' ? 8 : 16 }).map((_, i) => {
          const angle = (i / (performance === 'low' ? 8 : 16)) * Math.PI * 2
          const x = Math.cos(angle) * 45
          const z = Math.sin(angle) * 45
          
          return (
            <mesh key={i} position={[x, 12, z]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[2, 12, 1]} />
              <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </mesh>
          )
        })}
      </group>

      {/* Stadium Lighting System */}
      <group ref={lightsRef}>
        {Array.from({ length: performance === 'low' ? 16 : 32 }).map((_, i) => {
          const angle = (i / (performance === 'low' ? 16 : 32)) * Math.PI * 2
          const radius = 42
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          
          return (
            <group key={i} position={[x, 16, z]}>
              <mesh castShadow>
                <boxGeometry args={[3, 0.5, 0.5]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  emissive="#ffffff" 
                  emissiveIntensity={timeOfDay === 'night' ? 0.8 : 0.2} 
                />
              </mesh>
              
              {/* Actual light sources */}
              <spotLight
                intensity={timeOfDay === 'night' ? 3 : 1}
                distance={100}
                angle={Math.PI / 6}
                penumbra={0.3}
                color="#ffffff"
                position={[0, -1, 0]}
                target-position={[0, -20, 0]}
                castShadow={performance !== 'low'}
              />
            </group>
          )
        })}
      </group>

      {/* Football Pitch */}
      <group position={[0, -1.95, 0]}>
        {/* Main grass */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[68, 105]} />
          <meshStandardMaterial 
            color="#16a34a" 
            roughness={0.9} 
            normalScale={new THREE.Vector2(0.5, 0.5)} 
          />
        </mesh>

        {/* Pitch markings */}
        <group position={[0, 0.01, 0]}>
          {/* Center line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 105]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff" 
              emissiveIntensity={0.1} 
            />
          </mesh>

          {/* Center circle */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[9.15, 9.3, 64]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff" 
              emissiveIntensity={0.1} 
            />
          </mesh>

          {/* Center spot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff" 
              emissiveIntensity={0.2} 
            />
          </mesh>
        </group>

        {/* Goals */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[0, 2.44, side * 52.5]}>
            {/* Goal posts */}
            <mesh position={[-3.66, 0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 2.44]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[3.66, 0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 2.44]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.22, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 7.32]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Goal nets */}
            <mesh position={[0, 0.6, -1]}>
              <planeGeometry args={[7.32, 2.44]} />
              <meshStandardMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.3} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Stadium Scoreboards */}
      {performance !== 'low' && (
        <>
          <group position={[0, 25, -55]}>
            <mesh>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial 
                color="#000000" 
                emissive="#001122" 
                emissiveIntensity={0.2} 
              />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={1.5}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Geist-Bold.ttf"
            >
              PSG 2 - 1 BARCELONA
            </Text>
          </group>

          <group position={[0, 25, 55]} rotation={[0, Math.PI, 0]}>
            <mesh>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial 
                color="#000000" 
                emissive="#001122" 
                emissiveIntensity={0.2} 
              />
            </mesh>
          </group>
        </>
      )}

      {/* Stadium exterior facade */}
      <mesh position={[0, 7.5, 0]} receiveShadow>
        <cylinderGeometry args={[58, 60, 15, segments, 1, true]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          side={THREE.DoubleSide} 
          roughness={0.9} 
        />
      </mesh>

      {/* Entrance gates */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 59
        const z = Math.sin(angle) * 59
        
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <mesh castShadow>
              <boxGeometry args={[8, 12, 3]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}