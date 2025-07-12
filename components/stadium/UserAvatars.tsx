"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import { UserProfile } from '@/store/slices/userSlice'
import * as THREE from 'three'

interface UserAvatarsProps {
  users: UserProfile[]
}

export function UserAvatars({ users }: UserAvatarsProps) {
  const avatarsRef = useRef(null)

  useFrame((state) => {
    if (!avatarsRef.current) return

    const time = state.clock.elapsedTime

    // Animate user avatars
    avatarsRef.current.children.forEach((avatarGroup, i) => {
      const user = users[i]
      if (!user) return

      // Floating animation
      avatarGroup.position.y = 5 + Math.sin(time + i) * 0.5

      // Simple idle animation
      avatarGroup.rotation.y = Math.sin(time * 0.5 + i) * 0.1
    })
  })

  // Generate deterministic positions for users (based on index to avoid hydration errors)
  const getUserPosition = (index: number): [number, number, number] => {
    const angle = (index / users.length) * Math.PI * 2
    const radius = 35 + (index % 10) // Déterministe basé sur l'index
    return [
      Math.cos(angle) * radius,
      5,
      Math.sin(angle) * radius
    ]
  }

  // Generate colors based on user ID
  const getUserColors = (userId: string) => {
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const hue = Math.abs(hash) % 360
    return {
      primary: `hsl(${hue}, 70%, 50%)`,
      secondary: `hsl(${hue + 30}, 60%, 40%)`,
      accent: `hsl(${hue + 60}, 80%, 60%)`
    }
  }

  return (
    <group ref={avatarsRef}>
      {users.map((user, index) => {
        const position = getUserPosition(index)
        const colors = getUserColors(user.id)
        
        return (
          <group
            key={user.id}
            position={position as any}
          >
            {/* Avatar Body */}
            <mesh position={[0, 1.2, 0] as any} castShadow>
              <capsuleGeometry args={[0.5, 1.5]} />
              <meshBasicMaterial args={[{ color: colors.primary }]} />
            </mesh>

            {/* Avatar Head */}
            <mesh position={[0, 2.4, 0] as any} castShadow>
              <sphereGeometry args={[0.3]} />
              <meshBasicMaterial args={[{ color: colors.secondary }]} />
            </mesh>

            {/* Team Badge */}
            <mesh position={[0, 1.7, 0.51] as any}>
              <circleGeometry args={[0.2]} />
              <meshBasicMaterial args={[{ color: colors.accent }]} />
            </mesh>

            {/* Username Billboard */}
            <Billboard position={[0, 3.5, 0]}>
              <Text
                fontSize={0.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
              >
                {user.name}
              </Text>
            </Billboard>

            {/* Activity Indicator */}
            <mesh position={[0.4, 2.7, 0] as any}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial args={[{ color: "#00ff00" }]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}