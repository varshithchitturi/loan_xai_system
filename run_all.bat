@echo off
REM Explainable AI Loan Approval Platform - one-click launcher

REM Backend: FastAPI + model serving + XAI + DB (SQLite by default)
start "XAI-Backend" cmd /k ^
  "cd /d \"%~dp0\" && python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload"

REM Frontend: Next.js premium fintech UI
start "XAI-Frontend" cmd /k ^
  "cd /d \"%~dp0frontend\" && npm install && npm run dev"

echo.
echo Explainable AI Loan Approval Platform is starting...
echo - Backend: http://localhost:8000/docs
echo - Frontend user dashboard: http://localhost:3000
echo - Admin analytics: http://localhost:3000/admin
echo.
echo Two terminal windows were opened: one for backend, one for frontend.
echo You can close the whole system by closing both windows.

