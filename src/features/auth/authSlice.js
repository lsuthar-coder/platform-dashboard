import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    email: null,
    role: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.role = action.payload.role
    },
    logout: (state) => {
      state.token = null
      state.email = null
      state.role = null
    }
  }
})

export const { setCredentials, logout } = authSlice.actions
export const selectAuth = (state) => state.auth
export default authSlice.reducer
