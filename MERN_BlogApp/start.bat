@echo off
REM Quick Start Script for MERN Blog
REM This script starts both backend and frontend in development mode

echo.
echo ╔════════════════════════════════════╗
echo ║   MERN Blog - Quick Start Script   ║
echo ╚════════════════════════════════════╝
echo.

REM Check if Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Start backend in new window
echo.
echo 🚀 Starting Backend Server...
start cmd /k "cd backend && npm install ^&^& npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo.
echo 🎨 Starting Frontend Dev Server...
start cmd /k "cd frontend && npm install ^&^& npm run dev"

echo.
echo ╔════════════════════════════════════╗
echo ║  ✅ Both servers starting...       ║
echo ║                                    ║
echo ║  Frontend: http://localhost:5173  ║
echo ║  Backend:  http://localhost:5000  ║
echo ║  API:      http://localhost:5000/api
echo ║                                    ║
echo ║  Health:   http://localhost:5000/health
echo ╚════════════════════════════════════╝
echo.
pause
