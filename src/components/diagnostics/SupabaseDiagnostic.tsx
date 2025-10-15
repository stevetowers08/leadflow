import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export function SupabaseDiagnostic() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 Testing Supabase connection...');

        // Test 1: Check environment variables
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        console.log('Environment check:', {
          url: url ? '✅ Present' : '❌ Missing',
          key: key ? '✅ Present' : '❌ Missing',
        });

        if (!url || !key) {
          throw new Error('Missing environment variables');
        }

        // Test 2: Try to fetch companies count
        const { count, error: countError } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          throw new Error(`Count query failed: ${countError.message}`);
        }

        console.log('✅ Companies count:', count);

        // Test 3: Try to fetch actual data
        const { data: companies, error: dataError } = await supabase
          .from('companies')
          .select('id, name, website')
          .limit(5);

        if (dataError) {
          throw new Error(`Data query failed: ${dataError.message}`);
        }

        console.log('✅ Sample companies:', companies);

        setData({ count, companies });
        setStatus('success');
      } catch (err) {
        console.error('❌ Supabase connection test failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔧 Supabase Connection Diagnostic</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Environment Variables:</h3>
        <div>
          VITE_SUPABASE_URL:{' '}
          {import.meta.env.VITE_SUPABASE_URL ? '✅ Present' : '❌ Missing'}
        </div>
        <div>
          VITE_SUPABASE_ANON_KEY:{' '}
          {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Connection Status:</h3>
        {status === 'loading' && <div>🔄 Testing connection...</div>}
        {status === 'success' && <div>✅ Connection successful!</div>}
        {status === 'error' && <div>❌ Connection failed: {error}</div>}
      </div>

      {data && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Sample Data:</h3>
          <div>Companies count: {data.count}</div>
          <div>Sample companies:</div>
          <pre>{JSON.stringify(data.companies, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>Client Info:</h3>
        <div>
          Supabase client: {supabase ? '✅ Initialized' : '❌ Not initialized'}
        </div>
      </div>
    </div>
  );
}
