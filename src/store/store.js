import { configureStore } from '@reduxjs/toolkit'
import { platformApi } from './api'
import authReducer from '../features/auth/authSlice'
import uiReducer from '../features/auth/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [platformApi.reducerPath]: platformApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(platformApi.middleware)
})
