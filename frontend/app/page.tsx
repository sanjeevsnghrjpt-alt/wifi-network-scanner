'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-dark-tertiary border-t-accent-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Navigation */}
      <nav className="bg-dark-secondary border-b border-dark-tertiary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Blackbox AI
            </div>
            <div className="space-x-4">
              <Link href="/chat" className="btn btn-primary">
                Start Coding
              </Link>
              <Link href="/scanner" className="btn btn-secondary">
                WiFi Scanner
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent-blue via-accent-purple to-pink-500 bg-clip-text text-transparent">
            AI-Powered Coding Assistant
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Free, open-source alternative to Blackbox AI. Write better code faster with multiple AI models, code execution, and real-time collaboration.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/chat" className="btn btn-primary text-lg px-8 py-3">
              Try Now - It's Free
            </Link>
            <Link href="#features" className="btn btn-secondary text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-dark-secondary py-20 border-y border-dark-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="card hover:border-accent-blue">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Supported AI Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-2xl font-bold mb-4 text-accent-blue">Free APIs</h3>
            <ul className="space-y-2 text-gray-400">
              <li>✓ Groq (LLaMA, Mixtral)</li>
              <li>✓ DeepSeek (DeepSeek Chat)</li>
              <li>✓ Together AI (Multiple Models)</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="text-2xl font-bold mb-4 text-accent-purple">Self-Hosted (Ollama)</h3>
            <ul className="space-y-2 text-gray-400">
              <li>✓ LLaMA 2 (7B, 13B, 70B)</li>
              <li>✓ Mistral (7B)</li>
              <li>✓ CodeLLaMA (7B, 13B, 34B)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-secondary border-t border-dark-tertiary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Blackbox AI Alternative. Open Source. Free Forever.</p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    id: 1,
    icon: '💬',
    title: 'Multi-Model Chat',
    description: 'Choose from multiple AI models for different tasks and capabilities.',
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Code Execution',
    description: 'Execute and test your code directly in the browser sandbox.',
  },
  {
    id: 3,
    icon: '🤝',
    title: 'Real-Time Collaboration',
    description: 'Share sessions and collaborate with team members in real-time.',
  },
  {
    id: 4,
    icon: '💾',
    title: 'Code History',
    description: 'Keep track of all your conversations and code snippets.',
  },
  {
    id: 5,
    icon: '🎨',
    title: 'Syntax Highlighting',
    description: 'Beautiful code editor with syntax highlighting for all languages.',
  },
  {
    id: 6,
    icon: '📡',
    title: 'WiFi Network Scanner',
    description: 'Discover and monitor all WiFi devices connected to your network in real-time.',
  },
]
