import { useColorScheme } from 'react-native'
import {
  CustomToast,
  TamaguiProvider,
  type TamaguiProviderProps,
  ToastProvider,
  config,
  isWeb,
} from '@hoova/ui'
import { StoreProvider } from '@hoova/core/store'
import { ToastViewport } from './ToastViewport'

export function Provider({
  children,
  defaultTheme = 'dark',
  ...rest
}: Omit<TamaguiProviderProps, 'config'> & { defaultTheme?: string }) {
  const colorScheme = useColorScheme()
  const theme = defaultTheme || (colorScheme === 'dark' ? 'dark' : 'light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme} {...rest}>
      <StoreProvider>
        <ToastProvider swipeDirection="horizontal" duration={6000} native={isWeb ? [] : ['mobile']}>
          {children}
          <CustomToast />
          <ToastViewport />
        </ToastProvider>
      </StoreProvider>
    </TamaguiProvider>
  )
}
