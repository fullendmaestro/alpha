import { useWalletCheck } from '@/hooks/useWalletCheck'
import { useFetchWalletBalances } from '@/hooks/useFetchWalletBalances'
import BalanceSection from './BalanceSection'
import TokensSection from './TokensSection'
import { HeroButtons } from './HeroButtons'

export default function Home() {
  const hasWallet = useWalletCheck()

  // Fetch wallet balances automatically
  useFetchWalletBalances()

  if (!hasWallet) {
    return null // Will redirect to onboarding page
  }

  return (
    <div className="flex flex-col h-full p-4">
      <BalanceSection />
      {/* <HeroButtons /> */}
      <TokensSection />
    </div>
  )
}
