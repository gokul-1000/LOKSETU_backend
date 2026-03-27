@echo off
REM Quick Health Check Script for LokSetu

echo.
echo ========================================
echo   LokSetu - Health Check
echo ========================================
echo.
echo Testing all services...
echo.

REM Test LLM Backend
echo [1/3] Testing LLM Backend (Port 8000)...
curl -s http://localhost:8000/ >nul 2>&1
if errorlevel 1 (
    echo     ✗ LLM Backend NOT running
) else (
    echo     ✓ LLM Backend is running
)

REM Test Node Backend
echo [2/3] Testing Node Backend (Port 5000)...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo     ✗ Node Backend NOT running
) else (
    echo     ✓ Node Backend is running
)

REM Test Frontend
echo [3/3] Testing React Frontend (Port 5173)...
curl -s http://localhost:5173/ >nul 2>&1
if errorlevel 1 (
    echo     ✗ React Frontend NOT running
) else (
    echo     ✓ React Frontend is running
)

echo.
echo ========================================
echo   Health Check Complete
echo ========================================
echo.
echo Next steps:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000/api
echo   LLM:      http://localhost:8000
echo.
