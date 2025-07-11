"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Text } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { WebXRManager, VRControllers, VRTeleportation } from "./webxr-manager"
import { VRUIPanel } from "./vr-ui-panel"
import { VRStadiumExperience } from "./vr-stadium-experience"

interface Stadium3DProps {
  cameraView: string
  weather: string
  crowdVolume: number
  isVRActive?: boolean
  onVRStateChange?: (active: boolean) => void
}

function Stadium({ weather, crowdVolume }: { weather: string; crowdVolume: number }) {
  const stadiumRef = useRef<THREE.Group>(null)
  const playersRef = useRef<THREE.Group>(null)

  // Stadium structure
  const StadiumStructure = () => (
    <group>
      {/* Main stadium bowl */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[45, 50, 8, 32, 1, true]} />
        <meshStandardMaterial color="#2a2a2a" side={THREE.DoubleSide} />
      </mesh>

      {/* Upper tier */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[42, 47, 6, 32, 1, true]} />
        <meshStandardMaterial color="#1a1a1a" side={THREE.DoubleSide} />
      </mesh>

      {/* Roof structure */}
      <mesh position={[0, 12, 0]}>
        <cylinderGeometry args={[48, 48, 1, 32, 1, true]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.8} />
      </mesh>

      {/* Stadium lights */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 40
        const z = Math.sin(angle) * 40
        return (
          <group key={i} position={[x, 15, z]}>
            <mesh>
              <boxGeometry args={[2, 1, 1]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
            <pointLight intensity={2} distance={100} color="#ffffff" />
          </group>
        )
      })}
    </group>
  )

  // Football pitch
  const Pitch = () => (
    <group position={[0, -1.9, 0]}>
      {/* Main pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[68, 105]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>

      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[9.15, 9.25, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.2, 105]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Penalty areas */}
      {[-1, 1].map((side, i) => (
        <group key={i}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, side * 40.5]}>
            <ringGeometry args={[16.5, 16.7, 32, 1, 0, Math.PI]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, side * 35]}>
            <planeGeometry args={[40.3, 0.2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, 0.01, side * 35]}>
            <planeGeometry args={[0.2, 16.5]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, 0.01, side * 35]}>
            <planeGeometry args={[0.2, 16.5]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* Goals */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[0, 1, side * 52.5]}>
          <mesh>
            <boxGeometry args={[7.32, 2.44, 0.1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-3.66, 1.22, 0]}>
            <boxGeometry args={[0.1, 2.44, 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[3.66, 1.22, 0]}>
            <boxGeometry args={[0.1, 2.44, 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 2.44, 0]}>
            <boxGeometry args={[7.32, 0.1, 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  )

  // Animated crowd
  const Crowd = () => {
    const crowdRef = useRef<THREE.Group>(null)

    useEffect(() => {
      const animateCrowd = () => {
        if (crowdRef.current) {
          const intensity = crowdVolume / 100
          crowdRef.current.children.forEach((child, i) => {
            const mesh = child as THREE.Mesh
            const time = Date.now() * 0.001
            mesh.position.y = Math.sin(time + i * 0.1) * intensity * 0.5 + (2 + Math.random() * 8)
          })
        }
        requestAnimationFrame(animateCrowd)
      }
      animateCrowd()
    }, [crowdVolume])

    return (
      <group ref={crowdRef}>
        {Array.from({ length: 200 }).map((_, i) => {
          const angle = (i / 200) * Math.PI * 2
          const radius = 35 + Math.random() * 10
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = 2 + Math.random() * 8

          return (
            <mesh key={i} position={[x, y, z]}>
              <boxGeometry args={[0.5, 1.5, 0.5]} />
              <meshStandardMaterial color={Math.random() > 0.5 ? "#3b82f6" : "#ef4444"} />
            </mesh>
          )
        })}
      </group>
    )
  }

  // Player avatars
  const Players = () => {
    const [playerPositions, setPlayerPositions] = useState<Array<{ x: number; z: number; team: string }>>([])

    useEffect(() => {
      // PSG formation (4-3-3)
      const psgPositions = [
        { x: 0, z: -45, team: "psg" }, // GK
        { x: -15, z: -25, team: "psg" },
        { x: -5, z: -25, team: "psg" },
        { x: 5, z: -25, team: "psg" },
        { x: 15, z: -25, team: "psg" }, // Defense
        { x: -8, z: -10, team: "psg" },
        { x: 0, z: -10, team: "psg" },
        { x: 8, z: -10, team: "psg" }, // Midfield
        { x: -12, z: 5, team: "psg" },
        { x: 0, z: 8, team: "psg" },
        { x: 12, z: 5, team: "psg" }, // Attack
      ]

      // Barcelona formation (4-3-3)
      const barcaPositions = [
        { x: 0, z: 45, team: "barca" }, // GK
        { x: -15, z: 25, team: "barca" },
        { x: -5, z: 25, team: "barca" },
        { x: 5, z: 25, team: "barca" },
        { x: 15, z: 25, team: "barca" }, // Defense
        { x: -8, z: 10, team: "barca" },
        { x: 0, z: 10, team: "barca" },
        { x: 8, z: 10, team: "barca" }, // Midfield
        { x: -12, z: -5, team: "barca" },
        { x: 0, z: -8, team: "barca" },
        { x: 12, z: -5, team: "barca" }, // Attack
      ]

      setPlayerPositions([...psgPositions, ...barcaPositions])
    }, [])

    return (
      <group ref={playersRef}>
        {playerPositions.map((player, i) => (
          <group key={i} position={[player.x, -1, player.z]}>
            <mesh>
              <capsuleGeometry args={[0.5, 1.5]} />
              <meshStandardMaterial color={player.team === "psg" ? "#003f7f" : "#a50044"} />
            </mesh>
            <Text position={[0, 2, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
              {i + 1}
            </Text>
          </group>
        ))}

        {/* Ball */}
        <mesh position={[0, -1.5, 0]}>
          <sphereGeometry args={[0.11]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    )
  }

  // User avatars floating above stadium
  const UserAvatars = () => {
    const avatarPositions = [
      { x: -20, y: 25, z: -20, emotion: "hype" },
      { x: 20, y: 30, z: -15, emotion: "love" },
      { x: -10, y: 28, z: 25, emotion: "shock" },
      { x: 15, y: 32, z: 20, emotion: "rage" },
      { x: 0, y: 35, z: 0, emotion: "hype" },
    ]

    const emotionColors = {
      hype: "#ef4444",
      love: "#3b82f6",
      shock: "#fbbf24",
      rage: "#7c2d12",
    }

    return (
      <group>
        {avatarPositions.map((avatar, i) => (
          <group key={i} position={[avatar.x, avatar.y, avatar.z]}>
            <mesh>
              <sphereGeometry args={[1]} />
              <meshStandardMaterial
                color={emotionColors[avatar.emotion as keyof typeof emotionColors]}
                transparent
                opacity={0.8}
                emissive={emotionColors[avatar.emotion as keyof typeof emotionColors]}
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Particle trail */}
            <mesh position={[0, -2, 0]}>
              <cylinderGeometry args={[0.1, 0.5, 4]} />
              <meshStandardMaterial
                color={emotionColors[avatar.emotion as keyof typeof emotionColors]}
                transparent
                opacity={0.4}
              />
            </mesh>
          </group>
        ))}
      </group>
    )
  }

  return (
    <group ref={stadiumRef}>
      <StadiumStructure />
      <Pitch />
      <Crowd />
      <Players />
      <UserAvatars />

      {/* Weather effects */}
      {weather === "rain" && (
        <group>
          {Array.from({ length: 1000 }).map((_, i) => (
            <mesh
              key={i}
              position={[(Math.random() - 0.5) * 100, Math.random() * 50 + 20, (Math.random() - 0.5) * 100]}
            >
              <cylinderGeometry args={[0.01, 0.01, 2]} />
              <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

function CameraController({ view }: { view: string }) {
  const cameraPositions = {
    drone: [0, 50, 80],
    ground: [0, 5, -60],
    tactical: [0, 80, 0],
    corner: [30, 10, -45],
  }

  const position = cameraPositions[view as keyof typeof cameraPositions] || cameraPositions.drone

  return <PerspectiveCamera makeDefault position={position} fov={60} />
}

export function Stadium3D({ cameraView, weather, crowdVolume, isVRActive = false, onVRStateChange }: Stadium3DProps) {
  const [vrSupported, setVRSupported] = useState(false)
  const [vrCheckComplete, setVrCheckComplete] = useState(false)

  useEffect(() => {
    // Safely check VR support with comprehensive error handling
    const checkVRSupport = async () => {
      try {
        // Multiple checks for VR support
        const hasSecureContext = window.isSecureContext
        const hasNavigatorXR = typeof navigator !== "undefined" && "xr" in navigator
        const hasWebXRSupport = hasNavigatorXR && navigator.xr

        if (!hasSecureContext) {
          console.log("WebXR requires HTTPS")
          setVRSupported(false)
          setVrCheckComplete(true)
          return
        }

        if (!hasWebXRSupport) {
          console.log("WebXR not available")
          setVRSupported(false)
          setVrCheckComplete(true)
          return
        }

        // Try to check session support with timeout and error handling
        try {
          const timeoutPromise = new Promise<boolean>((_, reject) => {
            setTimeout(() => reject(new Error("VR check timeout")), 2000)
          })

          const supportPromise = navigator.xr!.isSessionSupported("immersive-vr")

          const supported = await Promise.race([supportPromise, timeoutPromise])
          setVRSupported(supported)
        } catch (vrError) {
          console.log("VR session check failed:", vrError)
          setVRSupported(false)
        }
      } catch (error) {
        console.log("VR support check error:", error)
        setVRSupported(false)
      } finally {
        setVrCheckComplete(true)
      }
    }

    checkVRSupport()
  }, [])

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        {/* WebXR Manager - only if VR is supported and check is complete */}
        {vrCheckComplete && vrSupported && onVRStateChange && (
          <WebXRManager isVRActive={isVRActive} onVRStateChange={onVRStateChange} />
        )}

        {/* VR Components - only if VR is active */}
        {isVRActive && vrSupported && (
          <>
            <VRControllers />
            <VRTeleportation />
          </>
        )}

        {/* Standard camera and controls */}
        <CameraController view={cameraView} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Stadium floodlights */}
        <pointLight position={[0, 30, 0]} intensity={2} distance={100} />
        <pointLight position={[30, 20, 30]} intensity={1.5} distance={80} />
        <pointLight position={[-30, 20, 30]} intensity={1.5} distance={80} />
        <pointLight position={[30, 20, -30]} intensity={1.5} distance={80} />
        <pointLight position={[-30, 20, -30]} intensity={1.5} distance={80} />

        <Suspense fallback={null}>
          <Stadium weather={weather} crowdVolume={crowdVolume} />
          <VRStadiumExperience matchTime={{ minutes: 67, seconds: 23 }} collectiveEmotion={75} />
          <Environment preset="night" />
        </Suspense>

        {/* VR UI Panel - only if VR is active and supported */}
        {isVRActive && vrSupported && (
          <VRUIPanel
            position={[0, 2, -5]}
            onEmotionSelect={(emotion) => console.log("VR Emotion:", emotion)}
            onCameraChange={(view) => console.log("VR Camera:", view)}
          />
        )}
      </Canvas>
    </div>
  )
}
