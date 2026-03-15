# Blackbox AI Alternative

A free, open-source AI coding assistant with multiple model support, code execution sandbox, and real-time collaboration. Inspired by Blackbox AI but completely free and self-hosted.

## 🚀 Features

- **Multi-Model Support**: Choose from free APIs (Groq, DeepSeek) or self-hosted models via Ollama
- **Code Editor**: Monaco Editor with syntax highlighting for all languages
- **Real-Time Chat**: WebSocket-based real-time messaging
- **Self-Hosted**: Run everything locally with Docker
- **Zero Cost**: No API charges or subscriptions needed
- **Open Source**: MIT licensed

## 📋 Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + Socket.io
- **AI Models**: 
  - Free APIs: Groq, DeepSeek, Together AI
  - Self-Hosted: Ollama (LLaMA, Mistral, CodeLLaMA)
- **Database**: PostgreSQL + Redis
- **Containers**: Docker & Docker Compose

## 🛠️ Prerequisites

- Node.js 18+ and npm/yarn
- Docker & Docker Compose (for self-hosted models)
- Free API keys (optional):
  - [Groq API Key](https://console.groq.com) - Free tier available
  - [DeepSeek API Key](https://platform.deepseek.com)

## 📦 Installation

### 1. Clone or Extract the Project

```bash
cd "d:\New folder"
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

**Frontend** - Create `.env.local`:
```bash
cp .env.example .env.local
```

**Backend** - Create `.env.local`:
```bash
cp .env.example .env.local
```

Then add your API keys to `.env.local`:
```
GROQ_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
```

### 4. Start Services

#### Option A: Using Docker Compose (Recommended for Ollama)

```bash
# Start PostgreSQL, Redis, and Ollama
docker-compose up -d

# Pull ML models (takes time on first run)
docker/pull-models.sh
```

#### Option B: Using Local Services Only

Start the backend and frontend without Docker:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🤖 Available AI Models

### Free APIs (No Self-Hosting Needed)
- **Groq**: LLaMA 3, Mixtral 8x7B (very fast, free tier)
- **DeepSeek**: DeepSeek Chat (good code understanding)
- **Together AI**: Multiple models available

### Self-Hosted via Ollama (Local)
- **LLaMA 2**: 7B, 13B, 70B (general purpose)
- **Mistral**: 7B (good for code)
- **CodeLLaMA**: 7B, 13B, 34B (optimized for coding)

## 📝 Usage

1. Open http://localhost:3000 in your browser
2. Click "Start Coding" or navigate to `/chat`
3. Select an AI model from the dropdown
4. Type your question or paste code
5. Get instant AI responses

### Switching Models

- **Free APIs**: Select from Groq, DeepSeek options (instant, no wait)
- **Ollama Models**: Select from local options (requires Docker running)

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Pull specific models after starting
docker exec blackbox-ollama ollama pull llama2
docker exec blackbox-ollama ollama pull codellama
docker exec blackbox-ollama ollama list
```

## 🔧 Development

### Project Structure

```
.
├── frontend/              # Next.js app
│   ├── app/              # Pages and components
│   ├── lib/              # Utilities and hooks
│   └── types/            # TypeScript types
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # AI service integration
│   │   ├── config/       # Configuration
│   │   └── types/        # TypeScript types
├── docker/               # Docker configurations
├── docker-compose.yml    # Services orchestration
└── README.md             # This file
```

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
npm run start
```

#### Backend
```bash
cd backend
npm run build
npm run start
```

## 📚 API Endpoints

### Chat API

**POST** `/api/chat`
```json
{
  "message": "Write a function to sort an array",
  "model": "gpt-4-groq"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Here's a sorting function...",
    "model": "gpt-4-groq",
    "timestamp": 1699564800000
  }
}
```

### Health Check

**GET** `/api/health`

## 🚨 Troubleshooting

### Ollama Not Connecting
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart services
docker-compose restart ollama
```

### API Key Errors
- Ensure `.env.local` files are created in both `frontend/` and `backend/`
- Use `.env.example` as a template
- Never commit `.env.local` files

### Port Already in Use
- Change ports in `.env.local` and `docker-compose.yml`
- Or kill the process: `netstat -ano | findstr :PORT` (Windows)

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Contributions are welcome! Areas to improve:
- Code execution sandbox
- User authentication
- Conversation persistence
- More model integrations
- Mobile app

## ⭐ Support

If you find this useful, please star the repository!

## 📞 Need Help?

Check the configuration in:
- `frontend/.env.example`
- `backend/.env.example`
- `docker-compose.yml`

All services should output logs to help debug issues.

---

**Note**: This is a self-hosted solution. You're responsible for running and securing the infrastructure.
