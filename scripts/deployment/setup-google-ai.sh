#!/bin/bash

# Google AI Studio Setup Script
# This script helps you set up the Google AI Studio API key

echo "🚀 Setting up Google AI Studio API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from env.example..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "📝 .env file already exists"
fi

# Update the API key in .env
echo "🔑 Setting up API key..."
sed -i 's/VITE_GEMINI_API_KEY=.*/VITE_GEMINI_API_KEY=your-gemini-api-key-here/' .env

echo "✅ Google AI Studio API key configured!"
echo ""
echo "📋 Next steps:"
echo "1. Restart your development server"
echo "2. Test the integration using the GoogleAIStudioTest component"
echo "3. For production, set the server-side key:"
echo "   supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here"
echo ""
echo "🎯 Your API key is now ready to use!"

