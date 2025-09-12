import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
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
  )
}
