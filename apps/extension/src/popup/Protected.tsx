import { Navigate } from 'react-router-dom'
import React from 'react'
import { useWallet } from '@/store'

interface ProtectedProps {
  children: React.ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
  // const auth = UserAuth()
  const { wallets } = useWallet()

  // if (!auth?.user) {
  //   return <Navigate to="/" />
  // }

  if (wallets.length == 0) {
    chrome.runtime.openOptionsPage()

    // Todo: Close the current ses

    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export default Protected
