import { useMemo } from 'react'
import { useSettings } from '@/store'
import { cn } from '@/lib/utils'
import { sliceWord } from '@/lib/ui'

type TokenCardProps = {
  readonly title: string
  readonly usdValue: string | undefined
  readonly amount: string
  readonly symbol: string
  readonly assetImg: string | undefined
  readonly onClick: () => void
  readonly balance: number
  readonly isPlaceholder?: boolean
  percentChange24?: number
  className?: string
}

export const TokenCard = ({
  title,
  usdValue,
  amount,
  symbol,
  assetImg,
  onClick,
  balance,
  isPlaceholder,
  percentChange24,
  className,
}: TokenCardProps) => {
  const { hidePortfolioBalances } = useSettings()

  const percentChangeText = useMemo(() => {
    if (!percentChange24) {
      return '-'
    }

    const formatted = percentChange24.toFixed(2)
    if (percentChange24 >= 0) {
      return `+${formatted}%`
    } else {
      return percentChange24 >= -100 ? `${formatted}%` : '-99.99%'
    }
  }, [percentChange24])

  const formatCurrency = (value: string) => {
    const num = parseFloat(value)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatTokenAmount = (value: string, decimals: number = 4) => {
    const num = parseFloat(value)
    if (isNaN(num)) return '0'
    return num.toFixed(decimals)
  }

  const formattedFiatValue = usdValue ? formatCurrency(usdValue) : '-'
  const formattedAmount = formatTokenAmount(amount)

  return (
    <div className="flex flex-col w-full rounded-2xl overflow-hidden">
      <button
        className={cn(
          'text-start bg-secondary-100 hover:bg-secondary-200 transition-colors flex items-center justify-between py-3 px-4 w-full cursor-pointer gap-3 rounded-2xl',
          className
        )}
        onClick={onClick}
      >
        <div className="relative w-[32px] h-[32px] shrink-0 flex items-center justify-center">
          <img
            className={'w-[30px] h-[30px] rounded-full object-cover'}
            src={assetImg || '/hpulse/hpulseLogo.png'}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = '/hpulse/hpulseLogo.png'
            }}
          />
        </div>

        <div className="flex flex-col justify-start mr-auto min-w-0">
          <span className="font-bold text-sm truncate max-w-32 text-foreground !leading-[22px] flex items-center gap-1">
            {sliceWord(title, 12, 0)}
          </span>

          <span className="text-muted-foreground text-xs font-medium !leading-[19px] truncate max-w-44">
            {formattedAmount} {symbol}
          </span>
        </div>

        <div className="flex flex-col items-end gap-y-[2px]">
          {isPlaceholder ? (
            <p className="font-bold text-sm text-end">-</p>
          ) : (
            <span
              className={cn(
                'font-bold text-sm !leading-[20px] text-end',
                hidePortfolioBalances && 'text-muted-foreground'
              )}
            >
              {hidePortfolioBalances ? '••••••' : formattedFiatValue}
            </span>
          )}

          {!hidePortfolioBalances && (
            <span
              className={cn(
                'text-xs font-medium items-end !leading-[19px]',
                percentChange24
                  ? percentChange24 > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                  : 'text-muted-foreground'
              )}
            >
              {percentChangeText}
            </span>
          )}
        </div>
      </button>
    </div>
  )
}
