import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/hooks/useWindowSize'

const SuccessStep: React.FC = () => {
  const navigate = useNavigate()
  const { width, height } = useWindowSize()

  useEffect(() => {
    // Auto-navigate after 3 seconds
    const timer = setTimeout(() => {
      navigate('/home')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex flex-col h-full p-6 relative">
      {/* Confetti */}
      <Confetti
        width={width || 400}
        height={height || 600}
        recycle={false}
        numberOfPieces={300}
        gravity={0.3}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-green-500/30 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">Success!</h2>
          <p className="text-lg text-muted-foreground max-w-sm">
            Your wallet has been successfully imported and is ready to use.
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="pt-4 border-t">
        <Button size={'bg'} onClick={() => navigate('/home')} className="w-full gradient-golden">
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default SuccessStep
