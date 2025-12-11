# PowerShell script to add environment variables to Vercel
# Run this script to add all required environment variables

Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green

# Supabase Configuration
Write-Host "Adding Supabase configuration..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_SUPABASE_URL production --value "https://jedfundfhzytpnbjkspn.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --value "your-supabase-anon-key-here"
vercel env add SUPABASE_SERVICE_ROLE_KEY production --value "your-supabase-service-role-key-here"

# Google OAuth Configuration
Write-Host "Adding Google OAuth configuration..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production --value "your-google-client-id.apps.googleusercontent.com"
vercel env add GOOGLE_CLIENT_SECRET production --value "your-google-client-secret"

# MCP Server Configuration
Write-Host "Adding MCP server configuration..." -ForegroundColor Yellow
vercel env add PORT production --value "3000"
vercel env add NODE_ENV production --value "production"

# AI Chat Module Configuration
Write-Host "Adding AI chat module configuration..." -ForegroundColor Yellow
vercel env add N8N_WEBHOOK_URL production --value "https://n8n.srv814433.hstgr.cloud/webhook/9c3e515b-f1cf-4649-a4af-5143e3b7668e"

# Google Gemini AI API (Server-side - Required for AI features)
Write-Host "Adding Google Gemini AI configuration..." -ForegroundColor Yellow
vercel env add GEMINI_API_KEY production --value "your-gemini-api-key-here"

Write-Host "All environment variables added successfully!" -ForegroundColor Green
Write-Host "You may need to redeploy your Vercel project for changes to take effect." -ForegroundColor Cyan
