import type { ReactNode } from 'react'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '.'

interface StoreProviderProps {
  children: ReactNode
  loading?: ReactNode
}

/**
 * StoreProvider - Provides Redux store and persistence to the app
 *
 * This component wraps your app with both Redux Provider and PersistGate
 * to enable state management with persistence across sessions.
 *
 * @param children - The app components to wrap
 * @param loading - Optional loading component while rehydrating persisted state
 */
export function StoreProvider({ children, loading = null }: StoreProviderProps) {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={loading} persistor={persistor}> */}
      {children}
      {/* </PersistGate> */}
    </Provider>
  )
}

export default StoreProvider
