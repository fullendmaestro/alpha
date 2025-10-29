import { v4 as uuidv4 } from 'uuid'
import { useEffect, useRef } from 'react'
import { useStreamContext } from '@/providers/Stream'
import { useState, FormEvent } from 'react'
import { Checkpoint, Message } from '@langchain/langgraph-sdk'
import { DO_NOT_RENDER_ID_PREFIX, ensureToolCallsHaveResponses } from '@/lib/ensure-tool-responses'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ArrowUp, StopCircle, Paperclip } from 'lucide-react'
import { AssistantMessage, AssistantMessageLoading } from '@/components/thread/messages/ai'
import { HumanMessage } from '@/components/thread/messages/human'
import { useApp } from '@/store'

const Chat = () => {
  const {
    langgraphConfig: { apiUrl, assistantId, threadId },
  } = useApp()

  const [input, setInput] = useState('')
  const [firstTokenReceived, setFirstTokenReceived] = useState(false)

  const stream = useStreamContext()
  const messages = stream.messages
  const isLoading = stream.isLoading

  // const lastError = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!stream.error) {
      // lastError.current = undefined
      return
    }
    try {
      const message = (stream.error as any).message
      // if (!message || lastError.current === message) {
      //   // Message has already been logged. do not modify ref, return early.
      //   return
      // }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      // lastError.current = message
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

  // TODO: this should be part of the useStream hook
  // const prevMessageLength = useRef(0)
  useEffect(() => {
    // if (
    //   messages.length !== prevMessageLength.current &&
    //   messages?.length &&
    //   messages[messages.length - 1].type === 'ai'
    // ) {
    //   setFirstTokenReceived(true)
    // }
    // prevMessageLength.current = messages.length
  }, [messages])

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
    // Do this so the loading state is correct
    // prevMessageLength.current = prevMessageLength.current - 1
    setFirstTokenReceived(false)
    stream.submit(undefined, {
      checkpoint: parentCheckpoint,
      streamMode: ['values'],
    })
  }

  const chatStarted = !!threadId || !!messages.length
  const hasNoAIOrToolMessages = !messages.find((m) => m.type === 'ai' || m.type === 'tool')

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col gap-3 px-4 py-2 overflow-y-auto">
        <>
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
        </>

        {/* <ChatMessages messages={messages} />
        {isSendingMessage && <TypingIndicator />} */}
      </div>
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border">
        <div className="bg-muted rounded-2xl border shadow-xs mx-auto mb-1 w-full max-w-3xl relative z-10">
          <form
            onSubmit={handleSubmit}
            className="grid grid-rows-[1fr_auto] gap-2 max-w-3xl mx-auto"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  const el = e.target as HTMLElement | undefined
                  const form = el?.closest('form')
                  form?.requestSubmit()
                }
              }}
              placeholder="Type your message..."
              className="p-3.5 pb-0 border-none bg-transparent field-sizing-content shadow-none ring-0 outline-none focus:outline-none focus:ring-0 resize-none"
            />

            <div className="flex items-center justify-between p-2 pt-4">
              <div className="flex items-center gap-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Paperclip className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    // onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {stream.isLoading ? (
                <Button key="stop" onClick={() => stream.stop()}>
                  <StopCircle />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="transition-all shadow-md"
                  disabled={isLoading || !input.trim()}
                >
                  <ArrowUp />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
