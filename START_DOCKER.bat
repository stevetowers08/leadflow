@echo off
echo.
echo ============================================
echo Recruitedge Platform - Docker Deployment
echo ============================================
echo.

REM Check if Docker Desktop is installed
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not in PATH.
    echo.
    echo Please do one of the following:
    echo 1. Start Docker Desktop manually
    echo 2. Add Docker to PATH, or
    echo 3. Run this from Docker Desktop's context
    echo.
    pause
    exit /b 1
)

echo [1/4] Stopping existing container (if any)...
docker stop recruitedge-platform 2>nul
docker rm recruitedge-platform 2>nul

echo [2/4] Building production image...
docker build -f Dockerfile.prod -t recruitedge-platform:latest .

if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Check Docker Desktop is running.
    pause
    exit /b 1
)

echo [3/4] Starting container...
docker run -d -p 80:80 --name recruitedge-platform --restart unless-stopped recruitedge-platform

if %errorlevel% neq 0 (
    echo [ERROR] Container start failed!
    pause
    exit /b 1
)

echo [4/4] Deployment complete!
echo.
echo ============================================
echo Your app is now running!
echo.
echo Local URL: http://localhost
echo.
echo To share on the internet:
echo   1. Install ngrok: choco install ngrok
echo   2. Run: ngrok http 80
echo   3. Share the ngrok URL
echo.
echo To stop: docker stop recruitedge-platform
echo To view logs: docker logs -f recruitedge-platform
echo ============================================
pause

