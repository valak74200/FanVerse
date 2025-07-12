import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import stadiumReducer from './slices/stadiumSlice'
import userReducer from './slices/userSlice'
import emotionReducer from './slices/emotionSlice'

export const store = configureStore({
  reducer: {
    stadium: stadiumReducer,
    user: userReducer,
    emotion: emotionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['stadium/updateCameraPosition'],
        ignoredPaths: ['stadium.cameraPosition'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector