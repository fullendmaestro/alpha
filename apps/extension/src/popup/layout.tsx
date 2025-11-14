import type { ReactNode } from 'react'
import { SparkleIcon, FileQuestionIcon } from 'lucide-react'
import type { Location } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import BottomNav from '@/components/bottom-nav'
import { isSidePanel } from '@/lib/ui'
import { GeneralHeader } from './header'
import { useAuth } from '@/hooks/useAuth'

type GlobalLayoutProps = {
  children?: ReactNode
  location?: Location
}

const dAppPages = new Set(['/sign'])

const showBottomNav = (path?: string) => {
  if (!path) {
    return false
  }

  if (
    path.includes('onboarding') ||
    path === '/' ||
    path === '/welcome' ||
    path === '/chat' ||
    path.includes('forgotPassword')
  ) {
    return false
  }

  return true
}

export const GlobalLayout = (props: GlobalLayoutProps) => {
  const isChatPage = props.location?.pathname === '/chat'

  const isBottomNavVisible = showBottomNav(props?.location?.pathname)

  const isOnboarding = false

  return (
    <div
      className={cn(
        'enclosing-panel relative m-auto flex flex-col overflow-hidden',
        isOnboarding
          ? 'h-[38.875rem] w-[28rem] bg-secondary border border-secondary-200 rounded-3xl'
          : 'panel-width bg-secondary panel-height max-panel-height rounded-2xl'
      )}
    >
      <div
        key={props.location?.pathname}
        id="popup-layout"
        className={'flex-1 panel-height overflow-auto flex flex-col hide-scrollbar'}
      >
        <GeneralHeader />

        {props.children}
      </div>
    </div>
  )
}
