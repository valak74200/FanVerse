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
  const avatarsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!avatarsRef.current) return

    const time = state.clock.elapsedTime

    // Animate user avatars
    avatarsRef.current.children.forEach((avatarGroup, i) => {
      const user = users[i]
      if (!user) return

      // Floating animation
      avatarGroup.position.y = user.avatar.position[1] + Math.sin(time + i) * 0.5

      // Rotation based on animation state
      switch (user.avatar.animation) {
        case 'cheer':
          avatarGroup.rotation.y = Math.sin(time * 4 + i) * 0.3
          avatarGroup.scale.setScalar(1.1 + Math.sin(time * 8 + i) * 0.1)
          break
        case 'wave':
          avatarGroup.rotation.z = Math.sin(time * 6 + i) * 0.2
          break
        case 'jump':
          avatarGroup.position.y += Math.abs(Math.sin(time * 8 + i)) * 2
          break
        case 'dance':
          avatarGroup.rotation.y = time * 2 + i
          avatarGroup.rotation.z = Math.sin(time * 4 + i) * 0.1
          break
        default:
          // Idle animation
          avatarGroup.rotation.y = Math.sin(time * 0.5 + i) * 0.1
      }
    })
  })

  return (
    <group ref={avatarsRef}>
      {users.map((user, index) => (
        <group
          key={user.id}
          position={user.avatar.position}
        >
          {/* Avatar Body */}
          <mesh castShadow>
            <capsuleGeometry args={[0.5, 1.5]} />
            <meshStandardMaterial
              color={user.avatar.colors.primary}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Avatar Head */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial
              color={user.avatar.colors.secondary}
              roughness={0.8}
            />
          </mesh>

          {/* Team Badge */}
          <mesh position={[0, 0.5, 0.51]}>
            <circleGeometry args={[0.2]} />
            <meshStandardMaterial
              color={user.avatar.colors.accent}
              emissive={user.avatar.colors.accent}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Username Billboard */}
          <Billboard position={[0, 2.5, 0]}>
            <Text
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {user.username}
            </Text>
          </Billboard>

          {/* VIP Crown */}
          {user.isVip && (
            <mesh position={[0, 1.8, 0]}>
              <coneGeometry args={[0.2, 0.3]} />
              <meshStandardMaterial
                color="#ffd700"
                emissive="#ffd700"
                emissiveIntensity={0.3}
              />
            </mesh>
          )}

          {/* Online Status Indicator */}
          {user.isOnline && (
            <mesh position={[0.4, 1.5, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial
                color="#00ff00"
                emissive="#00ff00"
                emissiveIntensity={0.5}
              />
            </mesh>
          )}

          {/* Accessories */}
          {user.avatar.accessories.map((accessory, accIndex) => (
            <mesh
              key={accIndex}
              position={[
                Math.cos(accIndex) * 0.6,
                0.8 + accIndex * 0.2,
                Math.sin(accIndex) * 0.6
              ]}
            >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial color={user.avatar.colors.accent} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}