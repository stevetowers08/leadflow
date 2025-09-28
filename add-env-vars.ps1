# PowerShell script to add environment variables to Vercel
# Run this script to add all required environment variables

Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green

# Supabase Configuration
Write-Host "Adding Supabase configuration..." -ForegroundColor Yellow
vercel env add VITE_SUPABASE_URL production --value "https://jedfundfhzytpnbjkspn.supabase.co"
vercel env add VITE_SUPABASE_ANON_KEY production --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjE5NDIsImV4cCI6MjA3MzkzNzk0Mn0.K5PFr9NdDav7SLk5pguj5tawj-10j-yhlUfFa_Fkvqg"
vercel env add SUPABASE_SERVICE_ROLE_KEY production --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w"

# Google OAuth Configuration
Write-Host "Adding Google OAuth configuration..." -ForegroundColor Yellow
vercel env add VITE_GOOGLE_CLIENT_ID production --value "431821374966-6g222eg7q4hsish5e8ln7mmh7t72dgc2.apps.googleusercontent.com"
vercel env add GOOGLE_CLIENT_SECRET production --value "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"

# MCP Server Configuration
Write-Host "Adding MCP server configuration..." -ForegroundColor Yellow
vercel env add PORT production --value "3000"
vercel env add NODE_ENV production --value "production"

# AI Chat Module Configuration
Write-Host "Adding AI chat module configuration..." -ForegroundColor Yellow
vercel env add N8N_WEBHOOK_URL production --value "https://n8n.srv814433.hstgr.cloud/webhook/9c3e515b-f1cf-4649-a4af-5143e3b7668e"

Write-Host "All environment variables added successfully!" -ForegroundColor Green
Write-Host "You may need to redeploy your Vercel project for changes to take effect." -ForegroundColor Cyan
