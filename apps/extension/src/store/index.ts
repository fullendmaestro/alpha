import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// import { localStorage } from 'redux-persist-webextension-storage'

import type { RootState } from './types'

// Import slices
import appReducer from './slices/appSlice'
import settingsReducer from './slices/settingsSlice'
import walletReducer from './slices/walletSlice'

// Root persist config
const rootPersistConfig = {
  key: 'appStore',
  storage,
}

// Combine reducers (no per-slice persistReducer)
const rootReducer = combineReducers({
  app: appReducer,
  settings: settingsReducer,
  wallet: walletReducer,
})

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: true,
})

// Create persistor
export const persistor = persistStore(store)

// Export types
export type AppDispatch = typeof store.dispatch
export type { RootState }

// Export hooks for React components
export const selectAppState = (state: RootState) => state.app
export const selectSettingsState = (state: RootState) => state.settings
export const selectWalletState = (state: RootState) => state.wallet

// Export the store hooks
export * from './hooks'

export * from './slices/appSlice'
export * from './slices/settingsSlice'
