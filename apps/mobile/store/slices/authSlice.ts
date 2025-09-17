import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '../types'

const initialState: AuthState = {
  authenticated: false,
  authenticating: false,
  user: null,
  passwordCyoherStoreID: null,
  onBoarded: false,
  loginError: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload
      state.authenticating = false
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.authenticating = action.payload
      if (action.payload) {
        state.loginError = null
      }
    },
    setOnBoarded: (state, action: PayloadAction<boolean>) => {
      state.onBoarded = action.payload
    },
    setLoginError: (state, action: PayloadAction<string | null>) => {
      state.loginError = action.payload
      state.authenticating = false
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.authenticated = true
      state.authenticating = false
      state.loginError = null
    },
    logout: (state) => {
      state.authenticated = false
      state.authenticating = false
      state.loginError = null
    },
    resetAuth: () => initialState,
  },
})

export const {
  setAuthenticated,
  setUser,
  setAuthenticating,
  setOnBoarded,
  setLoginError,
  loginSuccess,
  logout,
  resetAuth,
} = authSlice.actions

export default authSlice.reducer
