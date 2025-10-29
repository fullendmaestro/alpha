import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { sliceWord } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { useWalletAccountId } from '@/hooks/useWalletBalances'

export const CopyAddress = () => {
  const [isWalletAddressCopied, setIsWalletAddressCopied] = useState(false)
  const accountId = useWalletAccountId()

  const handleCopyAddress = () => {
    if (!accountId) return

    navigator.clipboard.writeText(accountId)
    setIsWalletAddressCopied(true)
    toast.success('Account ID copied to clipboard')

    setTimeout(() => setIsWalletAddressCopied(false), 2000)
  }

  if (!accountId) {
    return null
  }

  return (
    <button
      onClick={handleCopyAddress}
      className={cn(
        'text-xs !leading-[16px] font-medium text-muted-foreground flex items-center gap-x-[6px] border border-secondary-200 py-[5px] pl-4 pr-3 rounded-full transition-colors relative font-mono',
        isWalletAddressCopied
          ? 'text-primary outline outline-primary bg-primary/10 justify-center'
          : 'bg-secondary-100 hover:bg-secondary-200'
      )}
    >
      {isWalletAddressCopied ? 'Copied!' : accountId}

      {isWalletAddressCopied ? (
        <Check className="size-4" />
      ) : (
        <Copy className="text-secondary-600 size-4" />
      )}
    </button>
  )
}
