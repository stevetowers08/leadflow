#!/bin/bash
# WSL Development Script
# Run this inside WSL: bash start-wsl.sh

echo "🚀 Starting dev server in WSL..."
cd /mnt/d/DEV/Recruitment/recruitment-01

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting Vite dev server on port 8086..."
npm run dev

