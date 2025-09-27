import React, { useState, useEffect } from "react";

const SupabaseTest = () => {
  const [status, setStatus] = useState("Testing downgraded Supabase client...");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  console.log('🚀 SupabaseTest page rendering - testing downgraded version...');

  useEffect(() => {
    const testDowngradedClient = async () => {
      const testResults: string[] = [];
      
      try {
        // Test with downgraded version
        setStatus("Testing Supabase client v2.39.0...");
        const { createClient } = await import('@supabase/supabase-js');
        
        const supabaseUrl = "https://jedfundfhzytpnbjkspn.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjE5NDIsImV4cCI6MjA3MzkzNzk0Mn0.K5PFr9NdDav7SLk5pguj5tawj-10j-yhlUfFa_Fkvqg";
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        testResults.push("✅ Client created with v2.39.0");
        
        // Test query with timeout
        setStatus("Testing query with 5-second timeout...");
        const queryPromise = supabase
          .from("jobs")
          .select("id, title")
          .limit(3);

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000)
        );

        try {
          const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
          if (error) {
            testResults.push(`❌ Query error: ${error.message}`);
          } else {
            testResults.push(`✅ Query success: Found ${data?.length || 0} jobs`);
          }
        } catch (timeoutError: any) {
          testResults.push(`❌ Query timeout: ${timeoutError.message}`);
        }
        
        setResults(testResults);
        setStatus("Downgraded version test complete!");
        
      } catch (err: any) {
        setError(`Downgraded test failed: ${err.message}`);
        setStatus("Downgraded test failed");
      }
    };

    testDowngradedClient();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'black', fontSize: '24px', marginBottom: '20px' }}>
        🚀 Supabase Downgrade Test
      </h1>
      
      <div style={{ 
        padding: '20px', 
        border: '2px solid #28a745', 
        borderRadius: '8px',
        backgroundColor: '#f8fff8',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: 'black', marginBottom: '10px' }}>Status:</h2>
        <p style={{ color: 'black', margin: '5px 0' }}>Status: {status}</p>
        
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#fee', 
            border: '1px solid #fcc',
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <p style={{ color: 'red', margin: '0' }}>Error: {error}</p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #007bff', 
          borderRadius: '8px',
          backgroundColor: '#e7f3ff'
        }}>
          <h2 style={{ color: 'black', marginBottom: '15px' }}>Test Results:</h2>
          {results.map((result, index) => (
            <p key={index} style={{ color: 'black', margin: '5px 0' }}>{result}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;