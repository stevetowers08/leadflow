import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TestPage = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('people').select('count').limit(1);
        
        if (error) {
          setConnectionStatus(`❌ Database Error: ${error.message}`);
        } else {
          setConnectionStatus('✅ Database connection successful');
        }

        // Test auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
        
      } catch (err) {
        setConnectionStatus(`❌ Connection Error: ${err}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Database Connection:</h2>
          <p>{connectionStatus}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Authentication Status:</h2>
          <p>{user ? `✅ User: ${user.email}` : '❌ No user logged in'}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Supabase URL:</h2>
          <p className="text-sm">{import.meta.env.VITE_SUPABASE_URL || 'https://jedfundfhzytpnbjkspn.supabase.co'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
