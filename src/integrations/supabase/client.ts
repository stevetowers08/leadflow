import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment variables for Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jedfundfhzytpnbjkspn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjE5NDIsImV4cCI6MjA3MzkzNzk0Mn0.K5PFr9NdDav7SLk5pguj5tawj-10j-yhlUfFa_Fkvqg";
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

// Regular client for normal operations
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: false,  // Disable session persistence to avoid auth issues
    autoRefreshToken: false, // Disable auto refresh to avoid auth issues
    detectSessionInUrl: false, // Disable OAuth detection to avoid auth issues
  },
  // Add global headers to bypass RLS temporarily
  global: {
    headers: {
      'apikey': SUPABASE_PUBLISHABLE_KEY,
    },
  },
});

// Authentication helper functions
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google OAuth failed:', error);
    throw error;
  }

  return data;
};

// Admin client for admin operations (requires service role key)
export const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY 
  ? createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
// import { supabaseAdmin } from "@/integrations/supabase/client";