import { useRef, useEffect } from 'react'
import { Message } from '@langchain/langgraph-sdk'
import { AssistantMessage, AssistantMessageLoading } from '@/components/thread/messages/ai'
import { HumanMessage } from '@/components/thread/messages/human'
import { DO_NOT_RENDER_ID_PREFIX } from '@/lib/ensure-tool-responses'
import { useStreamContext } from '@/providers/Stream'
import { Checkpoint } from '@langchain/langgraph-sdk'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  handleRegenerate: (parentCheckpoint: Checkpoint | null | undefined) => void
  firstTokenReceived: boolean
}

export function MessageList({
  messages,
  isLoading,
  handleRegenerate,
  firstTokenReceived,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const stream = useStreamContext()
  const hasNoAIOrToolMessages = !messages.find((m) => m.type === 'ai' || m.type === 'tool')

  // Auto-scroll to bottom when messages change or when streaming
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isLoading])

  return (
    <div className="flex-1 flex flex-col gap-3 px-3 py-2 overflow-y-auto hide-scrollbar">
      {messages
        .filter((m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX))
        .map((message, index) =>
          message.type === 'human' ? (
            <HumanMessage
              key={message.id || `${message.type}-${index}`}
              message={message}
              isLoading={isLoading}
            />
          ) : (
            <AssistantMessage
              key={message.id || `${message.type}-${index}`}
              message={message}
              isLoading={isLoading}
              handleRegenerate={handleRegenerate}
            />
          )
        )}
      {/* Special rendering case where there are no AI/tool messages, but there is an interrupt.
            We need to render it outside of the messages list, since there are no messages to render */}
      {hasNoAIOrToolMessages && !!stream.interrupt && (
        <AssistantMessage
          key="interrupt-msg"
          message={undefined}
          isLoading={isLoading}
          handleRegenerate={handleRegenerate}
        />
      )}
      {isLoading && !firstTokenReceived && <AssistantMessageLoading />}
      <div ref={messagesEndRef} />
    </div>
  )
}
