import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as THREE from 'three'

export interface StadiumState {
  isLoaded: boolean
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  viewMode: 'overview' | 'field' | 'stands' | 'vip' | 'aerial'
  weather: 'clear' | 'rain' | 'snow' | 'fog'
  timeOfDay: 'day' | 'night' | 'sunset'
  crowdDensity: number
  soundLevel: number
  isFullscreen: boolean
  performance: 'low' | 'medium' | 'high'
  spectatorCount: number
  activeEvents: string[]
}

const initialState: StadiumState = {
  isLoaded: false,
  cameraPosition: [0, 80, 150],
  cameraTarget: [0, 0, 0],
  viewMode: 'overview',
  weather: 'clear',
  timeOfDay: 'day',
  crowdDensity: 0.8,
  soundLevel: 0.7,
  isFullscreen: false,
  performance: 'medium',
  spectatorCount: 45000,
  activeEvents: [],
}

const stadiumSlice = createSlice({
  name: 'stadium',
  initialState,
  reducers: {
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload
    },
    updateCameraPosition: (state, action: PayloadAction<[number, number, number]>) => {
      state.cameraPosition = action.payload
    },
    updateCameraTarget: (state, action: PayloadAction<[number, number, number]>) => {
      state.cameraTarget = action.payload
    },
    setViewMode: (state, action: PayloadAction<StadiumState['viewMode']>) => {
      state.viewMode = action.payload
      // Update camera position based on view mode
      switch (action.payload) {
        case 'overview':
          state.cameraPosition = [0, 80, 150]
          state.cameraTarget = [0, 0, 0]
          break
        case 'field':
          state.cameraPosition = [0, 25, 60]
          state.cameraTarget = [0, 0, 0]
          break
        case 'stands':
          state.cameraPosition = [50, 35, 50]
          state.cameraTarget = [0, 0, 0]
          break
        case 'vip':
          state.cameraPosition = [0, 40, 80]
          state.cameraTarget = [0, 0, 0]
          break
        case 'aerial':
          state.cameraPosition = [0, 120, 0]
          state.cameraTarget = [0, 0, 0]
          break
      }
    },
    setWeather: (state, action: PayloadAction<StadiumState['weather']>) => {
      state.weather = action.payload
    },
    setTimeOfDay: (state, action: PayloadAction<StadiumState['timeOfDay']>) => {
      state.timeOfDay = action.payload
    },
    setCrowdDensity: (state, action: PayloadAction<number>) => {
      state.crowdDensity = Math.max(0, Math.min(1, action.payload))
    },
    setSoundLevel: (state, action: PayloadAction<number>) => {
      state.soundLevel = Math.max(0, Math.min(1, action.payload))
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen
    },
    setPerformance: (state, action: PayloadAction<StadiumState['performance']>) => {
      state.performance = action.payload
    },
    updateSpectatorCount: (state, action: PayloadAction<number>) => {
      state.spectatorCount = action.payload
    },
    addEvent: (state, action: PayloadAction<string>) => {
      if (!state.activeEvents.includes(action.payload)) {
        state.activeEvents.push(action.payload)
      }
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.activeEvents = state.activeEvents.filter(event => event !== action.payload)
    },
  },
})

export const {
  setLoaded,
  updateCameraPosition,
  updateCameraTarget,
  setViewMode,
  setWeather,
  setTimeOfDay,
  setCrowdDensity,
  setSoundLevel,
  toggleFullscreen,
  setPerformance,
  updateSpectatorCount,
  addEvent,
  removeEvent,
} = stadiumSlice.actions

export default stadiumSlice.reducer