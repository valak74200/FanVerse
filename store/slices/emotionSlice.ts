import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EmotionState {
  userTriggered: boolean
  count: number
  intensity: number
}

export interface EmotionData {
  hype: EmotionState
  joy: EmotionState
  anger: EmotionState
  sadness: EmotionState
  surprise: EmotionState
  fear: EmotionState
}

export interface EmotionSliceState {
  emotions: EmotionData
  totalReactions: number
  userCooldown: number
  isAnimating: boolean
  activeEmotion: keyof EmotionData | null
}

const initialState: EmotionSliceState = {
  emotions: {
    hype: { userTriggered: false, count: 0, intensity: 0 },
    joy: { userTriggered: false, count: 0, intensity: 0 },
    anger: { userTriggered: false, count: 0, intensity: 0 },
    sadness: { userTriggered: false, count: 0, intensity: 0 },
    surprise: { userTriggered: false, count: 0, intensity: 0 },
    fear: { userTriggered: false, count: 0, intensity: 0 },
  },
  totalReactions: 0,
  userCooldown: 0,
  isAnimating: false,
  activeEmotion: null,
}

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    triggerEmotion: (state, action: PayloadAction<{ emotion: keyof EmotionData; userId: string }>) => {
      const { emotion } = action.payload
      state.emotions[emotion].count += 1
      state.emotions[emotion].userTriggered = true
      state.emotions[emotion].intensity = Math.min(state.emotions[emotion].intensity + 0.1, 1)
      state.totalReactions += 1
      state.userCooldown = Date.now()
      state.isAnimating = true
    },
    resetUserTrigger: (state, action: PayloadAction<keyof EmotionData>) => {
      state.emotions[action.payload].userTriggered = false
    },
    updateIntensity: (state, action: PayloadAction<{ emotion: keyof EmotionData; intensity: number }>) => {
      const { emotion, intensity } = action.payload
      state.emotions[emotion].intensity = Math.max(0, Math.min(1, intensity))
    },
    stopAnimation: (state) => {
      state.isAnimating = false
    },
  },
})

export const { triggerEmotion, resetUserTrigger, updateIntensity, stopAnimation } = emotionSlice.actions
export default emotionSlice.reducer