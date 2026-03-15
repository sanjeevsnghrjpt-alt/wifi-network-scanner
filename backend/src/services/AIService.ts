import axios from 'axios'
import { config } from '../config/env.js'

class AIService {
  async chat(message: string, model: string): Promise<string> {
    try {
      switch (model) {
        case 'gpt-4-groq':
        case 'mixtral-groq':
          return await this.groqChat(message, model)
        case 'deepseek':
          return await this.deepseekChat(message)
        case 'codellama-ollama':
        case 'llama2-ollama':
        case 'mistral-ollama':
          return await this.ollamaChat(message, model)
        default:
          return 'Unknown model'
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw error
    }
  }

  private async groqChat(message: string, model: string): Promise<string> {
    if (!config.GROQ_API_KEY) {
      throw new Error('Groq API key not configured')
    }

    const modelMap = {
      'gpt-4-groq': 'mixtral-8x7b-32768',
      'mixtral-groq': 'mixtral-8x7b-32768',
    }

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: modelMap[model as keyof typeof modelMap] || 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: message }],
          max_tokens: 1024,
        },
        {
          headers: {
            Authorization: `Bearer ${config.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('Groq API Error:', error)
      throw error
    }
  }

  private async deepseekChat(message: string): Promise<string> {
    if (!config.DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key not configured')
    }

    try {
      const response = await axios.post(
        'https://api.deepseek.com/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: message }],
          max_tokens: 1024,
        },
        {
          headers: {
            Authorization: `Bearer ${config.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('DeepSeek API Error:', error)
      throw error
    }
  }

  private async ollamaChat(message: string, model: string): Promise<string> {
    const modelMap = {
      'codellama-ollama': 'codellama',
      'llama2-ollama': 'llama2',
      'mistral-ollama': 'mistral',
    }

    try {
      const response = await axios.post(
        `${config.OLLAMA_BASE_URL}/api/generate`,
        {
          model: modelMap[model as keyof typeof modelMap] || 'llama2',
          prompt: message,
          stream: false,
        }
      )

      return response.data.response
    } catch (error) {
      console.error('Ollama API Error:', error)
      throw new Error('Ollama service not available. Make sure it is running on ' + config.OLLAMA_BASE_URL)
    }
  }
}

export const aiService = new AIService()
