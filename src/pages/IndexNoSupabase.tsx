import React, { useEffect, useState } from "react";

const IndexNoSupabase = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Simulate a simple async operation without Supabase
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData({
          message: "No Supabase test successful!",
          timestamp: new Date().toISOString(),
          testData: [
            { id: 1, name: "Test Item 1" },
            { id: 2, name: "Test Item 2" }
          ]
        });
        
        setLoading(false);
      } catch (err) {
        console.error('❌ Test failed:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Loading...</h1>
        <p>Testing without Supabase...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Index No Supabase Test</h1>
      <p>✅ {data?.message}</p>
      <p>Timestamp: {data?.timestamp}</p>
      <div>
        <h3>Test Data:</h3>
        <ul>
          {data?.testData?.map((item: any) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IndexNoSupabase;
