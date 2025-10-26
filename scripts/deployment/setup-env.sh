#!/bin/bash
# Environment Setup Script for Empowr CRM
# Run this script to create your .env file

echo "🚀 Setting up Empowr CRM Environment Variables..."
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Create .env file
cat > .env << 'EOF'
# Supabase Configuration
# Replace these with your actual Supabase project credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-key-here

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn Integration
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://your-domain.com/auth/linkedin-callback

# MCP Server Configuration
PORT=3000
NODE_ENV=production

# AI Chat Module Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id

# Development overrides (uncomment for local development)
# VITE_SUPABASE_URL=https://localhost:54321
EOF

echo "✅ Created .env file template"
echo ""
echo "🔧 NEXT STEPS:"
echo "1. Open .env file and replace placeholder values with your actual credentials"
echo "2. Get your Supabase credentials from: https://supabase.com/dashboard"
echo "3. Your Supabase URL format: https://your-project-id.supabase.co"
echo "4. Your keys should start with 'eyJ' (JWT format)"
echo ""
echo "📋 REQUIRED VARIABLES:"
echo "- VITE_SUPABASE_URL"
echo "- VITE_SUPABASE_ANON_KEY" 
echo "- SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "🎯 After updating .env, run: npm run dev"
