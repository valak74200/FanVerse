import { configureStore } from '@reduxjs/toolkit'
import emotionSlice from './slices/emotionSlice'
import userSlice from './slices/userSlice'
import stadiumSlice from './slices/stadiumSlice'

export const store = configureStore({
  reducer: {
    emotion: emotionSlice,
    user: userSlice,
    stadium: stadiumSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch