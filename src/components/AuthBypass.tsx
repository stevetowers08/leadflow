import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AuthBypass: React.FC = () => {
  const [isBypassing, setIsBypassing] = useState(false);
  const [bypassComplete, setBypassComplete] = useState(false);

  const bypassAuth = async () => {
    setIsBypassing(true);
    
    try {
      console.log('🚀 Bypassing authentication...');
      
      // Clear any existing auth state
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force reload
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Bypass error:', error);
      setIsBypassing(false);
    }
  };

  const createTestProfile = async () => {
    try {
      console.log('🔧 Creating test profile...');
      
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('user_profiles')
          .upsert({
            id: 'f100f6bc-22d8-456f-bcce-44c7881b68ef',
            email: 'stevetowers08@gmail.com',
            full_name: 'Steve Towers',
            role: 'owner',
            user_limit: 1000,
            is_active: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
          
        if (error) {
          console.error('❌ Profile creation failed:', error);
        } else {
          console.log('✅ Test profile created');
          setBypassComplete(true);
        }
      }
    } catch (error) {
      console.error('❌ Profile creation error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Bypass</h2>
          <p className="text-gray-600 mb-6">
            The authentication system is stuck. Use these tools to bypass and fix the issue.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={bypassAuth}
              disabled={isBypassing}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isBypassing ? 'Bypassing...' : 'Clear Auth & Reload'}
            </button>
            
            <button
              onClick={createTestProfile}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Test Profile
            </button>
            
            <button
              onClick={() => window.location.href = '/diagnostic'}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Run Diagnostics
            </button>
          </div>
          
          {bypassComplete && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 text-sm">✅ Test profile created successfully!</p>
            </div>
          )}
          
          <div className="mt-6 text-xs text-gray-500">
            <p>If the issue persists:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Check browser console for errors</li>
              <li>Clear all browser data</li>
              <li>Try incognito/private mode</li>
              <li>Check Supabase dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
