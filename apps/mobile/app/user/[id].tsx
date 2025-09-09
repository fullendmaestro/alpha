import { UserDetailScreen } from '@hoova/core/features/user/detail-screen'
import { Stack } from 'expo-router'
import { useParams } from 'solito/navigation'

export default function Screen() {
  const { id } = useParams()
  return (
    <>
      <Stack.Screen
        options={{
          title: 'User',
          presentation: 'modal',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <UserDetailScreen id={id as string} />
    </>
  )
}
