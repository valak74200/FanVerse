"use client"

import React from "react"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Text, Html, Sky } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { EnhancedFanAvatars } from "./enhanced-fan-avatars"
import { EnhancedPlayerAvatars } from "./enhanced-player-avatars"

interface Stadium3DCompleteProps {
  cameraView: string
  weather: string
  crowdVolume: number
  matchData: {
    score: { home: number; away: number }
    time: { minutes: number; seconds: number }
    events: Array<{ type: string; player: string; time: string }>
  }
  onEmotionTrigger?: (emotion: string) => void
}

// Stade ultra-réaliste avec tous les détails
function CompleteStadium({ weather, crowdVolume }: { weather: string; crowdVolume: number }) {
  const stadiumRef = useRef(null)
  const crowdRef = useRef(null)

  useFrame((state: any) => {
    if (crowdRef.current) {
      const time = state.clock.getElapsedTime()
      const intensity = crowdVolume / 100

      crowdRef.current.children.forEach((child: any, i: number) => {
        const mesh = child as THREE.Mesh
        const waveOffset = (i / 1000) * Math.PI * 2
        const waveHeight = Math.sin(time * 2 + waveOffset) * intensity * 0.8
        mesh.position.y = mesh.userData.baseY + Math.max(0, waveHeight)
        mesh.rotation.y = Math.sin(time * 0.5 + i) * 0.3
      })
    }
  })

  return (
    <group ref={stadiumRef}>
      {/* Structure principale du stade */}
      <group>
        {/* Gradins inférieurs - Niveau 1 */}
        <mesh position={[0, 0, 0] as any}>
          <cylinderGeometry args={[52, 56, 15, 64, 1, true]} />
          <meshStandardMaterial color="#2a2a2a" {...({ side: THREE.DoubleSide } as any)} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Gradins moyens - Niveau 2 */}
        <mesh position={[0, 12, 0] as any}>
          <cylinderGeometry args={[48, 52, 12, 64, 1, true]} />
          <meshStandardMaterial color="#1a1a1a" {...({ side: THREE.DoubleSide } as any)} roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Gradins supérieurs - Niveau 3 */}
        <mesh position={[0, 20, 0] as any}>
          <cylinderGeometry args={[44, 48, 10, 64, 1, true]} />
          <meshStandardMaterial color="#0a0a0a" {...({ side: THREE.DoubleSide } as any)} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Toit moderne avec structure complexe */}
        <mesh position={[0, 32, 0] as any}>
          <cylinderGeometry args={[50, 50, 3, 64, 1, true]} />
          <meshStandardMaterial color="#000000" transparent opacity={0.9} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Supports structurels du toit */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i / 32) * Math.PI * 2
          const x = Math.cos(angle) * 47
          const z = Math.sin(angle) * 47
          return (
            <group key={i} position={[x, 20, z] as any} rotation={[0, angle, 0] as any}>
              <mesh>
                <boxGeometry args={[2, 20, 1]} />
                <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Câbles de support */}
              <mesh position={[0, 10, 0] as any} rotation={[0, 0, Math.PI / 6] as any}>
                <cylinderGeometry args={[0.05, 0.05, 15]} />
                <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          )
        })}

        {/* Façade extérieure avec détails architecturaux */}
        <mesh position={[0, 7.5, 0] as any}>
          <cylinderGeometry args={[58, 60, 15, 64, 1, true]} />
          <meshStandardMaterial {...({ color: "#1a1a1a", side: THREE.DoubleSide, roughness: 0.9 } as any)} />
        </mesh>

        {/* Entrées et sorties */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const x = Math.cos(angle) * 59
          const z = Math.sin(angle) * 59
          return (
            <group key={i} position={[x, 0, z] as any} rotation={[0, angle, 0] as any}>
              <mesh>
                <boxGeometry args={[8, 12, 3]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
              {/* Portes d'entrée */}
              <mesh position={[0, -3, 1.6] as any}>
                <boxGeometry args={[6, 6, 0.2]} />
                <meshStandardMaterial color="#666666" metalness={0.5} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Système d'éclairage LED ultra-moderne */}
      {Array.from({ length: 64 }).map((_, i) => {
        const angle = (i / 64) * Math.PI * 2
        const radius = 45
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const height = 28 + Math.sin(angle * 4) * 2
        return (
          <group key={i} position={[x, height, z] as any}>
            <mesh>
              <boxGeometry args={[4, 0.8, 0.8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>
            <spotLight
              intensity={4}
              distance={120}
              angle={Math.PI / 5}
              penumbra={0.2}
              color="#ffffff"
              position={[0, -2, 0] as any}
              target-position={[0, -30, 0] as any}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
          </group>
        )
      })}

      {/* Pelouse ultra-détaillée avec motifs */}
      <CompletePitch />

      {/* Foule animée ultra-réaliste */}
      <RealisticCrowd crowdVolume={crowdVolume} ref={crowdRef} />

      {/* Nouveaux avatars de supporters */}
      <EnhancedFanAvatars crowdVolume={crowdVolume} emotionData={{}} />

      {/* Joueurs avec avatars améliorés */}
      <EnhancedPlayerAvatars highlightedPlayer={10} ballPosition={[0, 0.5, 0]} />

      {/* Écrans géants */}
      <GiantScreens />

      {/* Effets météo */}
      {weather === "rain" && <RainEffect />}
      {weather === "snow" && <SnowEffect />}

      {/* Feux d'artifice pour les buts */}
      <Fireworks />

      {/* Système audio 3D */}
      <AudioSystem />
    </group>
  )
}

// Pelouse complète avec tous les détails
function CompletePitch() {
  return (
    <group position={[0, -1.95, 0] as any}>
      {/* Pelouse principale avec texture réaliste */}
      <mesh rotation={[-Math.PI / 2, 0, 0] as any} receiveShadow>
        <planeGeometry args={[68, 105]} />
        <meshStandardMaterial color="#16a34a" roughness={0.9} {...({ normalScale: new THREE.Vector2(0.5, 0.5) } as any)} />
      </mesh>

      {/* Motifs de tonte */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0] as any} position={[0, 0.001, -45 + i * 15] as any}>
          <planeGeometry args={[68, 7.5]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#15803d" : "#16a34a"} transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Lignes de terrain en relief 3D */}
      <group position={[0, 0.02, 0] as any}>
        {/* Ligne médiane */}
        <mesh rotation={[-Math.PI / 2, 0, 0] as any}>
          <planeGeometry args={[0.2, 105]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>

        {/* Cercle central avec relief */}
        <mesh rotation={[-Math.PI / 2, 0, 0] as any}>
          <ringGeometry args={[9.15, 9.35, 64]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>

        {/* Point central */}
        <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[0, 0.001, 0] as any}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
        </mesh>

        {/* Surfaces de réparation détaillées */}
        {[-1, 1].map((side, i) => (
          <group key={i}>
            {/* Grande surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[0, 0.001, side * 35] as any}>
              <planeGeometry args={[40.3, 0.2]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[20, 0.001, side * 35] as any}>
              <planeGeometry args={[0.2, 16.5]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[-20, 0.001, side * 35] as any}>
              <planeGeometry args={[0.2, 16.5]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
            </mesh>

            {/* Petite surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[0, 0.001, side * 43] as any}>
              <planeGeometry args={[18.3, 0.2]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[9, 0.001, side * 43] as any}>
              <planeGeometry args={[0.2, 5.5]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[-9, 0.001, side * 43] as any}>
              <planeGeometry args={[0.2, 5.5]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
            </mesh>

            {/* Arc de cercle */}
            <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[0, 0.001, side * 40.5] as any}>
              <ringGeometry args={[9.15, 9.35, 32, 1, 0, Math.PI]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
            </mesh>

            {/* Point de penalty */}
            <mesh rotation={[-Math.PI / 2, 0, 0] as any} position={[0, 0.002, side * 41.5] as any}>
              <circleGeometry args={[0.15, 16]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
            </mesh>
          </group>
        ))}

        {/* Corners */}
        {[
          [-34, -52.5],
          [34, -52.5],
          [-34, 52.5],
          [34, 52.5],
        ].map(([x, z], i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0] as any} position={[x, 0.001, z] as any}>
            <ringGeometry args={[0.9, 1.1, 16, 1, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
          </mesh>
        ))}
      </group>

      {/* Buts ultra-détaillés */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[0, 2.44, side * 52.5] as any}>
          {/* Structure principale */}
          <mesh position={[-3.66, 0, 0] as any} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.44]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[3.66, 0, 0] as any} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.44]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.22, 0] as any} rotation={[0, 0, Math.PI / 2] as any} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 7.32]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Filets détaillés */}
                      <mesh position={[0, 0.6, -1.5] as any}>
              <planeGeometry args={[7.32, 2.44]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} wireframe={true} {...({ side: THREE.DoubleSide } as any)} />
            </mesh>
            <mesh position={[-3.66, 0.6, -0.75] as any} rotation={[0, Math.PI / 2, 0] as any}>
              <planeGeometry args={[1.5, 2.44]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} wireframe={true} {...({ side: THREE.DoubleSide } as any)} />
            </mesh>
            <mesh position={[3.66, 0.6, -0.75] as any} rotation={[0, Math.PI / 2, 0] as any}>
              <planeGeometry args={[1.5, 2.44]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} wireframe={true} {...({ side: THREE.DoubleSide } as any)} />
            </mesh>
        </group>
      ))}
    </group>
  )
}

// Foule ultra-réaliste avec animations complexes
const RealisticCrowd = React.forwardRef<THREE.Group, { crowdVolume: number }>(({ crowdVolume }, ref) => {
  return (
    <group ref={ref}>
      {Array.from({ length: 1200 }).map((_, i) => {
        const section = Math.floor(i / 150)
        const angle = (i / 1200) * Math.PI * 2
        const radius = 40 + Math.random() * 15
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const baseY = 3 + Math.random() * 20

        // Couleurs par section (supporters des équipes)
        const sectionColors = ["#FF0000", "#0066CC", "#FF0000", "#0066CC", "#FF0000", "#0066CC", "#FF0000", "#0066CC"]

        return (
          <mesh key={i} position={[x, baseY, z] as any} userData={{ baseY }} castShadow>
            <boxGeometry args={[0.4, 1.8, 0.4]} />
            <meshStandardMaterial color={sectionColors[section]} roughness={0.8} />
          </mesh>
        )
      })}
    </group>
  )
})

// Écrans géants
function GiantScreens() {
  return (
    <group>
      {/* Écran principal Nord */}
      <group position={[0, 25, -58] as any}>
        <mesh>
          <planeGeometry args={[25, 12]} />
          <meshStandardMaterial color="#000000" emissive="#001122" emissiveIntensity={0.3} />
        </mesh>
        <Html position={[0, 0, 0.1] as any} transform occlude>
          <div className="w-96 h-48 bg-black text-white p-4 text-center">
            <div className="text-2xl font-bold mb-2">PSG 2 - 1 BARCELONA</div>
            <div className="text-lg text-green-400">67:23</div>
            <div className="text-sm mt-2">LIVE - Champions League</div>
          </div>
        </Html>
      </group>

      {/* Écran Sud */}
      <group position={[0, 25, 58] as any} rotation={[0, Math.PI, 0] as any}>
        <mesh>
          <planeGeometry args={[25, 12]} />
          <meshStandardMaterial color="#000000" emissive="#001122" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Écrans latéraux */}
      <group position={[58, 20, 0] as any} rotation={[0, -Math.PI / 2, 0] as any}>
        <mesh>
          <planeGeometry args={[15, 8]} />
          <meshStandardMaterial color="#000000" emissive="#001122" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <group position={[-58, 20, 0] as any} rotation={[0, Math.PI / 2, 0] as any}>
        <mesh>
          <planeGeometry args={[15, 8]} />
          <meshStandardMaterial color="#000000" emissive="#001122" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  )
}

// Effet de pluie
function RainEffect() {
  const rainRef = useRef(null)

  useFrame(() => {
    if (rainRef.current) {
      rainRef.current.children.forEach((drop: any) => {
        drop.position.y -= 3
        if (drop.position.y < -5) {
          drop.position.y = 60
          drop.position.x = (Math.random() - 0.5) * 140
          drop.position.z = (Math.random() - 0.5) * 140
        }
      })
    }
  })

  return (
    <group ref={rainRef}>
      {Array.from({ length: 3000 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 140,
          Math.random() * 65 + 25,
          (Math.random() - 0.5) * 140
        ] as any}>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} emissive="#87ceeb" emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  )
}

// Effet de neige
function SnowEffect() {
  const snowRef = useRef(null)

  useFrame(() => {
    if (snowRef.current) {
      snowRef.current.children.forEach((flake: any) => {
        flake.position.y -= 0.5
        flake.position.x += Math.sin(Date.now() * 0.001 + flake.position.z) * 0.1
        if (flake.position.y < -5) {
          flake.position.y = 60
          flake.position.x = (Math.random() - 0.5) * 140
          flake.position.z = (Math.random() - 0.5) * 140
        }
      })
    }
  })

  return (
    <group ref={snowRef}>
      {Array.from({ length: 1000 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 140,
          Math.random() * 65 + 25,
          (Math.random() - 0.5) * 140
        ] as any}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// Feux d'artifice
function Fireworks() {
  const [fireworks, setFireworks] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const newFirework = {
          id: Date.now(),
          x: (Math.random() - 0.5) * 100,
          y: 40 + Math.random() * 20,
          z: (Math.random() - 0.5) * 100,
        }
        setFireworks((prev) => [...prev, newFirework])

        setTimeout(() => {
          setFireworks((prev) => prev.filter((f) => f.id !== newFirework.id))
        }, 3000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <group>
      {fireworks.map((firework) => (
        <group key={firework.id} position={[firework.x, firework.y, firework.z] as any}>
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2
            const radius = 5
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            return (
              <mesh key={i} position={[x, 0, z] as any}>
                <sphereGeometry args={[0.2]} />
                <meshStandardMaterial
                  color={`hsl(${Math.random() * 360}, 100%, 50%)`}
                  emissive={`hsl(${Math.random() * 360}, 100%, 50%)`}
                  emissiveIntensity={0.8}
                />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

// Système audio 3D
function AudioSystem() {
  return (
    <group>
      {/* Haut-parleurs autour du stade */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const x = Math.cos(angle) * 50
        const z = Math.sin(angle) * 50
        return (
          <group key={i} position={[x, 25, z] as any} rotation={[0, angle, 0] as any}>
            <mesh>
              <boxGeometry args={[2, 1, 1]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            <positionalAudio args={[]} />
          </group>
        )
      })}
    </group>
  )
}

// Joueurs réalistes avec animations
function RealisticPlayers() {
  const players = [
    // PSG
    { name: "Donnarumma", position: [0, -1, -45], team: "psg", number: 1 },
    { name: "Hakimi", position: [15, -1, -25], team: "psg", number: 2 },
    { name: "Marquinhos", position: [5, -1, -25], team: "psg", number: 5 },
    { name: "Skriniar", position: [-5, -1, -25], team: "psg", number: 37 },
    { name: "Mendes", position: [-15, -1, -25], team: "psg", number: 25 },
    { name: "Vitinha", position: [8, -1, -10], team: "psg", number: 17 },
    { name: "Ugarte", position: [0, -1, -10], team: "psg", number: 4 },
    { name: "Zaïre-Emery", position: [-8, -1, -10], team: "psg", number: 33 },
    { name: "Dembélé", position: [12, -1, 5], team: "psg", number: 10 },
    { name: "Mbappé", position: [0, -1, 8], team: "psg", number: 7 },
    { name: "Barcola", position: [-12, -1, 5], team: "psg", number: 29 },

    // Barcelona
    { name: "Ter Stegen", position: [0, -1, 45], team: "barca", number: 1 },
    { name: "Koundé", position: [15, -1, 25], team: "barca", number: 23 },
    { name: "Araujo", position: [5, -1, 25], team: "barca", number: 4 },
    { name: "Christensen", position: [-5, -1, 25], team: "barca", number: 15 },
    { name: "Balde", position: [-15, -1, 25], team: "barca", number: 3 },
    { name: "De Jong", position: [8, -1, 10], team: "barca", number: 21 },
    { name: "Pedri", position: [0, -1, 10], team: "barca", number: 8 },
    { name: "Gavi", position: [-8, -1, 10], team: "barca", number: 6 },
    { name: "Raphinha", position: [12, -1, -5], team: "barca", number: 11 },
    { name: "Lewandowski", position: [0, -1, -8], team: "barca", number: 9 },
    { name: "Yamal", position: [-12, -1, -5], team: "barca", number: 27 },
  ]

  return (
    <group>
      {players.map((player, i) => (
        <RealisticPlayer
          position={player.position as [number, number, number]}
          team={player.team as "psg" | "barca"}
          number={player.number}
          name={player.name}
          isHighlighted={["Mbappé", "Lewandowski", "Dembélé"].includes(player.name)}
        />
      ))}
    </group>
  )
}

// Composant joueur individuel
function RealisticPlayer({
  position,
  team,
  number,
  name,
  isHighlighted = false,
}: {
  position: [number, number, number]
  team: "psg" | "barca"
  number: number
  name: string
  isHighlighted?: boolean
}) {
  const playerRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)

  useFrame((state) => {
    if (playerRef.current) {
      const time = state.clock.getElapsedTime()
      if (isRunning) {
        playerRef.current.position.y = -1 + Math.sin(time * 10) * 0.1
        playerRef.current.rotation.z = Math.sin(time * 8) * 0.05
      }
    }
  })

  const teamColors = {
    psg: { primary: "#003f7f", secondary: "#ff0000", accent: "#ffffff" },
    barca: { primary: "#a50044", secondary: "#004d98", accent: "#ffcb05" },
  }

  return (
    <group ref={playerRef} position={position as any}>
      {/* Corps du joueur détaillé */}
      <group>
        {/* Tête */}
        <mesh position={[0, 1.7, 0] as any} castShadow>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>

        {/* Corps */}
        <mesh position={[0, 1.2, 0] as any} castShadow>
          <boxGeometry args={[0.4, 0.8, 0.2]} />
          <meshStandardMaterial color={teamColors[team].primary} />
        </mesh>

        {/* Bras */}
        <mesh position={[-0.3, 1.2, 0] as any} castShadow>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>
        <mesh position={[0.3, 1.2, 0] as any} castShadow>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>

        {/* Jambes */}
        <mesh position={[-0.1, 0.4, 0] as any} castShadow>
          <boxGeometry args={[0.15, 0.7, 0.15]} />
          <meshStandardMaterial color={teamColors[team].secondary} />
        </mesh>
        <mesh position={[0.1, 0.4, 0] as any} castShadow>
          <boxGeometry args={[0.15, 0.7, 0.15]} />
          <meshStandardMaterial color={teamColors[team].secondary} />
        </mesh>

        {/* Chaussures */}
        <mesh position={[-0.1, 0.05, 0.1] as any} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.1, 0.05, 0.1] as any} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Numéro du joueur */}
      <Text
        position={[0, 1.2, 0.11] as any}
        fontSize={0.2}
        color={teamColors[team].accent}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {number}
      </Text>

      {/* Nom du joueur */}
      <Text
        position={[0, 2.2, 0] as any}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>

      {/* Effet de surbrillance */}
      {isHighlighted && (
        <mesh position={[0, 0.5, 0] as any} rotation={[-Math.PI / 2, 0, 0] as any}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshStandardMaterial
            color={teamColors[team].primary}
            transparent
            opacity={0.6}
            emissive={teamColors[team].primary}
            emissiveIntensity={0.4}
          />
        </mesh>
      )}
    </group>
  )
}

// Ballon avec physique réaliste
function RealisticBall() {
  const ballRef = useRef(null)

  useFrame((state) => {
    if (ballRef.current) {
      const time = state.clock.getElapsedTime()
      const x = Math.sin(time * 0.3) * 25
      const z = Math.cos(time * 0.2) * 35
      const y = -1.5 + Math.abs(Math.sin(time * 2)) * 3

      ballRef.current.position.set(x, y, z)
      ballRef.current.rotation.x += 0.1
      ballRef.current.rotation.z += 0.05
    }
  })

  return (
    <mesh ref={ballRef} position={[0, -1.5, 0] as any} castShadow>
      <sphereGeometry args={[0.11, 32, 32]} />
      <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} {...({ normalScale: new THREE.Vector2(0.5, 0.5) } as any)} />
    </mesh>
  )
}

// Contrôleur de caméra avancé
function AdvancedCameraController({ view }: { view: string }) {
  const cameraPositions = {
    drone: [0, 80, 120],
    ground: [0, 3, -70],
    tactical: [0, 120, 0],
    corner: [40, 15, -55],
    cinematic: [60, 30, 60],
    tunnel: [0, 2, -52],
    vip: [25, 15, 0],
    broadcast: [0, 25, -80],
  }

  const position = cameraPositions[view as keyof typeof cameraPositions] || cameraPositions.drone

  return <PerspectiveCamera makeDefault position={position as any} fov={60} />
}

export function Stadium3DComplete({
  cameraView,
  weather,
  crowdVolume,
  matchData,
  onEmotionTrigger,
}: Stadium3DCompleteProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ fov: 60, position: [0, 80, 120], near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <AdvancedCameraController view={cameraView} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={300}
          minDistance={5}
          maxPolarAngle={Math.PI / 2.1}
        />

        {/* Éclairage avancé */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight
          position={[100, 100, 50] as any}
          intensity={2}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={300}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
        />

        {/* Éclairage d'ambiance */}
        <hemisphereLight intensity={0.6} groundColor="#444444" />

        <Suspense fallback={null}>
          <CompleteStadium weather={weather} crowdVolume={crowdVolume} />
          <RealisticPlayers />
          <RealisticBall />

          {/* Environnement */}
          {weather === "clear" && <Environment preset="night" />}
          {weather === "cloudy" && <Environment preset="dawn" />}
          {weather === "night" && <Sky sunPosition={[0, -1, 0]} />}
        </Suspense>

        {/* Fog pour l'atmosphère */}
        <fog attach="fog" args={["#000011", 100, 300]} />
      </Canvas>
    </div>
  )
}
