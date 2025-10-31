import { useEffect, useState } from 'react'

export const CopyLabel = ({ address }: { address: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 2_000)
    }
  }, [isCopied])

  return (
    <button className="text-xs text-muted-foreground truncate max-w-56 hover:text-accent-blue">
      {/* cp */}
    </button>
  )
}
