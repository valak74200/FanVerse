"use client"

import { useEffect, useRef, useCallback } from "react"

interface SoundEffectsProps {
  enabled?: boolean
}

export default function SoundEffects({ enabled = true }: SoundEffectsProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Initialiser l'AudioContext
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.connect(audioContextRef.current.destination)
      gainNodeRef.current.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    } catch (error) {
      console.warn("Audio context not supported", error)
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [enabled])

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!enabled || !audioContextRef.current || !gainNodeRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const envelope = audioContextRef.current.createGain()
    
    oscillator.connect(envelope)
    envelope.connect(gainNodeRef.current)
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = type
    
    // Envelope ADSR
    envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    envelope.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.1, audioContextRef.current.currentTime + duration * 0.3)
    envelope.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)
    
    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }, [enabled])

  const playClick = useCallback(() => {
    playTone(800, 0.1, 'square')
  }, [playTone])

  const playHover = useCallback(() => {
    playTone(600, 0.05, 'sine')
  }, [playTone])

  const playSuccess = useCallback(() => {
    playTone(523, 0.1, 'sine') // C5
    setTimeout(() => playTone(659, 0.1, 'sine'), 100) // E5
    setTimeout(() => playTone(784, 0.2, 'sine'), 200) // G5
  }, [playTone])

  const playError = useCallback(() => {
    playTone(200, 0.3, 'sawtooth')
  }, [playTone])

  const playNotification = useCallback(() => {
    playTone(440, 0.1, 'sine') // A4
    setTimeout(() => playTone(554, 0.1, 'sine'), 100) // C#5
    setTimeout(() => playTone(659, 0.15, 'sine'), 200) // E5
  }, [playTone])

  const playCheer = useCallback(() => {
    // Séquence de tons pour simuler des acclamations
    const frequencies = [523, 659, 784, 1047, 1319] // C5, E5, G5, C6, E6
    frequencies.forEach((freq, index) => {
      setTimeout(() => playTone(freq, 0.2, 'sine'), index * 50)
    })
  }, [playTone])

  const playGoal = useCallback(() => {
    // Mélodie de but spectaculaire
    const melody = [
      { freq: 523, duration: 0.15, delay: 0 },    // C5
      { freq: 659, duration: 0.15, delay: 150 },  // E5
      { freq: 784, duration: 0.15, delay: 300 },  // G5
      { freq: 1047, duration: 0.3, delay: 450 },  // C6
      { freq: 1319, duration: 0.5, delay: 750 },  // E6
    ]
    
    melody.forEach(({ freq, duration, delay }) => {
      setTimeout(() => playTone(freq, duration, 'sine'), delay)
    })
  }, [playTone])

  // Exposer les fonctions sonores globalement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).fanverseSounds = {
        click: playClick,
        hover: playHover,
        success: playSuccess,
        error: playError,
        notification: playNotification,
        cheer: playCheer,
        goal: playGoal,
      }
    }
  }, [playClick, playHover, playSuccess, playError, playNotification, playCheer, playGoal])

  return null // Ce composant ne rend rien visuellement
}

// Hook personnalisé pour utiliser les sons
export const useSoundEffects = () => {
  const playClick = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).fanverseSounds) {
      (window as any).fanverseSounds.click()
    }
  }, [])

  const playHover = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).fanverseSounds) {
      (window as any).fanverseSounds.hover()
    }
  }, [])

  const playSuccess = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).fanverseSounds) {
      (window as any).fanverseSounds.success()
    }
  }, [])

  const playError = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).fanverseSounds) {
      (window as any).fanverseSounds.error()
    }
  }, [])

  const playNotification = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).fanverseSounds) {
      (window as any).fanverseSounds.notification()
    }
  }, [])

  const playCheer = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).fanverseSounds) {
      (window as any).fanverseSounds.cheer()
    }
  }, [])

  const playGoal = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).fanverseSounds) {
      (window as any).fanverseSounds.goal()
    }
  }, [])

  return {
    playClick,
    playHover,
    playSuccess,
    playError,
    playNotification,
    playCheer,
    playGoal,
  }
} 