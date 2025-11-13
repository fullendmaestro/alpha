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

  return (
    <div id="popup-layout" className="flex flex-col h-full w-full bg-secondary relative">
      {/* Header - but not on chat page */}
      {/* {!isChatPage && ( */}
      <div className="flex-shrink-0">
        <GeneralHeader />
      </div>
      {/* )} */}

      {/* Main content */}
      <div
        className={cn(
          'flex-1',
          isChatPage ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'
        )}
      >
        {props.children}
      </div>

      {/* Bottom navigation if needed */}
      {isBottomNavVisible && (
        <div className="flex-shrink-0">
          {/*  */}
          {/* <BottomNav /> */}
        </div>
      )}
    </div>
  )
}
