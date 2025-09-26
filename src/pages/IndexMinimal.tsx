import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const IndexMinimal = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test with Supabase client now that we know the connection works
        console.log('🔍 Testing Supabase client...');
        const { data, error } = await supabase
          .from("people")
          .select("id, name")
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        console.log('✅ Supabase client successful:', data);
        
        setLoading(false);
      } catch (err) {
        console.error('❌ Supabase query failed:', err);
        console.error('❌ Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          name: err instanceof Error ? err.name : undefined,
          cause: err instanceof Error ? err.cause : undefined
        });
        
        // Try to get more specific error information
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError('Network error - check if Supabase is accessible');
        } else if (err instanceof Error) {
          setError(`Error: ${err.message}`);
        } else {
          setError('Unknown error occurred');
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Loading...</h1>
        <p>Testing Supabase connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error</h1>
        <p>Failed to connect to Supabase: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Index Minimal Test</h1>
      <p>✅ Supabase connection working!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
};

export default IndexMinimal;
