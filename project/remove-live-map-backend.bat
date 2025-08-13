@echo off
echo Stopping any Node.js processes that might be using the live-map-backend...
taskkill /f /im node.exe /t 2>nul

echo Waiting for processes to fully terminate...
timeout /t 3 /nobreak >nul

echo Attempting to remove live-map-backend folder...
rmdir /s /q "backend\live-map-backend" 2>nul

if exist "backend\live-map-backend" (
    echo Failed to remove folder. It may still be in use by another process.
    echo Please:
    echo 1. Close any terminals/command prompts
    echo 2. Stop any running Node.js servers
    echo 3. Run this script again
    pause
) else (
    echo Successfully removed live-map-backend folder!
    pause
)
