import { useState, FormEvent, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp, StopCircle, Paperclip, X, FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MultimodalInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: FormEvent) => void
  isLoading: boolean
  onStop: () => void
}

interface AttachedFile {
  id: string
  file: File
  preview?: string
}

export function MultimodalInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
}: MultimodalInputProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles: AttachedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))
    setAttachedFiles((prev) => [...prev, ...newFiles])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const handleSubmitWithFiles = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() && attachedFiles.length === 0) return
    onSubmit(e)
    setAttachedFiles([])
  }

  return (
    <div className="flex-shrink-0 px-3 pb-3 pt-2">
      <div className="bg-background rounded-xl border border-border shadow-sm">
        {/* File attachments preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 border-b border-border">
            {attachedFiles.map((file) => (
              <div
                key={file.id}
                className="relative group flex items-center gap-1.5 px-2 py-1 bg-muted rounded-lg text-xs"
              >
                {file.preview ? (
                  <img src={file.preview} alt="" className="w-6 h-6 object-cover rounded" />
                ) : (
                  <FileIcon className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="max-w-[100px] truncate">{file.file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitWithFiles} className="flex flex-col">
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
            rows={1}
            className={cn(
              'px-3 py-2.5 border-none bg-transparent shadow-none ring-0 outline-none',
              'focus:outline-none focus:ring-0 resize-none min-h-[40px] max-h-[120px]',
              'field-sizing-content'
            )}
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />

          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>

            {isLoading ? (
              <Button
                type="button"
                onClick={onStop}
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
              >
                <StopCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 rounded-full transition-all shadow-sm"
                disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
