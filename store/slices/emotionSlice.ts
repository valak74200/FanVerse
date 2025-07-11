import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type EmotionType = 'rage' | 'shock' | 'love' | 'hype' | 'boring' | 'sad'

export interface EmotionData {
  type: EmotionType
  count: number
  intensity: number
  lastTriggered: number
  userTriggered: boolean
}

export interface EmotionState {
  emotions: Record<EmotionType, EmotionData>
  totalReactions: number
  userCooldown: number
  isAnimating: boolean
  activeEmotion: EmotionType | null
  emotionHistory: Array<{
    emotion: EmotionType
    timestamp: number
    userId: string
  }>
}

const initialEmotions: Record<EmotionType, EmotionData> = {
  rage: { type: 'rage', count: 0, intensity: 0, lastTriggered: 0, userTriggered: false },
  shock: { type: 'shock', count: 0, intensity: 0, lastTriggered: 0, userTriggered: false },
  love: { type: 'love', count: 0, intensity: 0, lastTriggered: 0, userTriggered: false },
  hype: { type: 'hype', count: 0, intensity: 0, lastTriggered: 0, userTriggered: false },
  boring: { type: 'boring', count: 0, intensity: 0, lastTriggered: 0, userTriggered: false },
  sad: { type: 'sad', count: 0, intensity: 0, lastTriggered: 0, userTriggered: false },
}

const initialState: EmotionState = {
  emotions: initialEmotions,
  totalReactions: 0,
  userCooldown: 0,
  isAnimating: false,
  activeEmotion: null,
  emotionHistory: [],
}

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    triggerEmotion: (state, action: PayloadAction<{ emotion: EmotionType; userId: string }>) => {
      const { emotion, userId } = action.payload
      const now = Date.now()
      
      // Check cooldown (prevent spam)
      if (now - state.userCooldown < 2000) return
      
      state.emotions[emotion].count += 1
      state.emotions[emotion].intensity = Math.min(1, state.emotions[emotion].intensity + 0.1)
      state.emotions[emotion].lastTriggered = now
      state.emotions[emotion].userTriggered = true
      
      state.totalReactions += 1
      state.userCooldown = now
      state.isAnimating = true
      state.activeEmotion = emotion
      
      // Add to history
      state.emotionHistory.unshift({
        emotion,
        timestamp: now,
        userId,
      })
      
      // Keep only last 100 reactions
      if (state.emotionHistory.length > 100) {
        state.emotionHistory = state.emotionHistory.slice(0, 100)
      }
    },
    
    updateEmotionFromServer: (state, action: PayloadAction<{ emotion: EmotionType; count: number; intensity: number }>) => {
      const { emotion, count, intensity } = action.payload
      state.emotions[emotion].count = count
      state.emotions[emotion].intensity = intensity
      state.emotions[emotion].lastTriggered = Date.now()
    },
    
    decayEmotions: (state) => {
      const now = Date.now()
      Object.keys(state.emotions).forEach((key) => {
        const emotion = key as EmotionType
        const timeSinceTriggered = now - state.emotions[emotion].lastTriggered
        
        // Decay intensity over time
        if (timeSinceTriggered > 5000) {
          state.emotions[emotion].intensity = Math.max(0, state.emotions[emotion].intensity - 0.01)
          state.emotions[emotion].userTriggered = false
        }
      })
    },
    
    setAnimating: (state, action: PayloadAction<boolean>) => {
      state.isAnimating = action.payload
    },
    
    clearActiveEmotion: (state) => {
      state.activeEmotion = null
    },
    
    resetEmotions: (state) => {
      state.emotions = initialEmotions
      state.totalReactions = 0
      state.activeEmotion = null
      state.emotionHistory = []
    },
    
    bulkUpdateEmotions: (state, action: PayloadAction<Record<EmotionType, { count: number; intensity: number }>>) => {
      Object.entries(action.payload).forEach(([emotion, data]) => {
        const emotionType = emotion as EmotionType
        state.emotions[emotionType].count = data.count
        state.emotions[emotionType].intensity = data.intensity
      })
    },
  },
})

export const {
  triggerEmotion,
  updateEmotionFromServer,
  decayEmotions,
  setAnimating,
  clearActiveEmotion,
  resetEmotions,
  bulkUpdateEmotions,
} = emotionSlice.actions

export default emotionSlice.reducer