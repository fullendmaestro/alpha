import { Inter } from 'next/font/google'

import '@alpha/ui/globals.css'
import { ReactElement, ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
