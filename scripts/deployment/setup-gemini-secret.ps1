# PowerShell script to set up Gemini API key as Supabase secret for Edge Functions

Write-Host "🔧 Setting up Gemini API Key for Supabase Edge Functions..." -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g supabase" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Or visit: https://supabase.com/docs/guides/cli/getting-started" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check if we're in a Supabase project
if (-not (Test-Path "supabase/config.toml")) {
    Write-Host "❌ Not in a Supabase project directory." -ForegroundColor Red
    Write-Host "   Please run this script from your project root." -ForegroundColor Yellow
    exit 1
}

# Set the Gemini API key as a secret
Write-Host "🔑 Setting GEMINI_API_KEY secret..." -ForegroundColor Yellow
$result = supabase secrets set GEMINI_API_KEY=AIzaSyCNT_-QVzJr36BRJYU_P6AQYWOEZaoepZ4

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Gemini API key set successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🧪 Testing the AI job summary function..." -ForegroundColor Yellow
    
    # Test the function
    $testPayload = @{
        jobId = "d93cb366-b36a-42e9-9489-1032f07d6902"
        jobData = @{
            id = "d93cb366-b36a-42e9-9489-1032f07d6902"
            title = "Enterprise Account Executive (Federal Government)"
            company = "Elastic"
            description = "Elastic, the Search AI Company, enables everyone to find the answers they need in real time, using all their data, at scale — unleashing the potential of businesses and people."
            location = "Australia"
        }
    } | ConvertTo-Json -Depth 3
    
    $headers = @{
        "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/ai-job-summary" -Method POST -Body $testPayload -Headers $headers
        Write-Host "✅ Test successful! Response:" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
    } catch {
        Write-Host "⚠️ Test failed, but secret was set. Error:" -ForegroundColor Yellow
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🎉 Setup complete! The AI job summary function should now work." -ForegroundColor Green
} else {
    Write-Host "❌ Failed to set Gemini API key secret." -ForegroundColor Red
    Write-Host "   Please check your Supabase CLI configuration." -ForegroundColor Yellow
    exit 1
}

