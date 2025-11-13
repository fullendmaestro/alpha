import { History, Plus, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BottomModal from '@/components/buttom-modal'
import { Thread } from '@langchain/langgraph-sdk'
import { getContentString } from './thread/utils'
import { useThreads } from '@/providers/Thread'
import { useEffect } from 'react'
import { setLanggraphConfig, useApp, useAppDispatch } from '@/store'
import { cn } from '@/lib/utils'

export function ChatHistoryModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean
  onClose: () => void
}) {
  const {
    langgraphConfig: { threadId },
  } = useApp()

  const dispatch = useAppDispatch()

  const { getThreads, threads, setThreads, threadsLoading, setThreadsLoading } = useThreads()

  useEffect(() => {
    console.log('threads', threads)
    if (typeof window === 'undefined') return
    setThreadsLoading(true)
    getThreads()
      .then(setThreads)
      .catch(console.error)
      .finally(() => setThreadsLoading(false))
  }, [])

  return (
    <BottomModal
      isOpen={isVisible}
      onClose={onClose}
      fullScreen
      title="Chat History"
      className="h-full"
      footerComponent={
        <Button
          onClick={async () => {
            dispatch(setLanggraphConfig({ threadId: null }))
            onClose()
          }}
          className="w-full"
          size="lg"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      }
    >
      <>
        {/* Thread List */}
        <div className="h-full flex flex-col w-full gap-3 items-start justify-start overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {threadsLoading ? (
            <div className="text-center py-8 text-muted-foreground w-full">Loading...</div>
          ) : threads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground w-full">No chat history</div>
          ) : (
            threads.map((t) => {
              let itemText = t.thread_id
              if (
                typeof t.values === 'object' &&
                t.values &&
                'messages' in t.values &&
                Array.isArray(t.values.messages) &&
                t.values.messages?.length > 0
              ) {
                const firstMessage = t.values.messages[0]
                itemText = getContentString(firstMessage.content)
              }

              const isSelected = t.thread_id === threadId

              return (
                <div
                  key={t.thread_id}
                  onClick={() => {
                    if (t.thread_id === threadId) {
                      onClose()
                      return
                    }
                    console.log('selected thread', t.thread_id)
                    dispatch(setLanggraphConfig({ threadId: t.thread_id }))
                    onClose()
                  }}
                  className={cn(
                    'flex items-center justify-between gap-3 py-3 px-4 rounded-2xl transition-colors cursor-pointer w-full',
                    isSelected
                      ? 'bg-accent-blue-900 border border-spacing-0.5 border-accent-blue-700'
                      : 'bg-secondary-100 hover:bg-secondary-200'
                  )}
                >
                  <div className="size-9 rounded-full bg-secondary-300 flex items-center justify-center flex-shrink-0">
                    <History size={20} className="text-foreground/70" />
                  </div>
                  <div className="flex items-center gap-3 w-full min-w-0">
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{itemText}</p>
                      <span className="text-xs text-muted-foreground truncate">
                        {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      className="size-7 cursor-pointer justify-center text-monochrome/60 hover:text-monochrome grid place-content-center flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        // More options would go here
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </>
    </BottomModal>
  )
}
