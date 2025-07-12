"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html, Text } from "@react-three/drei"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Maximize2, Minimize2, RotateCcw, Zap } from "lucide-react"
import * as THREE from "three"

// Composant pour le modèle 3D du stade
function StadeModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  // Animation de rotation douce
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  // Stade temporaire avec des formes géométriques simples
  return (
    <group ref={groupRef}>
      {/* Terrain de football */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#2d5a2d" />
      </mesh>
      
      {/* Tribunes */}
      <mesh position={[0, 2, -8]}>
        <boxGeometry args={[25, 4, 2]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0, 2, 8]}>
        <boxGeometry args={[25, 4, 2]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[-12, 2, 0]}>
        <boxGeometry args={[2, 4, 16]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[12, 2, 0]}>
        <boxGeometry args={[2, 4, 16]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Projecteurs */}
      <mesh position={[-10, 8, -6]}>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[10, 8, -6]}>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-10, 8, 6]}>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[10, 8, 6]}>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Lignes du terrain */}
      <mesh position={[0, 0.01, 0]}>
        <ringGeometry args={[2, 2.1, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

// Composant de chargement
function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-white">Chargement du stade...</span>
      </div>
    </Html>
  )
}

interface StadeViewer3DProps {
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export default function StadeViewer3D({ 
  isFullscreen = false, 
  onToggleFullscreen 
}: StadeViewer3DProps) {
  const [isRotating, setIsRotating] = useState(true)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([10, 10, 10])

  const resetCamera = () => {
    setCameraPosition([10, 10, 10])
  }

  const toggleRotation = () => {
    setIsRotating(!isRotating)
  }

  return (
    <motion.div
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-96 w-full'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`h-full bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-md border border-primary/20 ${isFullscreen ? 'rounded-none' : 'rounded-lg'}`}>
        <CardContent className="p-0 h-full relative">
          {/* Titre */}
          <div className="absolute top-4 left-4 z-10">
            <h3 className="text-white text-xl font-bold flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Stade 3D
            </h3>
          </div>

          {/* Contrôles */}
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetCamera}
              className="bg-black/50 border-primary/30 text-white hover:bg-primary/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFullscreen}
              className="bg-black/50 border-primary/30 text-white hover:bg-primary/20"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>

          {/* Scène 3D */}
          <Canvas
            camera={{ position: cameraPosition, fov: 75 }}
            className="h-full w-full"
          >
            <Suspense fallback={<LoadingSpinner />}>
              {/* Éclairage */}
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              
              {/* Environnement */}
              <Environment preset="sunset" />
              
              {/* Modèle du stade */}
              <StadeModel />
              
              {/* Contrôles de caméra */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={isRotating}
                autoRotateSpeed={0.5}
                minDistance={5}
                maxDistance={50}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
              />
            </Suspense>
          </Canvas>

          {/* Informations en bas */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
              <p>
                <strong>Contrôles :</strong> Clic gauche pour tourner • Molette pour zoomer • Clic droit pour déplacer
              </p>
              <div className="flex items-center justify-between mt-2">
                <span>Rotation automatique</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleRotation}
                  className={`${isRotating ? 'bg-primary/20 border-primary' : 'bg-black/20 border-gray-600'} text-white`}
                >
                  {isRotating ? 'Activée' : 'Désactivée'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Stade temporaire créé avec des géométries Three.js
// Remplacez par votre fichier GLB quand vous en aurez un optimisé 