@echo off
echo Building recruitedge-platform Docker image...
docker build -f Dockerfile.prod -t recruitedge-platform:latest .

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Build successful! Starting container...
docker run -d -p 80:80 --name recruitedge --restart unless-stopped recruitedge-platform

if %errorlevel% neq 0 (
    echo Container start failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo Recruitedge Platform is running!
echo.
echo Access at: http://localhost
echo Stop with: docker stop recruitedge
echo.
echo To share on internet, install ngrok:
echo   choco install ngrok
echo   ngrok http 80
echo ============================================
pause

