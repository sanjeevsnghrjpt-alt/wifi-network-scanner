# Blackbox AI Alternative - Development Instructions

## Project Overview
A full-featured AI coding assistant platform with multi-model support, code execution sandbox, and real-time collaboration.

**Tech Stack:**
- Frontend: Next.js 14 + React + TypeScript
- Backend: Node.js + Express
- AI Models: Ollama (self-hosted) + free tier APIs (Groq, DeepSeek)
- Real-time: Socket.io
- Database: PostgreSQL + Redis
- Containers: Docker & Docker Compose

## Project Structure

```
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages and components
│   ├── lib/                 # Utility functions and hooks
│   ├── types/               # TypeScript definitions
│   ├── package.json         # Frontend dependencies
│   └── .env.example         # Environment variables template
├── backend/                 # Node.js Express API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # AI model services
│   │   ├── config/         # Configuration management
│   │   └── types/          # TypeScript definitions
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
├── docker/                 # Docker configurations
│   ├── Dockerfile.ollama   # Ollama container setup
│   └── pull-models.sh      # Script to download ML models
├── docker-compose.yml      # Multi-container orchestration
└── README.md              # Comprehensive documentation
```

## Setup Progress

- [x] Create copilot-instructions.md file
- [x] Scaffold Next.js frontend project
- [x] Scaffold Node.js backend API
- [x] Create Docker setup for Ollama, PostgreSQL, Redis
- [ ] Install dependencies (npm install in both dirs)
- [ ] Configure environment variables (.env.local files)
- [ ] Start Docker services (docker-compose up)
- [ ] Verify setup and test connectivity

## Next Steps
1. Install dependencies: `cd frontend && npm install && cd ../backend && npm install`
2. Create `.env.local` files in both directories (copy from `.env.example`)
3. Add API keys to backend `.env.local` (Groq, DeepSeek)
4. Start Docker: `docker-compose up -d`
5. Pull models: `bash docker/pull-models.sh`
6. Launch dev servers: `npm run dev` in each directory
7. Visit http://localhost:3000
