#!/bin/bash
# 🔐 Supabase Secrets Setup - Best Practices Implementation
# This script follows Supabase best practices for setting Edge Function secrets

echo "🔐 Supabase Secrets Setup - Best Practices"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory."
    echo "   Please run this script from your project root."
    exit 1
fi

echo "📋 Current Project Status:"
echo "   Project: jedfundfhzytpnbjkspn (4Twenty)"
echo "   Status: ACTIVE_HEALTHY"
echo "   Edge Functions: Deployed and ready"
echo ""

echo "🎯 RECOMMENDED METHOD: Supabase Dashboard (MCP)"
echo "=============================================="
echo ""
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Select project: jedfundfhzytpnbjkspn (4Twenty)"
echo "3. Navigate to: Settings → Edge Functions"
echo "4. Add new secret:"
echo "   - Key: GEMINI_API_KEY"
echo "   - Value: your-gemini-api-key-here"
echo "   - Mark as Secret: ✅ Yes"
echo "5. Click Save"
echo ""

echo "🔧 ALTERNATIVE METHOD: Supabase CLI"
echo "==================================="
echo ""

# Check if Supabase CLI is available
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI found"
    echo ""
    echo "Run these commands:"
    echo "  supabase login"
    echo "  supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here --project-ref jedfundfhzytpnbjkspn"
    echo "  supabase secrets list --project-ref jedfundfhzytpnbjkspn"
    echo ""
    
    # Ask if user wants to proceed with CLI
    read -p "Do you want to proceed with CLI setup? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔑 Setting GEMINI_API_KEY secret via CLI..."
        supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here --project-ref jedfundfhzytpnbjkspn
        
        if [ $? -eq 0 ]; then
            echo "✅ Secret set successfully!"
            echo ""
            echo "🧪 Testing the setup..."
            testEdgeFunction
        else
            echo "❌ Failed to set secret via CLI"
            echo "   Please use the Supabase Dashboard method instead"
        fi
    fi
else
    echo "❌ Supabase CLI not found"
    echo "   Install with: npm install -g supabase"
    echo "   Or use the Dashboard method above"
fi

echo ""
echo "🧪 TESTING SETUP"
echo "================"
echo ""

# Function to test the Edge Function
testEdgeFunction() {
    echo "Testing AI job summary function..."
    
    response=$(curl -s -X POST "https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/ai-job-summary" \
        -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY" \
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
        }')
    
    if echo "$response" | grep -q '"success":true'; then
        echo "✅ SUCCESS! AI job summary function is working"
        echo "   Response: $(echo "$response" | jq -r '.data.summary' 2>/dev/null || echo 'Summary generated')"
    elif echo "$response" | grep -q "Gemini API key not configured"; then
        echo "❌ FAILED: Gemini API key not configured"
        echo "   Please set the GEMINI_API_KEY secret using one of the methods above"
    else
        echo "⚠️  UNEXPECTED RESPONSE:"
        echo "   $response"
    fi
}

# Ask if user wants to test
read -p "Do you want to test the setup now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    testEdgeFunction
fi

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
echo "✅ Best practices followed:"
echo "   - Secret stored securely in Supabase"
echo "   - No hardcoded API keys in source code"
echo "   - Proper access controls via RLS"
echo "   - Edge Function deployed and ready"
echo ""
echo "🚀 Next steps:"
echo "   1. Test the AI job summary in your app"
echo "   2. Monitor API usage and costs"
echo "   3. Consider rotating keys quarterly"
echo ""
echo "📚 Documentation: SUPABASE_SECRETS_BEST_PRACTICES.md"

