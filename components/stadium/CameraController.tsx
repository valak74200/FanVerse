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
  const cameraRef = useRef(null)
  const targetRef = useRef(new THREE.Vector3(...target))
  const { camera } = useThree()
  const isTransitioning = useRef(false)
  const targetPosition = useRef(new THREE.Vector3(...position))

  // Smooth camera transitions only when view mode changes
  useFrame((state, delta) => {
    if (!cameraRef.current) return

    // Only transition if we're actively transitioning
    if (isTransitioning.current) {
      const currentPos = cameraRef.current.position
      const targetPos = targetPosition.current
      const targetLookAt = targetRef.current

      // Check if we're close enough to stop transitioning
      const distance = currentPos.distanceTo(targetPos)
      if (distance < 0.1) {
        isTransitioning.current = false
        return
      }

      // Smooth interpolation only during transitions
      currentPos.lerp(targetPos, delta * 2)
      cameraRef.current.lookAt(targetLookAt)

      // Notify parent of position changes
      if (onPositionChange) {
        onPositionChange(currentPos)
      }
    }
  })

  useEffect(() => {
    // Trigger transition when position changes
    if (cameraRef.current) {
      targetPosition.current.set(...position)
      isTransitioning.current = true
    }
  }, [position])

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