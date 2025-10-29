import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

/**
 * Hook that checks if a wallet exists and redirects to onboarding page if not
 * @returns boolean indicating if wallet exists
 */
export function useWalletCheck() {
  const navigate = useNavigate()
  const location = useLocation()
  const wallets = useAppSelector((state) => state.wallet.wallets)

  const hasWallet = wallets.length > 0

  useEffect(() => {
    // Don't redirect if already on onboarding or welcome page
    if (location.pathname === '/onboard' || location.pathname === '/welcome') {
      return
    }

    // Redirect to onboarding if no wallet exists
    if (!hasWallet) {
      navigate('/onboard', { replace: true })
    }
  }, [hasWallet, navigate, location.pathname])

  return hasWallet
}
