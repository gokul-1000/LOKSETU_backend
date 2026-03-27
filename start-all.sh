#!/bin/bash

# LokSetu Startup Script for macOS/Linux

echo ""
echo "========================================"
echo "   LokSetu - Full Stack Startup"
echo "========================================"
echo ""
echo "This will start 3 services for:"
echo "   1. Python LLM Backend (Port 8000)"
echo "   2. Node.js Backend (Port 5000)"
echo "   3. React Frontend (Port 5173)"
echo ""
echo "Make sure PostgreSQL is running!"
echo ""

# Start LLM Backend
echo "Starting LLM Backend..."
cd "C:\Users\DELL\Downloads\Orchestra-LLM-Complaint_resolver-main\backend" || cd ~/Orchestra-LLM-Complaint_resolver-main/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &

sleep 2

# Start Node Backend
echo "Starting Node Backend..."
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend || cd ~/LOKSETU_BACKEND/backend
npm run dev &

sleep 2

# Start React Frontend
echo "Starting React Frontend..."
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND || cd ~/LOKSETU_BACKEND
npm run dev &

echo ""
echo "========================================"
echo "   All services started!"
echo "========================================"
echo ""
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://localhost:5000"
echo "LLM:       http://localhost:8000"
echo ""
echo "Opening frontend in browser..."
sleep 10
open http://localhost:5173 || xdg-open http://localhost:5173

echo ""
echo "Done! Check the terminal windows for logs."
