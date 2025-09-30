#!/bin/bash
# Deployment script for AI Edge Function
# This script deploys the secure server-side AI processing

echo "🚀 Deploying AI Job Summary Edge Function..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if logged in
if ! supabase status &> /dev/null; then
    echo "🔐 Please login to Supabase CLI:"
    supabase login
fi

# Deploy the function
echo "📦 Deploying Edge Function..."
supabase functions deploy ai-job-summary

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Edge Function deployed successfully!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Set your Gemini API key:"
    echo "   supabase secrets set GEMINI_API_KEY=AIzaSyCkGik7ZkmNI2cuRRFl97VlzadPu9ol55w"
    echo ""
    echo "2. Test the function:"
    echo "   curl -X POST https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/ai-job-summary \\"
    echo "     -H 'Authorization: Bearer YOUR_ANON_KEY' \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"jobData\":{\"title\":\"Test Job\",\"company\":\"Test Corp\",\"description\":\"Test description\"},\"jobId\":\"test-id\"}'"
    echo ""
    echo "🎉 Your AI processing is now secure and server-side!"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
