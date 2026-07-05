'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Loader } from 'lucide-react'
import { useChat } from 'ai/react'
import { addMessage, getMessages } from '@/app/actions/messages'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

export function ChatPanel({ projectId }: { projectId: number }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadMessages()
  }, [projectId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    try {
      const data = await getMessages(projectId)
      setMessages(data)
    } catch (error) {
      console.error('[v0] Error loading messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = inputRef.current?.value.trim()
    
    if (!content || loading) return

    try {
      setLoading(true)

      const userMessage = await addMessage(projectId, 'user', content)
      setMessages((prev) => [...prev, userMessage])
      inputRef.current!.value = ''
      inputRef.current!.style.height = 'auto'

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      let assistantContent = ''
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('0:') || line.startsWith('3:')) {
              const data = line.slice(2)
              try {
                assistantContent += JSON.parse(data)
              } catch {
                // Skip parsing errors
              }
            }
          }
        }
      }

      if (assistantContent) {
        const assistantMessage = await addMessage(projectId, 'assistant', assistantContent)
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('[v0] Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div className="w-full md:w-1/2 flex flex-col bg-background border-r border-border">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <span className="text-xl">✨</span>
              </div>
              <h3 className="text-lg font-bold">Start Building</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Describe your app idea and watch it come to life in real-time
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-foreground border border-border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="bg-secondary text-foreground border border-border px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            placeholder="Describe your app..."
            className="flex-1 resize-none bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            rows={1}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                handleSendMessage(e as any)
              }
            }}
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="self-end bg-accent hover:bg-accent/90"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
