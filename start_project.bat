@echo off
title VentureLens Launcher
echo ============================================================
echo          Starting VentureLens Investment Platform
echo ============================================================
echo.

rem Check node_modules
if not exist "%~dp0frontend\node_modules" (
    echo [INFO] First-time setup: Installing frontend dependencies...
    cd /d "%~dp0frontend" && call npm install
)

echo [1/3] Starting Java Spring Boot Backend on port 8080...
start "VentureLens - Backend API (:8080)" cmd /k "cd /d %~dp0backend && java -jar target\venturelens-backend-1.0.0.jar"

echo [2/3] Starting React Vite Frontend on port 5173...
start "VentureLens - Frontend (:5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [3/3] Launching VentureLens in your browser...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo ============================================================
echo   VentureLens is running!
echo   - Web App: http://localhost:5173
echo   - API:     http://localhost:8080
echo.
echo   Demo Investor Login:
echo   Email:    marcus.aurelius@olympuscapital.com
echo   Password: password123
echo ============================================================
echo You can close this launcher window anytime.
pause
