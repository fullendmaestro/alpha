import '../styles/globals.css'
import '../styles/styles_font.css'
import '../styles/styles.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import { ThreadProvider } from '@/providers/Thread'
import { StreamProvider } from '@/providers/Stream'

import { Popup } from './popup'
import StoreProvider from '@/store/StoreProvider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { queryClient } from '@/components/providers/query-client'
import { persistor } from '@/store'

const root = createRoot(document.querySelector('#root')!)

root.render(
  <React.StrictMode>
    <StoreProvider>
      <PersistGate
        loading={
          <div className="h-screen w-screen flex items-center justify-center bg-background">
            <div className="text-foreground">Loading...</div>
          </div>
        }
        persistor={persistor}
      >
        <ThreadProvider>
          <StreamProvider>
            <MemoryRouter>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                  <Popup />
                </ThemeProvider>
              </QueryClientProvider>
            </MemoryRouter>
          </StreamProvider>
        </ThreadProvider>
      </PersistGate>
    </StoreProvider>
  </React.StrictMode>
)
