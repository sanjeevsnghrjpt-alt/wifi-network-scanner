'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatInterface } from '@/app/components/ChatInterface'
import { CodeEditor } from '@/app/components/CodeEditor'
import { ModelSelector } from '@/app/components/ModelSelector'
import { useChat } from '@/lib/hooks/useChat'
import { socket } from '@/lib/socket'

export default function ChatPage() {
  const { messages, sendMessage, isLoading } = useChat()
  const [selectedModel, setSelectedModel] = useState('gpt-4-groq')
  const [code, setCode] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    socket.connect()
    return () => {
      // Cleanup
    }
  }, [])

  return (
    <div className="h-screen flex bg-dark-bg">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} bg-dark-secondary border-r border-dark-tertiary overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-dark-tertiary">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-full btn btn-secondary mb-4"
          >
            ✕ Close
          </button>
          <h3 className="font-bold text-lg mb-2">Model</h3>
          <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-bold text-sm text-gray-400 mb-4">History</h3>
          <div className="text-sm text-gray-500">No history yet</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-dark-secondary border-b border-dark-tertiary px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            ☰ Menu
          </button>
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold">AI Chat</h1>
          </div>
          <div className="w-8" />
        </div>

        {/* Chat and Code Editor */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Chat */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatInterface
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              selectedModel={selectedModel}
            />
          </div>

          {/* Code Editor */}
          <div className="w-1/3 hidden lg:flex flex-col min-w-0">
            <CodeEditor code={code} onChange={setCode} />
          </div>
        </div>
      </div>
    </div>
  )
}
