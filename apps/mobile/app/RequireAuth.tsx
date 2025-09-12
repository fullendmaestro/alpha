import { ReactNode, useEffect } from 'react'
import { useRouter } from 'solito/navigation'
import { useAuth } from '@hoova/core/store'

export default function RequireAth({ children }) {
  const { authenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authenticated) {
      router.push('/onboarding')
    }
  }, [authenticated, router])

  // if (!authenticated) {
  //   return null
  // }

  return <>{children}</>
}
