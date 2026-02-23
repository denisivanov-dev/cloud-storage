@echo off

echo Killing all python processes...
taskkill /F /IM python.exe >nul 2>&1

echo === FASTAPI BACKEND ===
start cmd /k "cd backend\api && venv\Scripts\python -m uvicorn app.main:app --reload"

echo === FRONTEND (VITE) ===
start cmd /k "cd frontend && npm run dev"

pause