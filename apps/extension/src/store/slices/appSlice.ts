import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AuthenticatePayload } from '../types'
import { hederaNetworks } from '@/constants/networks'

const initialState: AppState = {
  authenticated: false,
  passwordKeyContent: null,
  authenticating: false,
  onBoarded: false,
  selected_network_slug: 'hedera-testnet',
  networks: hederaNetworks,
  langgraphConfig: {
    apiUrl: 'http://localhost:2024',
    assistantId: 'agent',
    threadId: null,
    apiKey: null,
    hideToolCalls: false,
  },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<AuthenticatePayload>) => {
      state.authenticated = action.payload.authenticated
      state.authenticating = false
    },
    setPasswordKeyContent: (state, action: PayloadAction<string | null>) => {
      state.passwordKeyContent = action.payload
    },
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.authenticating = action.payload
    },
    setOnBoarded: (state, action: PayloadAction<boolean>) => {
      state.onBoarded = action.payload
    },
    setSelectedNetwork: (state, action: PayloadAction<string>) => {
      state.selected_network_slug = action.payload
    },
    setLanggraphConfig: (
      state,
      action: PayloadAction<{
        apiUrl?: string
        assistantId?: string
        threadId?: string | null
        apiKey?: string | null
        hideToolCalls?: boolean
      }>
    ) => {
      if (action.payload.apiUrl !== undefined) {
        state.langgraphConfig.apiUrl = action.payload.apiUrl
      }
      if (action.payload.assistantId !== undefined) {
        state.langgraphConfig.assistantId = action.payload.assistantId
      }
      if (action.payload.threadId !== undefined) {
        state.langgraphConfig.threadId = action.payload.threadId
      }
      if (action.payload.apiKey !== undefined) {
        state.langgraphConfig.apiKey = action.payload.apiKey
      }
      if (action.payload.hideToolCalls !== undefined) {
        state.langgraphConfig.hideToolCalls = action.payload.hideToolCalls
      }
    },
    resetApp: () => initialState,
  },
})

export const {
  setAuthenticated,
  setPasswordKeyContent,
  setAuthenticating,
  setOnBoarded,
  setSelectedNetwork,
  setLanggraphConfig,
  resetApp,
} = appSlice.actions

export default appSlice.reducer
