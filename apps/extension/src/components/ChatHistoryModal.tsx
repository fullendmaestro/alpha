import { History, Plus, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BottomModal from '@/components/buttom-modal'
import { Thread } from '@langchain/langgraph-sdk'
import { getContentString } from './thread/utils'
import { useThreads } from '@/providers/Thread'
import { useEffect } from 'react'
import { setLanggraphConfig, useApp, useAppDispatch } from '@/store'

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
    >
      <>
        {/* New Chat Button */}
        <div className="h-full flex flex-col w-full gap-2 items-start justify-start overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
          <Button
            onClick={() => dispatch(setLanggraphConfig({ threadId: null }))}
            className="w-full flex items-center gap-2 justify-center mb-4"
            variant="default"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
          {threads.map((t) => {
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
            return (
              <div key={t.thread_id} className="w-full px-1">
                <Button
                  variant="ghost"
                  className="text-left items-start justify-start font-normal w-[280px]"
                  onClick={(e) => {
                    e.preventDefault()

                    if (t.thread_id === threadId) {
                      onClose()
                      return
                    }
                    console.log('selected thread', t.thread_id)
                    dispatch(setLanggraphConfig({ threadId: t.thread_id }))
                    onClose()
                  }}
                >
                  <p className="truncate text-ellipsis">{itemText}</p>
                </Button>
              </div>
            )
          })}
        </div>
      </>
    </BottomModal>
  )
}
