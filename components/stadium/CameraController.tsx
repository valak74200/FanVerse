"use client"

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

interface CameraControllerProps {
  position: [number, number, number]
  target: [number, number, number]
  viewMode: string
  onPositionChange?: (position: THREE.Vector3) => void
}

export function CameraController({ 
  position, 
  target, 
  viewMode, 
  onPositionChange 
}: CameraControllerProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const targetRef = useRef<THREE.Vector3>(new THREE.Vector3(...target))
  const { camera } = useThree()

  // Smooth camera transitions
  useFrame((state, delta) => {
    if (!cameraRef.current) return

    const targetPosition = new THREE.Vector3(...position)
    const targetLookAt = new THREE.Vector3(...target)

    // Smooth interpolation
    cameraRef.current.position.lerp(targetPosition, delta * 2)
    targetRef.current.lerp(targetLookAt, delta * 2)
    cameraRef.current.lookAt(targetRef.current)

    // Notify parent of position changes
    if (onPositionChange) {
      onPositionChange(cameraRef.current.position)
    }
  })

  useEffect(() => {
    targetRef.current.set(...target)
  }, [target])

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={60}
      near={0.1}
      far={2000}
      position={position}
    />
  )
}