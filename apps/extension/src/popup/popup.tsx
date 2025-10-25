import { useState } from 'react'
import { Button } from '@alpha/ui/components/button'

export const Popup = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>

      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  )
}
