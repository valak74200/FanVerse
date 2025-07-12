"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WeatherSystemProps {
  weather: 'clear' | 'rain' | 'snow' | 'fog'
}

export function WeatherSystem({ weather }: WeatherSystemProps) {
  const weatherRef = useRef(null)
  const rainRef = useRef(null)
  const snowRef = useRef(null)

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
      {/* Rain Effect - Reduced count for performance */}
      {weather === 'rain' && (
        <group ref={rainRef}>
          {Array.from({ length: 500 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 120,
                Math.random() * 65 + 20,
                (Math.random() - 0.5) * 120
              ] as any}
            >
              <cylinderGeometry args={[0.01, 0.01, 1]} />
              <meshBasicMaterial
                {...{
                  color: "#87ceeb",
                  transparent: true,
                  opacity: 0.6
                } as any}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Snow Effect - Reduced count for performance */}
      {weather === 'snow' && (
        <group ref={snowRef}>
          {Array.from({ length: 300 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 120,
                Math.random() * 65 + 20,
                (Math.random() - 0.5) * 120
              ] as any}
            >
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial
                {...{
                  color: "#ffffff",
                  transparent: true,
                  opacity: 0.8
                } as any}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Fog Effect */}
      {weather === 'fog' && (
        <mesh position={[0, 10, 0] as any}>
          <sphereGeometry args={[80, 32, 32]} />
          <meshBasicMaterial args={[{ color: "#cccccc", transparent: true, opacity: 0.3, side: THREE.DoubleSide }]} />
        </mesh>
      )}
    </group>
  )
}