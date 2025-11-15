import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState, FormEvent } from 'react'
import { useStreamContext } from '@/providers/Stream'
import { Checkpoint, Message } from '@langchain/langgraph-sdk'
import { ensureToolCallsHaveResponses } from '@/lib/ensure-tool-responses'
import { toast } from 'sonner'
import { useApp } from '@/store'
import { MessageList } from './MessageList'
import { MultimodalInput } from './MultimodalInput'

const Chat = () => {
  const {
    langgraphConfig: { apiUrl, assistantId, threadId },
  } = useApp()

  const [input, setInput] = useState('')
  const [firstTokenReceived, setFirstTokenReceived] = useState(false)

  const stream = useStreamContext()
  const messages = stream.messages
  const isLoading = stream.isLoading

  useEffect(() => {
    if (!stream.error) return

    try {
      const message = (stream.error as any).message
      toast.error('An error occurred. Please try again.', {
        description: (
          <p>
            <strong>Error:</strong> <code>{message}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      })
    } catch {
      // no-op
    }
  }, [stream.error])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setFirstTokenReceived(false)

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: 'human',
      content: input,
    }

    const toolMessages = ensureToolCallsHaveResponses(stream.messages)
    stream.submit(
      { messages: [...toolMessages, newHumanMessage] },
      {
        streamMode: ['values'],
        optimisticValues: (prev) => ({
          ...prev,
          messages: [...(prev.messages ?? []), ...toolMessages, newHumanMessage],
        }),
      }
    )

    setInput('')
  }

  const handleRegenerate = (parentCheckpoint: Checkpoint | null | undefined) => {
    setFirstTokenReceived(false)
    stream.submit(undefined, {
      checkpoint: parentCheckpoint,
      streamMode: ['values'],
    })
  }

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        handleRegenerate={handleRegenerate}
        firstTokenReceived={firstTokenReceived}
      />

      <MultimodalInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={() => stream.stop()}
      />
    </div>
  )
}

export default Chat
