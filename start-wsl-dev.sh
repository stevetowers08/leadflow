#!/bin/bash
# Start dev server in WSL with network drive access

echo "🔧 Setting up network drive access..."
# Mount D: drive if not already mounted
if [ ! -d "/mnt/d/DEV" ]; then
    echo "Mounting D: drive..."
    sudo mkdir -p /mnt/d
    sudo mount -t drvfs D: /mnt/d
fi

echo "📁 Navigating to project..."
cd /mnt/d/DEV/Recruitment/recruitment-01

echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (this may take a few minutes)..."
    npm install
fi

echo "🚀 Starting Vite dev server on port 8086..."
npm run dev

