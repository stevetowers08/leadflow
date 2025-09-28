import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies for user_profiles...');
  
  // Drop existing policies
  const dropPolicies = [
    'DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles',
    'DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles'
  ];
  
  for (const sql of dropPolicies) {
    try {
      const { error } = await supabase.rpc('exec', { sql });
      if (error) {
        console.log('⚠️  Warning dropping policy:', error.message);
      } else {
        console.log('✅ Policy dropped');
      }
    } catch (e) {
      console.log('⚠️  Error:', e.message);
    }
  }
  
  // Create new policies
  const policies = [
    {
      name: 'Users can view their own profile',
      sql: 'CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id)'
    },
    {
      name: 'Owners can view all profiles', 
      sql: 'CREATE POLICY "Owners can view all profiles" ON public.user_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role = \'owner\'))'
    },
    {
      name: 'Users can update their own profile',
      sql: 'CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.user_profiles WHERE id = auth.uid()))'
    },
    {
      name: 'Owners can update any profile',
      sql: 'CREATE POLICY "Owners can update any profile" ON public.user_profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role = \'owner\'))'
    },
    {
      name: 'Owners can insert profiles',
      sql: 'CREATE POLICY "Owners can insert profiles" ON public.user_profiles FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role = \'owner\'))'
    },
    {
      name: 'Owners can delete profiles',
      sql: 'CREATE POLICY "Owners can delete profiles" ON public.user_profiles FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role = \'owner\'))'
    }
  ];
  
  for (const policy of policies) {
    try {
      const { error } = await supabase.rpc('exec', { sql: policy.sql });
      if (error) {
        console.log('❌ Error creating policy', policy.name + ':', error.message);
      } else {
        console.log('✅ Created policy:', policy.name);
      }
    } catch (e) {
      console.log('❌ Error creating policy', policy.name + ':', e.message);
    }
  }
  
  console.log('🎉 RLS policies update complete!');
}

fixRLSPolicies();
