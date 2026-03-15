export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatRequest {
  message: string
  model: string
  sessionId?: string
}

export interface ChatResponse {
  message: string
  model: string
  timestamp: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
