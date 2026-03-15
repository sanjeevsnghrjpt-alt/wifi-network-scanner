import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { config } from './config/env.js'
import chatRoutes from './routes/chat.js'
import networkRoutes from './routes/network.js'

const app: Express = express()
const httpServer = createServer(app)

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// API Routes
app.use('/api', chatRoutes)
app.use('/api', networkRoutes)

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  })
})

// Socket.io Configuration
const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN,
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })

  socket.on('message', (data) => {
    console.log(`Message from ${socket.id}:`, data)
    io.emit('message', data)
  })
})

// Start Server
const PORT = config.PORT

httpServer.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║  Blackbox AI Backend Running         ║
║  Server: http://localhost:${PORT}      ║
║  Environment: ${config.NODE_ENV}                 ║
╚══════════════════════════════════════╝
  `)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    console.log('HTTP server closed')
  })
})
