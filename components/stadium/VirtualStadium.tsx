"use client"

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Stats } from '@react-three/drei'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { setLoaded, updateCameraPosition } from '@/store/slices/stadiumSlice'
import { StadiumStructure } from './StadiumStructure'
import { CrowdSystem } from './CrowdSystem'
import { EmotionEffects } from './EmotionEffects'
import { WeatherSystem } from './WeatherSystem'
import { LoadingScreen } from './LoadingScreen'
import { CameraController } from './CameraController'
import { UserAvatars } from './UserAvatars'
import { Field } from './Field'
import { Stands } from './Stands'
import * as THREE from 'three'

interface VirtualStadiumProps {
  className?: string
}

export function VirtualStadium({ className }: VirtualStadiumProps) {
  const canvasRef = useRef(null)
  const dispatch = useAppDispatch()
  
  const {
    isLoaded,
    cameraPosition,
    cameraTarget,
    viewMode,
    weather,
    timeOfDay,
    crowdDensity,
    performance,
    isFullscreen,
  } = useAppSelector(state => state.stadium)
  
  const { activeEmotion, isAnimating } = useAppSelector(state => state.emotion)
  const { onlineUsers } = useAppSelector(state => state.user)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      dispatch(setLoaded(true))
    }, 2000)

    return () => clearTimeout(timer)
  }, [dispatch])

  const handleCameraChange = (position: THREE.Vector3) => {
    dispatch(updateCameraPosition([position.x, position.y, position.z]))
  }

  // Performance settings based on user preference
  const getPerformanceSettings = () => {
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    
    switch (performance) {
      case 'low':
        return {
          shadows: false,
          antialias: false,
          pixelRatio: Math.min(devicePixelRatio, 1),
          powerPreference: 'low-power' as const,
        }
      case 'medium':
        return {
          shadows: true,
          antialias: true,
          pixelRatio: Math.min(devicePixelRatio, 1.5),
          powerPreference: 'default' as const,
        }
      case 'high':
        return {
          shadows: true,
          antialias: true,
          pixelRatio: Math.min(devicePixelRatio, 2),
          powerPreference: 'high-performance' as const,
        }
      default:
        return {
          shadows: true,
          antialias: true,
          pixelRatio: Math.min(devicePixelRatio, 1.5),
          powerPreference: 'default' as const,
        }
    }
  }

  const performanceSettings = getPerformanceSettings()

  if (!isLoaded) {
    return <LoadingScreen />
  }

  return (
    <div 
      className={`relative w-full h-full ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}
      role="application"
      aria-label="Virtual Stadium Experience"
    >
      <Canvas
        ref={canvasRef}
        shadows={performanceSettings.shadows}
        gl={{
          antialias: performanceSettings.antialias,
          alpha: false,
          powerPreference: performanceSettings.powerPreference,
        }}
        dpr={performanceSettings.pixelRatio}
        camera={{
          fov: 60,
          near: 0.1,
          far: 2000,
          position: cameraPosition,
        }}
        onCreated={({ gl, scene, camera }) => {
          // Optimize renderer settings
          gl.shadowMap.enabled = performanceSettings.shadows
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
          
          // Set background color
          scene.background = new THREE.Color(0x000011)
          
          // Add fog for atmosphere
          scene.fog = new THREE.Fog(0x000011, 100, 800)
        }}
      >
        {/* Camera Controller */}
        <CameraController
          position={cameraPosition}
          target={cameraTarget}
          viewMode={viewMode}
          onPositionChange={handleCameraChange}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={0}
          enableDamping={true}
          dampingFactor={0.08}
          maxDistance={250}
          minDistance={30}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 12}
          target={cameraTarget}
          zoomSpeed={0.2}
          rotateSpeed={0.3}
          panSpeed={0.4}

        />

        {/* Lighting System */}
        <ambientLight intensity={timeOfDay === 'night' ? 0.3 : 0.6} />
        <directionalLight
          position={[100, 100, 50] as any}
          intensity={timeOfDay === 'night' ? 0.8 : 1.2}
          castShadow={false}
        />

        {/* Stadium floodlights for night mode - REDUCED */}
        {timeOfDay === 'night' && performance === 'high' && (
          <>
            <pointLight position={[0, 30, 0] as any} intensity={1.5} distance={80} />
            <pointLight position={[40, 25, 0] as any} intensity={1} distance={60} />
            <pointLight position={[-40, 25, 0] as any} intensity={1} distance={60} />
          </>
        )}

        <Suspense fallback={null}>
          {/* Terrain de football réaliste */}
          <Field />

          {/* Tribunes modernes */}
          <Stands />

          {/* Main Stadium Structure */}
          <StadiumStructure 
            timeOfDay={timeOfDay}
            performance={performance}
          />

          {/* Crowd System with Emotion Reactions */}
          <CrowdSystem
            density={crowdDensity}
            activeEmotion={activeEmotion}
            isAnimating={isAnimating}
            performance={performance}
          />

          {/* User Avatars */}
          <UserAvatars users={onlineUsers} />

          {/* Emotion Visual Effects */}
          <EmotionEffects
            activeEmotion={activeEmotion}
            isAnimating={isAnimating}
          />

          {/* Weather System */}
          <WeatherSystem weather={weather} />

          {/* Environment */}
          <Environment 
            preset={timeOfDay === 'night' ? 'night' : timeOfDay === 'sunset' ? 'sunset' : 'dawn'} 
          />
        </Suspense>

        {/* Performance Stats (only in development) */}
        {process.env.NODE_ENV === 'development' && <Stats />}
      </Canvas>

      {/* Accessibility: Screen reader description */}
      <div className="sr-only">
        Virtual stadium with {onlineUsers.length} online users. 
        Current view: {viewMode}. 
        Weather: {weather}. 
        Time: {timeOfDay}.
        {activeEmotion && `Active emotion: ${activeEmotion}`}
      </div>
    </div>
  )
}