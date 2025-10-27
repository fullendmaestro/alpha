import { ThreadProvider } from '@/providers/Thread'
import { StreamProvider } from '@/providers/Stream'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import Chat from './Chat'

export default function ChatPage() {
  return (
    <NuqsAdapter>
      <ThreadProvider>
        <StreamProvider>
          <Chat />
        </StreamProvider>
      </ThreadProvider>
    </NuqsAdapter>
  )
}
