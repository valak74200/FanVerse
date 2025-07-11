import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserAvatar {
  id: string
  name: string
  team: 'PSG' | 'BARCA' | 'NEUTRAL'
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  accessories: string[]
  position: [number, number, number]
  animation: 'idle' | 'cheer' | 'wave' | 'jump' | 'dance'
}

export interface UserProfile {
  id: string
  username: string
  walletAddress?: string
  avatar: UserAvatar
  preferences: {
    cameraMode: 'auto' | 'manual'
    soundEnabled: boolean
    hapticFeedback: boolean
    autoReactions: boolean
    preferredView: string
  }
  stats: {
    totalReactions: number
    favoriteEmotion: string
    timeSpent: number
    matchesAttended: number
  }
  achievements: string[]
  isVip: boolean
  isOnline: boolean
}

export interface UserState {
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  onlineUsers: UserProfile[]
  friends: UserProfile[]
  notifications: Array<{
    id: string
    type: 'friend_request' | 'achievement' | 'match_start' | 'emotion_milestone'
    message: string
    timestamp: number
    read: boolean
  }>
}

const defaultAvatar: UserAvatar = {
  id: 'default',
  name: 'Fan',
  team: 'NEUTRAL',
  colors: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#ffffff',
  },
  accessories: [],
  position: [0, 0, 0],
  animation: 'idle',
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  onlineUsers: [],
  friends: [],
  notifications: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    
    logout: (state) => {
      state.profile = null
      state.isAuthenticated = false
      state.error = null
      state.onlineUsers = []
      state.friends = []
      state.notifications = []
    },
    
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    
    updateAvatar: (state, action: PayloadAction<Partial<UserAvatar>>) => {
      if (state.profile) {
        state.profile.avatar = { ...state.profile.avatar, ...action.payload }
      }
    },
    
    updatePreferences: (state, action: PayloadAction<Partial<UserProfile['preferences']>>) => {
      if (state.profile) {
        state.profile.preferences = { ...state.profile.preferences, ...action.payload }
      }
    },
    
    incrementReactionCount: (state) => {
      if (state.profile) {
        state.profile.stats.totalReactions += 1
      }
    },
    
    updateFavoriteEmotion: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.stats.favoriteEmotion = action.payload
      }
    },
    
    addAchievement: (state, action: PayloadAction<string>) => {
      if (state.profile && !state.profile.achievements.includes(action.payload)) {
        state.profile.achievements.push(action.payload)
      }
    },
    
    updateOnlineUsers: (state, action: PayloadAction<UserProfile[]>) => {
      state.onlineUsers = action.payload
    },
    
    addNotification: (state, action: PayloadAction<Omit<UserState['notifications'][0], 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.notifications.unshift(notification)
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    connectWallet: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.walletAddress = action.payload
      }
    },
    
    disconnectWallet: (state) => {
      if (state.profile) {
        state.profile.walletAddress = undefined
      }
    },
  },
})

export const {
  setLoading,
  setError,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  updateAvatar,
  updatePreferences,
  incrementReactionCount,
  updateFavoriteEmotion,
  addAchievement,
  updateOnlineUsers,
  addNotification,
  markNotificationRead,
  clearNotifications,
  connectWallet,
  disconnectWallet,
} = userSlice.actions

export default userSlice.reducer