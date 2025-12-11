#!/bin/bash

# Google AI Studio Server-Side Setup Script
# This script helps you set up the server-side API key for Supabase Edge Functions

echo "🚀 Setting up Google AI Studio server-side API key..."

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing via npm..."
    npm install -g supabase
fi

echo "📋 Manual setup required:"
echo ""
echo "1. Login to Supabase CLI:"
echo "   supabase login"
echo ""
echo "2. Set the API key as a secret:"
echo "   supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here --project-ref jedfundfhzytpnbjkspn"
echo ""
echo "3. Verify the secret was set:"
echo "   supabase secrets list --project-ref jedfundfhzytpnbjkspn"
echo ""
echo "✅ Client-side API key is already configured in .env"
echo "🎯 Your Google AI Studio integration is ready to test!"

