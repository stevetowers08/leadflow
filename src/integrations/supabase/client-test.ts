import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Direct configuration for testing - bypasses all environment variables
const SUPABASE_URL = 'https://jedfundfhzytpnbjkspn.supabase.co';
const SUPABASE_SERVICE_KEY = 'sbp_ca2310f0c781f17e4ccb76218f091d5339875247';

console.log('🔧 Creating test Supabase client with service role key...');

// Create client with service role key (bypasses RLS)
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false, // Don't persist session for service role
    autoRefreshToken: false, // No token refresh needed for service role
    detectSessionInUrl: false, // No session detection needed
  },
  global: {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
    },
  },
});

console.log('✅ Test Supabase client created with service role key');

// Test connection immediately
supabase.from('companies').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Test Supabase connection failed:', error);
    } else {
      console.log('✅ Test Supabase connected successfully. Companies count:', count);
    }
  })
  .catch(err => {
    console.error('❌ Test Supabase connection error:', err);
  });
