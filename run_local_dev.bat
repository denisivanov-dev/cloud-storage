@echo off

echo Killing all python processes...
taskkill /F /IM python.exe >nul 2>&1

echo Killing all go processes...
taskkill /F /IM main.exe >nul 2>&1
taskkill /F /IM air.exe >nul 2>&1

echo === FASTAPI BACKEND ===
start cmd /k "cd backend\api && venv\Scripts\python -m uvicorn app.main:app --reload"

echo === GO STORAGE (AIR HOT RELOAD) ===
start cmd /k "cd backend\storage && air"

echo === FRONTEND (VITE) ===
start cmd /k "cd frontend && npm run dev"

pause