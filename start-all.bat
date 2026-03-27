@echo off
REM LokSetu Startup Script - Runs all services
REM Use this to start everything at once

echo.
echo ========================================
echo   LokSetu - Full Stack Startup
echo ========================================
echo.
echo This will open 3 terminal windows for:
echo   1. Python LLM Backend (Port 8000)
echo   2. Node.js Backend (Port 5000)
echo   3. React Frontend (Port 5173)
echo.
echo Make sure PostgreSQL is running!
echo.

REM Start LLM Backend
echo Starting LLM Backend...
start "LLM Backend" cmd /k "cd C:\Users\DELL\Downloads\Orchestra-LLM-Complaint_resolver-main\backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 2 /nobreak

REM Start Node Backend
echo Starting Node Backend...
start "Node Backend" cmd /k "cd c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend && npm run dev"

timeout /t 2 /nobreak

REM Start React Frontend
echo Starting React Frontend...
start "React Frontend" cmd /k "cd c:\Users\DELL\Desktop\LOKSETU_BACKEND && npm run dev"

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:5000
echo LLM:       http://localhost:8000
echo.
echo Wait 5-10 seconds for all services to fully load...
echo.

timeout /t 10 /nobreak
start http://localhost:5173

echo Opening frontend in browser...
