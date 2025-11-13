import { AIMessage, ToolMessage } from '@langchain/langgraph-sdk'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Wrench,
  Info,
  Loader2,
  CheckCircle2,
  Coins,
  Send,
  FileText,
  MessageSquare,
  Users,
  CreditCard,
  ArrowRightLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import BottomModal from '@/components/buttom-modal'

// Define tool call type
type ToolCall = {
  name: string
  args: { [x: string]: any }
  id?: string
  type?: 'tool_call'
}

function isComplexValue(value: any): boolean {
  return Array.isArray(value) || (typeof value === 'object' && value !== null)
}

// Map tool names to icons
function getToolIcon(toolName: string) {
  const name = toolName.toLowerCase()

  if (name.includes('token') || name.includes('fungible') || name.includes('nft')) {
    return Coins
  }
  if (name.includes('transfer') || name.includes('hbar')) {
    return Send
  }
  if (name.includes('topic') || name.includes('message')) {
    return MessageSquare
  }
  if (name.includes('airdrop')) {
    return Users
  }
  if (name.includes('balance') || name.includes('query') || name.includes('account')) {
    return CreditCard
  }
  if (name.includes('mint')) {
    return Coins
  }
  if (name.includes('submit')) {
    return FileText
  }

  return Wrench
}

// Format tool name for display
function formatToolName(toolName: string): string {
  return toolName
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Get tool description based on name
function getToolDescription(toolName: string): string {
  const name = toolName.toLowerCase()

  if (name.includes('create') && name.includes('fungible')) {
    return 'Creating a new fungible token'
  }
  if (name.includes('create') && (name.includes('nft') || name.includes('non_fungible'))) {
    return 'Creating a new NFT'
  }
  if (name.includes('transfer') && name.includes('hbar')) {
    return 'Transferring HBAR'
  }
  if (name.includes('airdrop')) {
    return 'Airdropping tokens'
  }
  if (name.includes('mint')) {
    return 'Minting tokens'
  }
  if (name.includes('balance')) {
    return 'Fetching balance'
  }
  if (name.includes('topic') && name.includes('create')) {
    return 'Creating topic'
  }
  if (name.includes('topic') && name.includes('submit')) {
    return 'Submitting message to topic'
  }
  if (name.includes('query') && name.includes('account')) {
    return 'Querying account information'
  }

  return 'Executing operation'
}

interface ToolDetailModalProps {
  isOpen: boolean
  onClose: () => void
  toolCall: ToolCall
  result?: any
}

function ToolDetailModal({ isOpen, onClose, toolCall, result }: ToolDetailModalProps) {
  const args = toolCall.args as Record<string, any>
  const hasArgs = Object.keys(args).length > 0

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      title={formatToolName(toolCall.name)}
      className="h-auto max-h-[80vh]"
    >
      <div className="space-y-4">
        {/* Tool ID */}
        {toolCall.id && (
          <div className="text-xs text-muted-foreground">
            ID: <code className="bg-secondary-100 px-2 py-1 rounded">{toolCall.id}</code>
          </div>
        )}

        {/* Input Section */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Input Parameters</h3>
          {hasArgs ? (
            <div className="space-y-2">
              {Object.entries(args).map(([key, value], idx) => (
                <div key={idx} className="bg-secondary-100 rounded-lg p-3">
                  <div className="text-xs font-medium text-foreground/70 mb-1">{key}</div>
                  <div className="text-sm">
                    {isComplexValue(value) ? (
                      <pre className="bg-secondary-200 rounded p-2 text-xs overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <code className="text-sm">{String(value)}</code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No parameters</div>
          )}
        </div>

        {/* Result Section */}
        {result && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Result</h3>
            <div className="bg-secondary-100 rounded-lg p-3">
              <pre className="text-xs overflow-x-auto">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </BottomModal>
  )
}

interface ToolCallCardProps {
  toolCall: ToolCall
  isLoading?: boolean
  result?: any
}

function ToolCallCard({ toolCall, isLoading = false, result }: ToolCallCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const Icon = getToolIcon(toolCall.name)
  const displayName = formatToolName(toolCall.name)
  const description = getToolDescription(toolCall.name)

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between gap-3 py-3 px-4 rounded-2xl transition-all cursor-pointer',
          isLoading
            ? 'bg-accent-blue-900/50 border border-accent-blue-700/50'
            : 'bg-secondary-100 hover:bg-secondary-200'
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="size-9 rounded-full bg-secondary-300 flex items-center justify-center flex-shrink-0">
          <Icon size={20} className="text-foreground/70" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold truncate">{displayName}</div>
            {isLoading && <Loader2 size={14} className="animate-spin text-accent-blue" />}
            {!isLoading && result && <CheckCircle2 size={14} className="text-green-500" />}
          </div>
          <div className="text-xs text-muted-foreground truncate">{description}</div>
        </div>

        <button
          className="size-7 cursor-pointer justify-center text-monochrome/60 hover:text-monochrome grid place-content-center flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            setIsModalOpen(true)
          }}
        >
          <Info size={18} />
        </button>
      </div>

      <ToolDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toolCall={toolCall}
        result={result}
      />
    </>
  )
}

export function ToolCalls({
  toolCalls,
  toolResponses,
  isLoading = false,
}: {
  toolCalls: AIMessage['tool_calls']
  toolResponses?: Array<{ toolCall: ToolCall; response?: any }>
  isLoading?: boolean
}) {
  if (!toolCalls || toolCalls.length === 0) return null

  return (
    <div className="space-y-3 w-full">
      {toolCalls.map((tc, idx) => {
        // Find the response for this tool call
        const toolData = toolResponses?.find((tr) => tr.toolCall.id === tc.id)
        const hasResponse = toolData?.response

        // Parse the response content
        let responseContent
        if (hasResponse) {
          try {
            if (typeof toolData.response.content === 'string') {
              responseContent = JSON.parse(toolData.response.content)
            } else {
              responseContent = toolData.response.content
            }
          } catch {
            responseContent = toolData.response.content
          }
        }

        return (
          <ToolCallCard
            key={tc.id || idx}
            toolCall={tc}
            isLoading={isLoading && !hasResponse}
            result={responseContent}
          />
        )
      })}
    </div>
  )
}

export function ToolResult({ message }: { message: ToolMessage }) {
  // Don't render tool results separately - they're now shown in the AI message's ToolCallCard
  return null
}
