"use client"

import { useState, useRef } from "react"
import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface VRUIPanelProps {
  position: [number, number, number]
  onEmotionSelect: (emotion: string) => void
  onCameraChange: (view: string) => void
}

export function VRUIPanel({ position, onEmotionSelect, onCameraChange }: VRUIPanelProps) {
  const panelRef = useRef(null)
  const [hoveredButton, setHoveredButton] = useState(null)

  useFrame(({ camera }) => {
    // Make panel always face the user
    if (panelRef.current) {
      panelRef.current.lookAt(camera.position)
    }
  })

  const emotions = [
    { id: "hype", emoji: "🔥", label: "HYPE", color: "#ef4444" },
    { id: "love", emoji: "💙", label: "LOVE", color: "#3b82f6" },
    { id: "shock", emoji: "😱", label: "SHOCK", color: "#fbbf24" },
    { id: "rage", emoji: "😤", label: "RAGE", color: "#7c2d12" },
  ]

  const cameraViews = [
    { id: "drone", label: "DRONE" },
    { id: "ground", label: "GROUND" },
    { id: "tactical", label: "TACTICAL" },
    { id: "corner", label: "CORNER" },
  ]

  return (
    <group ref={panelRef} position={position as any}>
      {/* Main Panel Background */}
      <mesh position={[0, 0, -0.1] as any}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial {...({ color: "#1a1a1a", transparent: true, opacity: 0.9, side: THREE.DoubleSide } as any)} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 2.5, 0] as any}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        VR CONTROLS
      </Text>

      {/* Emotion Buttons */}
      <Text position={[-3, 1.5, 0] as any} fontSize={0.25} color="#888888" anchorX="left" anchorY="middle">
        EMOTIONS:
      </Text>

      {emotions.map((emotion, index) => (
        <group key={emotion.id} position={[-2.5 + index * 1.5, 0.8, 0] as any}>
          <mesh
            onPointerEnter={() => setHoveredButton(emotion.id)}
            onPointerLeave={() => setHoveredButton(null)}
            onClick={() => onEmotionSelect(emotion.id)}
          >
            <circleGeometry args={[0.4]} />
            <meshStandardMaterial
              {...({
                color: emotion.color,
                transparent: true,
                opacity: hoveredButton === emotion.id ? 1 : 0.8,
                emissive: emotion.color,
                emissiveIntensity: hoveredButton === emotion.id ? 0.3 : 0.1
              } as any)}
            />
          </mesh>
          <Text position={[0, 0, 0.01] as any} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
            {emotion.emoji}
          </Text>
          <Text position={[0, -0.7, 0] as any} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">
            {emotion.label}
          </Text>
        </group>
      ))}

      {/* Camera View Buttons */}
      <Text position={[-3, -0.5, 0] as any} fontSize={0.25} color="#888888" anchorX="left" anchorY="middle">
        CAMERA:
      </Text>

      {cameraViews.map((view, index) => (
        <group key={view.id} position={[-2.5 + index * 1.5, -1.3, 0] as any}>
          <mesh
            onPointerEnter={() => setHoveredButton(view.id)}
            onPointerLeave={() => setHoveredButton(null)}
            onClick={() => onCameraChange(view.id)}
          >
            <boxGeometry args={[1, 0.4, 0.1]} />
            <meshStandardMaterial {...({ color: hoveredButton === view.id ? "#3b82f6" : "#404040", transparent: true, opacity: 0.9 } as any)} />
          </mesh>
          <Text position={[0, 0, 0.06] as any} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle">
            {view.label}
          </Text>
        </group>
      ))}

      {/* Exit VR Button */}
      <group position={[0, -2.3, 0] as any}>
        <mesh
          onPointerEnter={() => setHoveredButton("exit")}
          onPointerLeave={() => setHoveredButton(null)}
          onClick={() => {
            // This would be handled by parent component
            window.dispatchEvent(new CustomEvent("exitVR"))
          }}
        >
          <boxGeometry args={[2, 0.5, 0.1]} />
          <meshStandardMaterial {...({ color: hoveredButton === "exit" ? "#ef4444" : "#666666", transparent: true, opacity: 0.9 } as any)} />
        </mesh>
        <Text position={[0, 0, 0.06] as any} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
          EXIT VR
        </Text>
      </group>
    </group>
  )
}
