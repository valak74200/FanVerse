"use client"

import { useEffect, useState } from "react"
import { useThree } from "@react-three/fiber"

interface WebXRManagerProps {
  isVRActive: boolean
  onVRStateChange: (active: boolean) => void
}

export function WebXRManager({ isVRActive, onVRStateChange }: WebXRManagerProps) {
  const { gl } = useThree()
  const [isVRSupported, setIsVRSupported] = useState(false)
  const [vrSession, setVRSession] = useState(null)

  useEffect(() => {
    // Safely check WebXR support with proper error handling
    const checkVRSupport = async () => {
      try {
        // Check if we're in a secure context (HTTPS)
        if (!window.isSecureContext) {
          console.log("WebXR requires a secure context (HTTPS)")
          setIsVRSupported(false)
          return
        }

        // Check if navigator.xr exists
        if (!navigator.xr) {
          console.log("WebXR not available in this browser")
          setIsVRSupported(false)
          return
        }

        // Try to check session support with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 3000)
        })

        const supportPromise = navigator.xr.isSessionSupported("immersive-vr")

        const supported = await Promise.race([supportPromise, timeoutPromise])
        setIsVRSupported(supported as boolean)
      } catch (error) {
        // Handle any errors gracefully
        console.log("WebXR check failed:", error)
        setIsVRSupported(false)
      }
    }

    checkVRSupport()
  }, [])

  const enterVR = async () => {
    if (!isVRSupported || !navigator.xr) {
      console.log("VR not supported")
      onVRStateChange(false)
      return
    }

    try {
      const session = await navigator.xr.requestSession("immersive-vr", {
        requiredFeatures: ["local-floor"],
        optionalFeatures: ["hand-tracking", "bounded-floor"],
      })

      await gl.xr.setSession(session)
      setVRSession(session)
      onVRStateChange(true)

      session.addEventListener("end", () => {
        setVRSession(null)
        onVRStateChange(false)
      })
    } catch (error) {
      console.error("Failed to enter VR:", error)
      onVRStateChange(false)
    }
  }

  const exitVR = () => {
    if (vrSession) {
      vrSession.end()
    }
  }

  useEffect(() => {
    if (isVRActive && !vrSession && isVRSupported) {
      enterVR()
    } else if (!isVRActive && vrSession) {
      exitVR()
    }
  }, [isVRActive, isVRSupported])

  return null
}

// Simplified VR Controllers Component
export function VRControllers() {
  return null // Simplified for compatibility
}

// Simplified VR Teleportation System
export function VRTeleportation() {
  const teleportPoints = [
    { x: 0, y: 0, z: -30, label: "Behind Goal" },
    { x: 25, y: 5, z: 0, label: "Sideline" },
    { x: -25, y: 5, z: 0, label: "Opposite Sideline" },
    { x: 0, y: 15, z: 30, label: "Elevated View" },
    { x: 0, y: 30, z: 0, label: "Aerial View" },
  ]

  return (
    <group>
      {teleportPoints.map((point, index) => (
        <mesh
          key={index}
          position={[point.x, point.y, point.z] as any}
          onClick={() => {
            console.log(`Teleporting to: ${point.label}`)
          }}
        >
          <cylinderGeometry args={[1, 1, 0.1]} />
          <meshStandardMaterial {...({ color: "#3b82f6", transparent: true, opacity: 0.6, emissive: "#3b82f6", emissiveIntensity: 0.3 } as any)} />
        </mesh>
      ))}
    </group>
  )
}
