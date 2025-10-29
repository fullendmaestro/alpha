import { useSettings } from '@/store'
import React from 'react'
import { CopyAddress } from './CopyAddress'
import { useWalletTotalBalance } from '@/hooks/useWalletBalances'

export const TotalBalance = () => {
  const { hidePortfolioBalances } = useSettings()
  const totalBalance = useWalletTotalBalance()

  const formatCurrency = (value: string) => {
    const num = parseFloat(value)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <button onClick={() => {}} className={'text-[36px] leading-[49px] font-black'}>
      <span className={hidePortfolioBalances ? 'text-muted-foreground' : ''}>
        {hidePortfolioBalances ? '••••••••' : formatCurrency(totalBalance)}
      </span>
    </button>
  )
}

const BalanceSection = () => {
  return (
    <div className="w-full py-8 px-7 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <TotalBalance />
        <CopyAddress />
      </div>
    </div>
  )
}

export default BalanceSection
