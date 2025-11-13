import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useStream } from '@langchain/langgraph-sdk/react'
import { type Message } from '@langchain/langgraph-sdk'
import {
  uiMessageReducer,
  type UIMessage,
  type RemoveUIMessage,
} from '@langchain/langgraph-sdk/react-ui'
import { useThreads } from './Thread'
import { toast } from 'sonner'
import { setLanggraphConfig, useApp, useAppDispatch } from '@/store'

export type StateType = { messages: Message[]; ui?: UIMessage[] }

const useTypedStream = useStream<
  StateType,
  {
    UpdateType: {
      messages?: Message[] | Message | string
      ui?: (UIMessage | RemoveUIMessage)[] | UIMessage | RemoveUIMessage
    }
    CustomEventType: UIMessage | RemoveUIMessage
  }
>

type StreamContextType = ReturnType<typeof useTypedStream>
const StreamContext = createContext<StreamContextType | undefined>(undefined)

async function sleep(ms = 4000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function checkGraphStatus(apiUrl: string, apiKey: string | null): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/info`, {
      ...(apiKey && {
        headers: {
          'X-Api-Key': apiKey,
        },
      }),
    })

    return res.ok
  } catch (e) {
    console.error(e)
    return false
  }
}

const StreamSession = ({ children }: { children: ReactNode }) => {
  const {
    langgraphConfig: { apiKey, apiUrl, assistantId, threadId },
  } = useApp()
  const dispatch = useAppDispatch()

  const { getThreads, setThreads } = useThreads()
  const streamValue = useTypedStream({
    apiUrl,
    apiKey: apiKey ?? undefined,
    assistantId,
    threadId: threadId ?? null,
    onCustomEvent: (event, options) => {
      options.mutate((prev) => {
        const ui = uiMessageReducer(prev.ui ?? [], event)
        return { ...prev, ui }
      })
    },
    onThreadId: (id) => {
      dispatch(setLanggraphConfig({ threadId: id }))

      // Refetch threads list when thread ID changes.
      // Wait for some seconds before fetching so we're able to get the new thread that was created.
      sleep().then(() => getThreads().then(setThreads).catch(console.error))
    },
  })

  useEffect(() => {
    checkGraphStatus(apiUrl, apiKey).then((ok) => {
      if (!ok) {
        toast.error('Failed to connect to LangGraph server', {
          description: () => (
            <p>
              Please ensure your graph is running at <code>{apiUrl}</code> and your API key is
              correctly set (if connecting to a deployed graph).
            </p>
          ),
          duration: 10000,
          richColors: true,
          closeButton: true,
        })
      }
    })
  }, [apiKey, apiUrl])

  return <StreamContext.Provider value={streamValue}>{children}</StreamContext.Provider>
}

// Default values for the form
const DEFAULT_API_URL = 'http://localhost:2024'
const DEFAULT_ASSISTANT_ID = 'agent'

export const StreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    langgraphConfig: { apiKey, apiUrl, assistantId, threadId },
  } = useApp()
  const dispatch = useAppDispatch()

  return <StreamSession>{children}</StreamSession>
}

// Create a custom hook to use the context
export const useStreamContext = (): StreamContextType => {
  const context = useContext(StreamContext)
  if (context === undefined) {
    throw new Error('useStreamContext must be used within a StreamProvider')
  }
  return context
}

export default StreamContext
