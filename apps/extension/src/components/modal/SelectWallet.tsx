import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useWallet, useAppDispatch } from '@/store'
import { setSelectedWallet } from '@/store/slices/walletSlice'
import { v4 as uuidv4 } from 'uuid'
import { addWallet } from '@/store/slices/walletSlice'
import { cn } from '@/lib/utils'

import BottomModal from '@/components/buttom-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MoreVertical,
  Plus,
  CheckCircle,
  Wallet as WalletIcon,
  Copy,
  Trash2,
  Check,
  CopyIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Wallet as WalletType } from '@/store/types'
import { sliceWord } from '@/lib/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { opacityFadeInOut, transition150 } from '@/lib/motion-variants'

type SelectWalletProps = {
  readonly isVisible: boolean
  readonly onClose: VoidFunction
  readonly title?: string
}

const SelectWallet = ({ isVisible, onClose, title = 'Your Wallets' }: SelectWalletProps) => {
  const dispatch = useAppDispatch()
  const { wallets, selectedWalletSlug } = useWallet()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')

  // Filter wallets based on search query
  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.accountId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectWallet = (walletId: string) => {
    dispatch(setSelectedWallet(walletId))
    onClose()
    toast.success('Wallet selected')
  }

  const handleAddWallet = () => {
    onClose()

    chrome.runtime.openOptionsPage()

    // Todo: Close the current ses

    return <Navigate to="/onboarding" replace />
  }

  return (
    <>
      <BottomModal
        isOpen={isVisible}
        onClose={onClose}
        title={title}
        className="h-full mb-4"
        fullScreen
        footerComponent={
          <Button className="w-full" size={'lg'} onClick={handleAddWallet}>
            <Plus size={16} /> Add Wallet
          </Button>
        }
      >
        <div className="h-full">
          <Input
            value={searchQuery}
            autoFocus={false}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by wallet name or account ID"
            className="mb-6"
          />

          <div className="flex flex-col rounded-2xl overflow-y-auto mb-4 py-1 gap-3.5">
            {filteredWallets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No wallets found' : 'No wallets available'}
              </div>
            ) : (
              filteredWallets.map((wallet) => {
                const isSelected = selectedWalletSlug === wallet.id
                return (
                  <div
                    key={wallet.id}
                    onClick={() => handleSelectWallet(wallet.id)}
                    className={cn(
                      'flex items-center justify-between gap-3 py-3 px-4 rounded-2xl transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-accent-blue-900 border border-spacing-0.5 border-accent-blue-700'
                        : 'bg-secondary-100 hover:bg-secondary-200'
                    )}
                  >
                    <div className="size-9 rounded-full bg-secondary-300 flex items-center justify-center">
                      <WalletIcon size={20} className="text-foreground/70" />
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2 whitespace-nowrap text-sm font-bold">
                          {wallet.name}
                        </div>

                        <span className="text-xs text-muted-foreground max-w-56 whitespace-nowrap w-full flex items-center gap-1">
                          <AccountLabel accountId={wallet.accountId} />
                        </span>
                      </div>

                      <button
                        className="size-7 cursor-pointer justify-center text-monochrome/60 hover:text-monochrome grid place-content-center"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </BottomModal>
    </>
  )
}

export default SelectWallet

const AccountLabel = ({ accountId }: { accountId: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyAccountId = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(accountId)
    toast.success('Account ID copied to clipboard')
  }

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 2_000)
    }
  }, [isCopied])

  return (
    <button
      className="text-xs text-muted-foreground truncate max-w-56 hover:text-accent-blue"
      onClick={(e) => {
        handleCopyAccountId(accountId, e)
        setIsCopied(true)
      }}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.span
            key="copied"
            transition={transition150}
            variants={opacityFadeInOut}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex items-center gap-1"
          >
            Copied
            <Check className="size-3" />
          </motion.span>
        ) : (
          <motion.span
            key="address"
            transition={transition150}
            variants={opacityFadeInOut}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex items-center gap-1 group"
          >
            {accountId}
            <CopyIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
