import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EnvironmentCheck {
  name: string;
  value: string;
  isValid: boolean;
  error?: string;
}

interface ConnectionTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export const EnvironmentVerification: React.FC = () => {
  const [envChecks, setEnvChecks] = useState<EnvironmentCheck[]>([]);
  const [connectionTests, setConnectionTests] = useState<ConnectionTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    checkEnvironmentVariables();
  }, []);

  const checkEnvironmentVariables = () => {
    const checks: EnvironmentCheck[] = [
      {
        name: 'VITE_SUPABASE_URL',
        value: import.meta.env.VITE_SUPABASE_URL || 'NOT SET',
        isValid: validateSupabaseUrl(import.meta.env.VITE_SUPABASE_URL),
        error: !import.meta.env.VITE_SUPABASE_URL ? 'Missing' : 
               !import.meta.env.VITE_SUPABASE_URL.startsWith('https://') ? 'Must start with https://' :
               !import.meta.env.VITE_SUPABASE_URL.includes('.supabase.co') ? 'Must be a valid Supabase URL' : undefined
      },
      {
        name: 'VITE_SUPABASE_ANON_KEY',
        value: import.meta.env.VITE_SUPABASE_ANON_KEY ? 
               `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET',
        isValid: validateSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY),
        error: !import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Missing' :
               !import.meta.env.VITE_SUPABASE_ANON_KEY.startsWith('eyJ') ? 'Must be a valid JWT token' : undefined
      },
      {
        name: 'SUPABASE_SERVICE_ROLE_KEY',
        value: import.meta.env.SUPABASE_SERVICE_ROLE_KEY ? 
               `${import.meta.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...` : 'NOT SET',
        isValid: validateSupabaseKey(import.meta.env.SUPABASE_SERVICE_ROLE_KEY),
        error: !import.meta.env.SUPABASE_SERVICE_ROLE_KEY ? 'Missing' :
               !import.meta.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ') ? 'Must be a valid JWT token' : undefined
      },
      {
        name: 'VITE_GOOGLE_CLIENT_ID',
        value: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'NOT SET (Optional)',
        isValid: true, // Optional
        error: undefined
      }
    ];

    setEnvChecks(checks);
    setIsLoading(false);
  };

  const validateSupabaseUrl = (url: string): boolean => {
    return !!(url && url.startsWith('https://') && url.includes('.supabase.co'));
  };

  const validateSupabaseKey = (key: string): boolean => {
    return !!(key && key.startsWith('eyJ'));
  };

  const testSupabaseConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTests([
      { name: 'Client Initialization', status: 'pending', message: 'Testing...' },
      { name: 'Database Connection', status: 'pending', message: 'Testing...' },
      { name: 'Authentication', status: 'pending', message: 'Testing...' }
    ]);

    try {
      // Test 1: Client Initialization
      if (supabase) {
        setConnectionTests(prev => prev.map(test => 
          test.name === 'Client Initialization' 
            ? { ...test, status: 'success', message: 'Supabase client initialized successfully' }
            : test
        ));
      }

      // Test 2: Database Connection
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('count', { count: 'exact', head: true });

        if (error) {
          setConnectionTests(prev => prev.map(test => 
            test.name === 'Database Connection' 
              ? { ...test, status: 'error', message: `Database error: ${error.message}` }
              : test
          ));
        } else {
          setConnectionTests(prev => prev.map(test => 
            test.name === 'Database Connection' 
              ? { ...test, status: 'success', message: `Connected successfully. Companies count: ${data?.length || 0}` }
              : test
          ));
        }
      } catch (dbError) {
        setConnectionTests(prev => prev.map(test => 
          test.name === 'Database Connection' 
            ? { ...test, status: 'error', message: `Connection failed: ${dbError}` }
            : test
        ));
      }

      // Test 3: Authentication
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setConnectionTests(prev => prev.map(test => 
            test.name === 'Authentication' 
              ? { ...test, status: 'error', message: `Auth error: ${error.message}` }
              : test
          ));
        } else {
          setConnectionTests(prev => prev.map(test => 
            test.name === 'Authentication' 
              ? { 
                  ...test, 
                  status: 'success', 
                  message: session ? `Session found for: ${session.user?.email}` : 'No active session (normal for new users)'
                }
              : test
          ));
        }
      } catch (authError) {
        setConnectionTests(prev => prev.map(test => 
          test.name === 'Authentication' 
            ? { ...test, status: 'error', message: `Auth test failed: ${authError}` }
            : test
        ));
      }

    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending': return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const allEnvValid = envChecks.every(check => check.isValid || check.name.includes('GOOGLE'));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Environment Variables Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Checking environment variables...</span>
            </div>
          ) : (
            <>
              {envChecks.map((check) => (
                <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.isValid)}
                    <div>
                      <div className="font-medium">{check.name}</div>
                      <div className="text-sm text-gray-600">{check.value}</div>
                      {check.error && (
                        <div className="text-sm text-red-600">{check.error}</div>
                      )}
                    </div>
                  </div>
                  <Badge variant={check.isValid ? "default" : "destructive"}>
                    {check.isValid ? "Valid" : "Invalid"}
                  </Badge>
                </div>
              ))}
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🔧 Setup Instructions:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Create a <code className="bg-blue-100 px-1 rounded">.env</code> file in your project root</li>
                  <li>2. Copy the template from <code className="bg-blue-100 px-1 rounded">env.example</code></li>
                  <li>3. Replace placeholder values with your actual Supabase credentials</li>
                  <li>4. Get credentials from: <a href="https://supabase.com/dashboard" target="_blank" className="underline">Supabase Dashboard</a></li>
                </ol>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Supabase Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testSupabaseConnection} 
            disabled={!allEnvValid || isTestingConnection}
            className="w-full"
          >
            {isTestingConnection ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test Supabase Connection'
            )}
          </Button>

          {connectionTests.length > 0 && (
            <div className="space-y-3">
              {connectionTests.map((test) => (
                <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getConnectionStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-gray-600">{test.message}</div>
                    </div>
                  </div>
                  <Badge variant={
                    test.status === 'success' ? 'default' : 
                    test.status === 'error' ? 'destructive' : 'secondary'
                  }>
                    {test.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentVerification;
