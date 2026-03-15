import express from 'express'
import { aiService } from '../services/AIService.js'
import { ChatRequest, ChatResponse, ApiResponse } from '../types/index.js'

const router = express.Router()

router.post('/chat', async (req, res) => {
  try {
    const { message, model } = req.body as ChatRequest

    if (!message || !model) {
      return res.status(400).json({
        success: false,
        error: 'Message and model are required',
      } as ApiResponse)
    }

    const response = await aiService.chat(message, model)

    res.json({
      success: true,
      data: {
        message: response,
        model,
        timestamp: Date.now(),
      } as ChatResponse,
    } as ApiResponse)
  } catch (error) {
    console.error('Chat Route Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    } as ApiResponse)
  }
})

router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString(),
  })
})

export default router
