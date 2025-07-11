"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WeatherSystemProps {
  weather: 'clear' | 'rain' | 'snow' | 'fog'
}

export function WeatherSystem({ weather }: WeatherSystemProps) {
  const weatherRef = useRef<THREE.Group>(null)
  const rainRef = useRef<THREE.Group>(null)
  const snowRef = useRef<THREE.Group>(null)

  useFrame(() => {
    // Animate rain
    if (rainRef.current && weather === 'rain') {
      rainRef.current.children.forEach((drop) => {
        drop.position.y -= 3
        if (drop.position.y < -5) {
          drop.position.y = 60
          drop.position.x = (Math.random() - 0.5) * 120
          drop.position.z = (Math.random() - 0.5) * 120
        }
      })
    }

    // Animate snow
    if (snowRef.current && weather === 'snow') {
      snowRef.current.children.forEach((flake) => {
        flake.position.y -= 0.5
        flake.position.x += Math.sin(Date.now() * 0.001 + flake.position.z) * 0.1
        if (flake.position.y < -5) {
          flake.position.y = 60
          flake.position.x = (Math.random() - 0.5) * 120
          flake.position.z = (Math.random() - 0.5) * 120
        }
      })
    }
  })

  if (weather === 'clear') {
    return null
  }

  return (
    <group ref={weatherRef}>
      {/* Rain Effect */}
      {weather === 'rain' && (
        <group ref={rainRef}>
          {Array.from({ length: 2000 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 120,
                Math.random() * 65 + 20,
                (Math.random() - 0.5) * 120
              ]}
            >
              <cylinderGeometry args={[0.01, 0.01, 1]} />
              <meshStandardMaterial
                color="#87ceeb"
                transparent
                opacity={0.6}
                emissive="#87ceeb"
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Snow Effect */}
      {weather === 'snow' && (
        <group ref={snowRef}>
          {Array.from({ length: 1000 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 120,
                Math.random() * 65 + 20,
                (Math.random() - 0.5) * 120
              ]}
            >
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Fog Effect */}
      {weather === 'fog' && (
        <mesh position={[0, 10, 0]}>
          <sphereGeometry args={[80, 32, 32]} />
          <meshStandardMaterial
            color="#cccccc"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}