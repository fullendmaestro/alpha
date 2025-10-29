import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet, useAppDispatch } from '@/store'
import { setSelectedWallet } from '@/store/slices/walletSlice'
import { v4 as uuidv4 } from 'uuid'
import { addWallet } from '@/store/slices/walletSlice'
import { cn } from '@/lib/utils'

import BottomModal from '@/components/buttom-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, CheckCircle, Wallet as WalletIcon, Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Wallet as WalletType } from '@/store/types'
import { sliceWord } from '@/lib/ui'

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

  const handleCopyAccountId = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(accountId)
    toast.success('Account ID copied to clipboard')
  }

  const handleAddWallet = () => {
    onClose()
    navigate('/onboard')
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
          <Button className="w-full" size={'md'} onClick={handleAddWallet}>
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
                      'bg-secondary-100 hover:bg-secondary-200 rounded-xl w-full cursor-pointer transition-colors',
                      isSelected && 'ring-2 ring-primary'
                    )}
                  >
                    <div className="flex items-center px-4 py-3.5 gap-3">
                      <div className="size-10 rounded-full bg-secondary-300 flex items-center justify-center">
                        <WalletIcon size={20} className="text-foreground/70" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground text-sm">{wallet.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {wallet.accountId}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleCopyAccountId(wallet.accountId, e)}
                        className="p-2 hover:bg-secondary-300 rounded-lg transition-colors"
                      >
                        <Copy size={16} className="text-muted-foreground" />
                      </button>

                      {isSelected && (
                        <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                      )}
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
