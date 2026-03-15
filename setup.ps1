#!/usr/bin/env pwsh

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Blackbox AI Alternative - Automated Setup Script            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "🔍 Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Navigate to project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Create .env files
Write-Host ""
Write-Host "📝 Creating environment files..." -ForegroundColor Yellow

# Frontend .env.local
$frontendEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
"@

if (-not (Test-Path "frontend\.env.local")) {
    Set-Content -Path "frontend\.env.local" -Value $frontendEnv
    Write-Host "✅ Created frontend/.env.local" -ForegroundColor Green
} else {
    Write-Host "⏭️  frontend/.env.local already exists" -ForegroundColor Gray
}

# Backend .env.local
$backendEnv = @"
PORT=3001
NODE_ENV=development
GROQ_API_KEY=gsk_test_key_free_tier
DEEPSEEK_API_KEY=sk_test_key_free_tier
OLLAMA_BASE_URL=http://localhost:11434
DATABASE_URL=postgresql://blackbox:development@localhost:5432/blackbox_ai
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
"@

if (-not (Test-Path "backend\.env.local")) {
    Set-Content -Path "backend\.env.local" -Value $backendEnv
    Write-Host "✅ Created backend/.env.local" -ForegroundColor Green
} else {
    Write-Host "⏭️  backend/.env.local already exists" -ForegroundColor Gray
}

# Install Frontend Dependencies
Write-Host ""
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location "$projectRoot\frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Install Backend Dependencies
Write-Host ""
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location "$projectRoot\backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Create startup script
Write-Host ""
Write-Host "🚀 Creating startup scripts..." -ForegroundColor Yellow

# Backend startup
$backendStartup = @"
@echo off
cd /d "%~dp0backend"
npm run dev
"@
Set-Content -Path "$projectRoot\start-backend.bat" -Value $backendStartup
Write-Host "✅ Created start-backend.bat" -ForegroundColor Green

# Frontend startup
$frontendStartup = @"
@echo off
cd /d "%~dp0frontend"
npm run dev
"@
Set-Content -Path "$projectRoot\start-frontend.bat" -Value $frontendStartup
Write-Host "✅ Created start-frontend.bat" -ForegroundColor Green

# Success message
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ Setup Complete!                               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To start the applications, run in separate terminals:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend API:" -ForegroundColor Yellow
Write-Host "  cd ""$projectRoot\backend""" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend App:" -ForegroundColor Yellow
Write-Host "  cd ""$projectRoot\frontend""" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open your browser to: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or simply double-click:" -ForegroundColor Yellow
Write-Host "  start-backend.bat" -ForegroundColor White
Write-Host "  start-frontend.bat" -ForegroundColor White
Write-Host ""
