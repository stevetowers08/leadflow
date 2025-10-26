#!/bin/bash
# Script to set up Gemini API key as Supabase secret for Edge Functions

echo "🔧 Setting up Gemini API Key for Supabase Edge Functions..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo ""
    echo "   Or visit: https://supabase.com/docs/guides/cli/getting-started"
    echo ""
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory."
    echo "   Please run this script from your project root."
    exit 1
fi

# Set the Gemini API key as a secret
echo "🔑 Setting GEMINI_API_KEY secret..."
supabase secrets set GEMINI_API_KEY=AIzaSyCNT_-QVzJr36BRJYU_P6AQYWOEZaoepZ4

if [ $? -eq 0 ]; then
    echo "✅ Gemini API key set successfully!"
    echo ""
    echo "🧪 Testing the AI job summary function..."
    
    # Test the function
    curl -X POST "https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/ai-job-summary" \
        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w" \
        -H "Content-Type: application/json" \
        -d '{
            "jobId": "d93cb366-b36a-42e9-9489-1032f07d6902",
            "jobData": {
                "id": "d93cb366-b36a-42e9-9489-1032f07d6902",
                "title": "Enterprise Account Executive (Federal Government)",
                "company": "Elastic",
                "description": "Elastic, the Search AI Company, enables everyone to find the answers they need in real time, using all their data, at scale — unleashing the potential of businesses and people.",
                "location": "Australia"
            }
        }'
    
    echo ""
    echo "🎉 Setup complete! The AI job summary function should now work."
else
    echo "❌ Failed to set Gemini API key secret."
    echo "   Please check your Supabase CLI configuration."
    exit 1
fi

