import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, Storage, persistReducer } from 'redux-persist'

import authReducer from '../slices/authSlice'
import { RootState } from '../types'

// Todo: Use MMKV as adapter instead
export const mobileStorageAdapter: Storage = {
  setItem: (key, value) => {
    return AsyncStorage.setItem(key, value)
  },
  getItem: (key) => {
    return AsyncStorage.getItem(key)
  },
  removeItem: (key) => {
    return AsyncStorage.removeItem(key)
  },
}

export const rootPersistConfig = {
  key: 'root',
  storage: mobileStorageAdapter,
}

const mobileReducer = combineReducers({
  auth: authReducer,
})

export const persistedReducer = persistReducer(rootPersistConfig, mobileReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type { RootState }
