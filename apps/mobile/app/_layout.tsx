import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from '@hoova/core/provider'
import { NativeToast } from '@hoova/ui/src/NativeToast'
import RequireAth from './RequireAuth'

export const unstable_settings = {
  // Ensure that reloading on `/user` keeps a back button present.
  initialRouteName: 'Home',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <Provider>
      <RequireAth>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              // headerShown: false,
              presentation: 'card',
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: 'Welcome to Hoova',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="create/index"
              options={{
                title: 'Create Wallet',
                animation: 'slide_from_right',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="import/index"
              options={{
                title: 'Import Wallet',
                animation: 'slide_from_right',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="success/index"
              options={{
                title: 'Success',
                gestureEnabled: false,
              }}
            />
          </Stack>
          <NativeToast />
        </ThemeProvider>
      </RequireAth>
    </Provider>
  )
}
