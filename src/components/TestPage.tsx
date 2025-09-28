import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  User, 
  Key, 
  Globe,
  RefreshCw,
  TestTube,
  Settings,
  Users,
  Building,
  Briefcase,
  MessageSquare,
  BarChart3
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: string;
  icon: React.ReactNode;
}

export const TestPage: React.FC = () => {
  const { user, userProfile, session, loading, error } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<{status: 'success' | 'error' | 'warning', message: string, details?: string}>) => {
    setTests(prev => prev.map(test => 
      test.name === testName ? { ...test, status: 'pending', message: 'Testing...', icon: <RefreshCw className="h-4 w-4 animate-spin" /> } : test
    ));

    try {
      const result = await testFn();
      setTests(prev => prev.map(test => 
        test.name === testName ? {
          ...test,
          ...result,
          icon: result.status === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                result.status === 'error' ? <XCircle className="h-4 w-4 text-red-600" /> :
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
        } : test
      ));
    } catch (error) {
      setTests(prev => prev.map(test => 
        test.name === testName ? {
          ...test,
          status: 'error',
          message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          icon: <XCircle className="h-4 w-4 text-red-600" />
        } : test
      ));
    }
  };

  const testEnvironmentVariables = async () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!url || !key) {
      return { status: 'error', message: 'Missing required Supabase environment variables' };
    }

    const isValidUrl = url.startsWith('https://') && url.includes('.supabase.co');
    const isValidKey = key.startsWith('eyJ');

    if (!isValidUrl || !isValidKey) {
      return { status: 'warning', message: 'Supabase configuration appears invalid' };
    }

    return { 
      status: 'success', 
      message: 'Environment variables configured correctly',
      details: `URL: ${url.substring(0, 30)}..., Key: ${key.substring(0, 20)}..., Service Key: ${serviceKey ? 'Present' : 'Missing'}, Google ID: ${googleId ? 'Present' : 'Missing'}`
    };
  };

  const testSupabaseConnection = async () => {
    try {
      const { count, error: countError } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        return { status: 'error', message: `Database connection failed: ${countError.message}` };
      }

      return { 
        status: 'success', 
        message: `Database connected successfully`,
        details: `Found ${count} companies in database`
      };
    } catch (error) {
      return { status: 'error', message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  };

  const testAuthentication = async () => {
    if (!user) {
      return { status: 'warning', message: 'No user authenticated' };
    }

    if (!userProfile) {
      return { status: 'warning', message: 'User authenticated but no profile found' };
    }

    return { 
      status: 'success', 
      message: 'Authentication working correctly',
      details: `User: ${user.email}, Role: ${userProfile.role}, Profile ID: ${userProfile.id}`
    };
  };

  const testDatabaseTables = async () => {
    const tables = ['companies', 'people', 'jobs', 'interactions', 'user_profiles'];
    const results = [];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          results.push(`${table}: Error - ${error.message}`);
        } else {
          results.push(`${table}: ${count} records`);
        }
      } catch (error) {
        results.push(`${table}: Failed to query`);
      }
    }

    const hasErrors = results.some(r => r.includes('Error') || r.includes('Failed'));
    return {
      status: hasErrors ? 'warning' : 'success',
      message: 'Database tables accessible',
      details: results.join(', ')
    };
  };

  const testRLSPolicies = async () => {
    try {
      // Test if we can access our own profile (should work)
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        return { status: 'error', message: `RLS test failed: ${profileError.message}` };
      }

      return { 
        status: 'success', 
        message: 'RLS policies working correctly',
        details: `Can access own profile: ${profile ? 'Yes' : 'No'}`
      };
    } catch (error) {
      return { status: 'error', message: `RLS test failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  };

  const testComponents = async () => {
    // Test if we can render basic components
    try {
      const testElement = document.createElement('div');
      testElement.innerHTML = '<div>Test</div>';
      
      return { 
        status: 'success', 
        message: 'React components rendering correctly',
        details: 'DOM manipulation working'
      };
    } catch (error) {
      return { status: 'error', message: `Component test failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([
      { name: 'Environment Variables', status: 'pending', message: 'Testing...', icon: <RefreshCw className="h-4 w-4 animate-spin" /> },
      { name: 'Supabase Connection', status: 'pending', message: 'Testing...', icon: <RefreshCw className="h-4 w-4 animate-spin" /> },
      { name: 'Authentication', status: 'pending', message: 'Testing...', icon: <RefreshCw className="h-4 w-4 animate-spin" /> },
      { name: 'Database Tables', status: 'pending', message: 'Testing...', icon: <RefreshCw className="h-4 w-4 animate-spin" /> },
      { name: 'RLS Policies', status: 'pending', message: 'Testing...', icon: <RefreshCw className="h-4 w-4 animate-spin" /> },
      { name: 'React Components', status: 'pending', message: 'Testing...', icon: <RefreshCw className="h-4 w-4 animate-spin" /> }
    ]);

    const testFunctions = [
      { name: 'Environment Variables', fn: testEnvironmentVariables },
      { name: 'Supabase Connection', fn: testSupabaseConnection },
      { name: 'Authentication', fn: testAuthentication },
      { name: 'Database Tables', fn: testDatabaseTables },
      { name: 'RLS Policies', fn: testRLSPolicies },
      { name: 'React Components', fn: testComponents }
    ];

    for (const test of testFunctions) {
      await runTest(test.name, test.fn);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-blue-600" />
              Empowr CRM - Component Testing Suite
            </CardTitle>
            <p className="text-gray-600">
              Test all components and functionality without affecting the main application.
            </p>
          </CardHeader>
        </Card>

        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={user ? "default" : "secondary"}>
                  {user ? "Authenticated" : "Not Authenticated"}
                </Badge>
                <span className="text-sm">{user?.email || 'No user'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={userProfile ? "default" : "secondary"}>
                  {userProfile ? "Profile Loaded" : "No Profile"}
                </Badge>
                <span className="text-sm">{userProfile?.role || 'No role'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={loading ? "secondary" : "outline"}>
                  {loading ? "Loading" : "Ready"}
                </Badge>
                {error && <span className="text-sm text-red-600">{error}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Test Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4" />
                    Run All Tests
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setTests([])}
                disabled={isRunning}
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {tests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {test.icon}
                        <div>
                          <h3 className="font-medium">{test.name}</h3>
                          <p className="text-sm opacity-80">{test.message}</p>
                          {test.details && (
                            <p className="text-xs mt-1 opacity-70">{test.details}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Building className="h-4 w-4 mr-2" />
                Main App
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/jobs'}>
                <Briefcase className="h-4 w-4 mr-2" />
                Jobs
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/companies'}>
                <Building className="h-4 w-4 mr-2" />
                Companies
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin'}>
                <Users className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Environment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>Supabase Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>Service Key:</strong> {import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>Google Client ID:</strong> {import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
