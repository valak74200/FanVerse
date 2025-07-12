"use client"

import { useEffect, useRef, useState } from "react"
import { motion, PanInfo } from "framer-motion"

interface MobileGesturesProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onDoubleTap?: () => void
  children: React.ReactNode
}

export default function MobileGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onDoubleTap,
  children
}: MobileGesturesProps) {
  const [lastTap, setLastTap] = useState(0)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [initialDistance, setInitialDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePanEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeThreshold = 50
    const velocityThreshold = 500

    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
      if (offset.x > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    }

    if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > velocityThreshold) {
      if (offset.y > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      setInitialDistance(distance)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && initialDistance > 0) {
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const scale = currentDistance / initialDistance
      onPinch?.(scale)
    }
  }

  const handleTouchEnd = () => {
    setInitialDistance(0)
  }

  const handleTap = () => {
    const now = Date.now()
    const timeDiff = now - lastTap
    
    if (timeDiff < 300 && timeDiff > 0) {
      onDoubleTap?.()
    }
    
    setLastTap(now)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [initialDistance])

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full"
      onPanEnd={handlePanEnd}
      onTap={handleTap}
      drag={false}
      style={{ touchAction: 'none' }}
    >
      {children}
    </motion.div>
  )
}

// Hook pour détecter si on est sur mobile
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Hook pour les vibrations tactiles
export const useHapticFeedback = () => {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  const lightVibration = () => vibrate(10)
  const mediumVibration = () => vibrate(50)
  const heavyVibration = () => vibrate(100)
  const successVibration = () => vibrate([50, 50, 50])
  const errorVibration = () => vibrate([100, 50, 100])

  return {
    vibrate,
    lightVibration,
    mediumVibration,
    heavyVibration,
    successVibration,
    errorVibration,
  }
} 