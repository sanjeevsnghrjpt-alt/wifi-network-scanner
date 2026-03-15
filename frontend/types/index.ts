export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: number
  updatedAt: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
