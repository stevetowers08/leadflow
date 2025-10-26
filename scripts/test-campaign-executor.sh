#!/bin/bash
# Test Campaign Executor Edge Function

echo "🧪 Testing Campaign Executor"
echo "=============================="

# Get Supabase project URL
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env.local 2>/dev/null | cut -d '=' -f2)
if [ -z "$SUPABASE_URL" ]; then
  SUPABASE_URL="https://jedfundfhzytpnbjkspn.supabase.co"
fi

echo "📡 Supabase URL: $SUPABASE_URL"

# Call the edge function
echo ""
echo "🔄 Invoking campaign-executor..."
curl -X POST "${SUPABASE_URL}/functions/v1/campaign-executor" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(grep VITE_SUPABASE_ANON_KEY .env.local 2>/dev/null | cut -d '=' -f2 | tr -d '"')" \
  -d '{}'

echo ""
echo ""
echo "✅ Test complete!"

