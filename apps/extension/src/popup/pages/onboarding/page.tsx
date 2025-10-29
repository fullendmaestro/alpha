import React, { useState, useEffect } from 'react'
import { CircleQuestionMark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { WalletOnboardingWizard } from './WalletOnboardingWizard'
import { useAppSelector } from '@/store/hooks'

const WelcomePage: React.FC = () => {
  const navigate = useNavigate()
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const wallets = useAppSelector((state) => state.wallet.wallets)

  // Auto-open wizard when landing on this page with no wallets
  useEffect(() => {
    if (wallets.length === 0) {
      setIsWizardOpen(true)
    }
  }, [wallets.length])

  const handleGetStarted = () => {
    // Open the wallet onboarding wizard to start the wallet creation process
    setIsWizardOpen(true)
  }

  return (
    <div className="min-h-screen min-w-screen gradient-cosmic flex flex-col relative overflow-hidden">
      {/* Starry background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 left-1/5 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-20 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-3000"></div>
      </div>

      {/* Header */}
      <header className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-golden rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">Alpha Wallet</h1>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/learnmore')}
              variant="secondary"
              className="text-white border-white/20 hover:bg-white/10"
            >
              <CircleQuestionMark size={16} />
              Learn More
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex relative z-10 px-6 pb-6">
        {/* Left Side - Content */}
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="space-y-8">
            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-6xl font-black text-foreground tracking-tight leading-none">
                WELCOME TO
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  ALPHA
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                The World's most Powerful AI Wallet for Hedera Blockchain.
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="gradient-golden border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white font-semibold px-8 py-4 text-lg rounded-full"
              >
                GET STARTED →
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - 3D Visual */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative">
            {/* Main Character/Logo Container */}
            <div className="w-80 h-80 relative">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80"></div>
              <div className="absolute bottom-8 left-8 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-70"></div>
              <div className="absolute top-1/2 left-4 w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-60"></div>

              {/* Central Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 gradient-golden rounded-3xl flex items-center justify-center shadow-2xl border border-yellow-400/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 left-1/3 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-bounce delay-1000"></div>
              <div className="absolute -bottom-4 right-1/3 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-bounce delay-2000"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center relative z-10">
        <p className="text-sm text-muted-foreground/60">Powered by Hedera Network</p>
      </footer>

      {/* Wizard Modal */}
      <WalletOnboardingWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  )
}

export default WelcomePage
