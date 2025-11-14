import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import AppRoutes from './Routes'

export const Popup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const hasWallets = wallets.length > 0

  useEffect(() => {
    // Only run on initial mount and when at root path
    if (location.pathname === '/') {
      if (hasWallets) {
        navigate('/', { replace: true })
      } else {
        navigate('/onboard', { replace: true })
      }
    }
  }, []) // Empty dependency array to run only once on mount

  return <AppRoutes />
}
