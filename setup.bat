@echo off
REM Blackbox AI Alternative - One-Click Setup
REM This script will:
REM 1. Check for Node.js
REM 2. Install dependencies
REM 3. Create .env files
REM 4. Start the application

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   Blackbox AI - Automated Setup                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/ (LTS version)
    echo.
    echo After installation, restart this command prompt and run again.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

REM Create .env files
echo 📝 Creating environment files...

if not exist "frontend\.env.local" (
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:3001/api
        echo NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
    ) > "frontend\.env.local"
    echo ✅ Created frontend/.env.local
) else (
    echo ⏭️  frontend/.env.local already exists
)

if not exist "backend\.env.local" (
    (
        echo PORT=3001
        echo NODE_ENV=development
        echo GROQ_API_KEY=gsk_test_free_tier
        echo DEEPSEEK_API_KEY=sk_test_free_tier
        echo OLLAMA_BASE_URL=http://localhost:11434
        echo CORS_ORIGIN=http://localhost:3000
    ) > "backend\.env.local"
    echo ✅ Created backend/.env.local
) else (
    echo ⏭️  backend/.env.local already exists
)

REM Install dependencies
echo.
echo 📦 Installing Frontend Dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Frontend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo 📦 Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Backend installation failed!
    pause
    exit /b 1
)
cd ..

REM Success
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              ✅ Setup Complete!                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Starting application...
echo.
echo Opening terminals for Backend and Frontend...
echo.
echo Terminal 1: Backend API (http://localhost:3001)
start cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 3 /nobreak

echo Terminal 2: Frontend App (http://localhost:3000)
start cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ✨ Applications starting...
echo    Backend:  http://localhost:3001
echo    Frontend: http://localhost:3000
echo.
pause
