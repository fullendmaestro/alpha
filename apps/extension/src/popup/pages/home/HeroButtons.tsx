import { cn } from '@/lib/utils'
import { SendIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import {} from 'lucide-react'

interface ButtonItemProps extends ComponentPropsWithoutRef<'button'> {
  disabled?: boolean
  label: string
  icon: React.ElementType
}

const ButtonItem = ({ disabled, icon: Icon, label, className, ...rest }: ButtonItemProps) => {
  return (
    <div className={cn('flex flex-col text-center justify-center', disabled && 'opacity-40')}>
      <button
        {...rest}
        disabled={disabled}
        className={cn(
          'mx-auto relative size-[52px] bg-secondary-100 hover:bg-secondary-200 transition-colors rounded-full text-center cursor-pointer disabled:cursor-not-allowed flex items-center justify-center',
          className
        )}
      >
        <Icon className="size-5" weight="fill" />
      </button>

      {!!label && (
        <p className="text-sm mt-[10px] tracking-wide font-medium !leading-[22px]">{label}</p>
      )}
    </div>
  )
}

export const HeroButtons = ({ skipVote = false }: { skipVote?: boolean }) => {
  return (
    <div className="flex flex-row justify-evenly mb-8 px-7 w-full">
      {/* Send Button */}
      <ButtonItem label="Send" icon={SendIcon} onClick={() => {}} />

      <ButtonItem label="Swap" icon={SwapIcon} />

      <ButtonItem label="Stake" icon={StakeIcon} />
    </div>
  )
}
