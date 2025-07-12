"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Text, Sphere, Box } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import * as THREE from "three"

interface RealisticStadium3DProps {
  cameraView: string
  weather: string
  crowdVolume: number
  matchData: {
    score: { home: number; away: number }
    time: { minutes: number; seconds: number }
    events: Array<{ type: string; player: string; time: string }>
  }
}

// Composant pour un joueur réaliste
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
  const playerRef = useRef<THREE.Group>(null)
  const [isRunning, setIsRunning] = useState(false)

  useFrame((state) => {
    if (playerRef.current) {
      // Animation de course réaliste
      const time = state.clock.getElapsedTime()
      if (isRunning) {
        playerRef.current.position.y = -1 + Math.sin(time * 10) * 0.1
        playerRef.current.rotation.z = Math.sin(time * 8) * 0.05
      }

      // Rotation vers le ballon
      const ballPosition = new THREE.Vector3(0, -1.5, 0)
      playerRef.current.lookAt(ballPosition)
    }
  })

  const teamColors = {
    psg: { primary: "#003f7f", secondary: "#ff0000", accent: "#ffffff" },
    barca: { primary: "#a50044", secondary: "#004d98", accent: "#ffcb05" },
  }

  return (
    <group ref={playerRef} position={position}>
      {/* Corps du joueur */}
      <group>
        {/* Tête */}
        <Sphere args={[0.15]} position={[0, 1.7, 0]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Sphere>

        {/* Corps */}
        <Box args={[0.4, 0.8, 0.2]} position={[0, 1.2, 0]}>
          <meshStandardMaterial color={teamColors[team].primary} />
        </Box>

        {/* Bras */}
        <Box args={[0.15, 0.6, 0.15]} position={[-0.3, 1.2, 0]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
        <Box args={[0.15, 0.6, 0.15]} position={[0.3, 1.2, 0]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>

        {/* Jambes */}
        <Box args={[0.15, 0.7, 0.15]} position={[-0.1, 0.4, 0]}>
          <meshStandardMaterial color={teamColors[team].secondary} />
        </Box>
        <Box args={[0.15, 0.7, 0.15]} position={[0.1, 0.4, 0]}>
          <meshStandardMaterial color={teamColors[team].secondary} />
        </Box>

        {/* Chaussures */}
        <Box args={[0.2, 0.1, 0.3]} position={[-0.1, 0.05, 0.1]}>
          <meshStandardMaterial color="#000000" />
        </Box>
        <Box args={[0.2, 0.1, 0.3]} position={[0.1, 0.05, 0.1]}>
          <meshStandardMaterial color="#000000" />
        </Box>
      </group>

      {/* Numéro du joueur */}
      <Text
        position={[0, 1.2, 0.11]}
        fontSize={0.2}
        color={teamColors[team].accent}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {number}
      </Text>

      {/* Nom du joueur (flottant) */}
      <Text
        position={[0, 2.2, 0]}
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
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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

// Stade ultra-réaliste
function UltraRealisticStadium({ weather, crowdVolume }: { weather: string; crowdVolume: number }) {
  const stadiumRef = useRef<THREE.Group>(null)

  return (
    <group ref={stadiumRef}>
      {/* Structure principale du stade */}
      <group>
        {/* Gradins inférieurs */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[48, 52, 12, 64, 1, true, 0, Math.PI * 2]} />
          <meshStandardMaterial color="#2a2a2a" side={THREE.DoubleSide} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Gradins supérieurs */}
        <mesh position={[0, 8, 0]}>
          <cylinderGeometry args={[45, 49, 8, 64, 1, true, 0, Math.PI * 2]} />
          <meshStandardMaterial color="#1a1a1a" side={THREE.DoubleSide} roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Toit moderne */}
        <mesh position={[0, 18, 0]}>
          <cylinderGeometry args={[50, 50, 2, 64, 1, true]} />
          <meshStandardMaterial color="#0a0a0a" transparent opacity={0.9} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Supports du toit */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2
          const x = Math.cos(angle) * 45
          const z = Math.sin(angle) * 45
          return (
            <mesh key={i} position={[x, 12, z]} rotation={[0, angle, 0]}>
              <boxGeometry args={[2, 12, 1]} />
              <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </mesh>
          )
        })}
      </group>

      {/* Éclairage LED moderne */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2
        const radius = 42
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <group key={i} position={[x, 16, z]}>
            <mesh>
              <boxGeometry args={[3, 0.5, 0.5]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>
            <spotLight
              intensity={3}
              distance={100}
              angle={Math.PI / 6}
              penumbra={0.3}
              color="#ffffff"
              position={[0, -1, 0]}
              target-position={[0, -20, 0]}
              castShadow
            />
          </group>
        )
      })}

      {/* Pelouse ultra-détaillée */}
      <group position={[0, -1.95, 0]}>
        {/* Pelouse principale */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[68, 105]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} normalScale={new THREE.Vector2(0.5, 0.5)} />
        </mesh>

        {/* Lignes de terrain en relief */}
        <group position={[0, 0.01, 0]}>
          {/* Ligne médiane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 105]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
          </mesh>

          {/* Cercle central */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[9.15, 9.3, 64]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
          </mesh>

          {/* Point central */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
          </mesh>
        </group>

        {/* Buts modernes */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[0, 2.44, side * 52.5]}>
            {/* Poteaux */}
            <mesh position={[-3.66, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 2.44]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[3.66, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 2.44]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 7.32]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Filets */}
            <mesh position={[0, 0.6, -1]}>
              <planeGeometry args={[7.32, 2.44]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Foule animée réaliste */}
      <RealisticCrowd crowdVolume={crowdVolume} />

      {/* Effets météo */}
      {weather === "rain" && <RainEffect />}
    </group>
  )
}

// Foule réaliste avec animations
function RealisticCrowd({ crowdVolume }: { crowdVolume: number }) {
  const crowdRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (crowdRef.current) {
      const time = state.clock.getElapsedTime()
      const intensity = crowdVolume / 100

      crowdRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        // Vague mexicaine
        const waveOffset = (i / 500) * Math.PI * 2
        const waveHeight = Math.sin(time * 2 + waveOffset) * intensity * 0.8
        mesh.position.y = mesh.userData.baseY + Math.max(0, waveHeight)

        // Rotation aléatoire
        mesh.rotation.y = Math.sin(time * 0.5 + i) * 0.3
      })
    }
  })

  return (
    <group ref={crowdRef}>
      {Array.from({ length: 800 }).map((_, i) => {
        const section = Math.floor(i / 100)
        const angle = (i / 800) * Math.PI * 2
        const radius = 38 + Math.random() * 12
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const baseY = 3 + Math.random() * 15

        // Couleurs par section
        const sectionColors = ["#003f7f", "#ff0000", "#a50044", "#004d98", "#003f7f", "#ff0000", "#a50044", "#004d98"]

        return (
          <mesh key={i} position={[x, baseY, z]} userData={{ baseY }}>
            <boxGeometry args={[0.3, 1.2, 0.3]} />
            <meshStandardMaterial color={sectionColors[section]} roughness={0.8} />
          </mesh>
        )
      })}
    </group>
  )
}

// Effet de pluie
function RainEffect() {
  const rainRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (rainRef.current) {
      rainRef.current.children.forEach((drop) => {
        drop.position.y -= 2
        if (drop.position.y < -5) {
          drop.position.y = 50
          drop.position.x = (Math.random() - 0.5) * 120
          drop.position.z = (Math.random() - 0.5) * 120
        }
      })
    }
  })

  return (
    <group ref={rainRef}>
      {Array.from({ length: 2000 }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 120, Math.random() * 55 + 20, (Math.random() - 0.5) * 120]}>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} emissive="#87ceeb" emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  )
}

// Ballon avec physique
function RealisticBall() {
  const ballRef = useRef<THREE.Mesh>(null)
  const [ballPosition, setBallPosition] = useState(new THREE.Vector3(0, -1.5, 0))

  useFrame((state) => {
    if (ballRef.current) {
      const time = state.clock.getElapsedTime()
      // Simulation de mouvement du ballon
      const x = Math.sin(time * 0.3) * 20
      const z = Math.cos(time * 0.2) * 30
      const y = -1.5 + Math.abs(Math.sin(time * 2)) * 2

      ballRef.current.position.set(x, y, z)
      ballRef.current.rotation.x += 0.1
      ballRef.current.rotation.z += 0.05
    }
  })

  return (
    <mesh ref={ballRef} position={[0, -1.5, 0]} castShadow>
      <sphereGeometry args={[0.11, 32, 32]} />
      <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} normalScale={new THREE.Vector2(0.5, 0.5)} />
    </mesh>
  )
}

export function RealisticStadium3D({ cameraView, weather, crowdVolume, matchData }: RealisticStadium3DProps) {
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

  const cameraPositions = {
    drone: [0, 60, 100],
    ground: [0, 3, -65],
    tactical: [0, 100, 0],
    corner: [35, 15, -50],
    cinematic: [50, 25, 50],
  }

  const position = cameraPositions[cameraView as keyof typeof cameraPositions] || cameraPositions.drone

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ fov: 60, position, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <PerspectiveCamera makeDefault position={position} fov={60} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={200}
          minDistance={5}
          maxPolarAngle={Math.PI / 2.2}
        />

        {/* Éclairage avancé */}
        <ambientLight intensity={0.3} color="#ffffff" />
        <directionalLight
          position={[100, 100, 50]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={200}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        {/* Éclairage d'ambiance */}
        <hemisphereLight intensity={0.5} groundColor="#444444" />

        <Suspense fallback={null}>
          <UltraRealisticStadium weather={weather} crowdVolume={crowdVolume} />

          {/* Joueurs réalistes */}
          {players.map((player, i) => (
            <RealisticPlayer
              key={i}
              position={player.position as [number, number, number]}
              team={player.team as "psg" | "barca"}
              number={player.number}
              name={player.name}
              isHighlighted={["Mbappé", "Messi", "Lewandowski"].includes(player.name)}
            />
          ))}

          <RealisticBall />

          <Environment preset="night" />
        </Suspense>

        {/* Fog pour l'atmosphère */}
        <fog attach="fog" args={["#000000", 80, 200]} />
      </Canvas>
    </div>
  )
}
