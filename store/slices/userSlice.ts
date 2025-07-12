import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  id: string
  name: string
  avatar: string
  stats: {
    totalReactions: number
    favoriteEmotion: string | null
    timeSpent: number
  }
}

export interface UserState {
  profile: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  onlineUsers: UserProfile[]
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
  loading: false,
  onlineUsers: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
      state.isAuthenticated = true
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
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
    logout: (state) => {
      state.profile = null
      state.isAuthenticated = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { 
  setProfile, 
  updateProfile, 
  incrementReactionCount, 
  updateFavoriteEmotion, 
  logout, 
  setLoading 
} = userSlice.actions

export default userSlice.reducer