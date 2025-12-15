#!/bin/bash
# Bulk TypeScript Error Fixer
# Fixes common patterns from old app → new app migration

echo "🔧 Starting bulk TypeScript fixes..."

# 1. Fix import paths
echo "📦 Fixing import paths..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e "s|from './useRealtimeSubscriptions'|from '@/hooks/useRealtimeSubscriptions'|g" \
  -e "s|from './useAdvancedCaching'|from '@/hooks/useAdvancedCaching'|g" \
  {} \;

# 2. Fix people → leads (where appropriate - be careful!)
echo "⚠️  Note: Review 'people' → 'leads' changes manually"
echo "   Some code may legitimately use 'people' table (legacy support)"

# 3. Add missing type assertions for known issues
echo "✅ Import path fixes complete"
echo ""
echo "Next steps:"
echo "1. Generate types from Supabase: npx supabase gen types typescript"
echo "2. Review and fix remaining errors manually"
echo "3. Use type assertions strategically for migration period"







