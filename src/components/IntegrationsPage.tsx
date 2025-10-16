import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { gmailService } from '@/services/gmailService';
import { toast } from '@/utils/simpleToast';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const IntegrationsPage = () => {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [smartleadToken, setSmartleadToken] = useState('');
  const [smartleadLoading, setSmartleadLoading] = useState(false);

  useEffect(() => {
    checkGmailConnection();
    checkSmartleadConnection();
  }, []);

  const checkGmailConnection = () => {
    const token = localStorage.getItem('gmail_access_token');
    setGmailConnected(!!token);
  };

  const checkSmartleadConnection = () => {
    const token = localStorage.getItem('smartlead_api_token');
    setSmartleadToken(token || '');
  };

  const handleConnectGmail = async () => {
    setGmailLoading(true);
    try {
      await gmailService.authenticateWithGmail();
      // The redirect will happen automatically
    } catch (error) {
      console.error('Gmail connection error:', error);
      toast.error('Failed to connect to Gmail. Please try again.');
      setGmailLoading(false);
    }
  };

  const handleConnectSmartlead = async () => {
    if (!smartleadToken.trim()) {
      toast.error('Please enter your Smartlead API token');
      return;
    }

    setSmartleadLoading(true);
    try {
      // Store the token
      localStorage.setItem('smartlead_api_token', smartleadToken);
      toast.success('Smartlead API token saved successfully!');
    } catch (error) {
      console.error('Smartlead connection error:', error);
      toast.error('Failed to save Smartlead token. Please try again.');
    } finally {
      setSmartleadLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50/50'>
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Gmail Integration */}
          <Card className='group hover:shadow-md transition-all duration-300'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300'>
                  <svg
                    className='h-6 w-6 text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819L12 8.73l6.545-4.91h3.819c.904 0 1.636.732 1.636 1.636z'
                      fill='currentColor'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <CardTitle className='text-lg font-semibold text-gray-900 mb-1'>
                    Gmail
                  </CardTitle>
                  <CardDescription className='text-gray-600 text-sm'>
                    Sync emails and send messages
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'>
                <span className='text-xs font-medium text-gray-700'>
                  Status
                </span>
                <Badge
                  variant={gmailConnected ? 'default' : 'secondary'}
                  className={
                    gmailConnected
                      ? 'bg-green-100 text-green-800 text-xs'
                      : 'bg-gray-100 text-gray-600 text-xs'
                  }
                >
                  {gmailConnected ? '✓ Connected' : 'Not Connected'}
                </Badge>
              </div>
              <Button
                className='w-full'
                onClick={handleConnectGmail}
                disabled={gmailLoading}
              >
                {gmailLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Connecting...
                  </>
                ) : gmailConnected ? (
                  'Reconnect Gmail'
                ) : (
                  'Connect Gmail'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* LinkedIn Integration */}
          <Card className='group hover:shadow-md transition-all duration-300'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300'>
                  <svg
                    className='h-6 w-6 text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
                      fill='currentColor'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <CardTitle className='text-lg font-semibold text-gray-900 mb-1'>
                    LinkedIn
                  </CardTitle>
                  <CardDescription className='text-gray-600 text-sm'>
                    Sync messages and track conversations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'>
                <span className='text-xs font-medium text-gray-700'>
                  Status
                </span>
                <Badge
                  variant='secondary'
                  className='bg-gray-100 text-gray-600 text-xs'
                >
                  Not Connected
                </Badge>
              </div>
              <Button className='w-full'>Connect LinkedIn</Button>
            </CardContent>
          </Card>

          {/* Smartlead Integration */}
          <Card className='group hover:shadow-md transition-all duration-300'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300'>
                  <svg
                    className='h-6 w-6 text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      fill='none'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <CardTitle className='text-lg font-semibold text-gray-900 mb-1'>
                    Smartlead
                  </CardTitle>
                  <CardDescription className='text-gray-600 text-sm'>
                    Automated email outreach and sequences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'>
                <span className='text-xs font-medium text-gray-700'>
                  Status
                </span>
                <Badge
                  variant={smartleadToken ? 'default' : 'secondary'}
                  className={
                    smartleadToken
                      ? 'bg-green-100 text-green-800 text-xs'
                      : 'bg-gray-100 text-gray-600 text-xs'
                  }
                >
                  {smartleadToken ? '✓ Connected' : 'Not Connected'}
                </Badge>
              </div>
              <div className='space-y-3'>
                <div>
                  <label className='text-xs font-medium text-gray-700 mb-1 block'>
                    API Token
                  </label>
                  <Input
                    type='password'
                    placeholder='Enter your Smartlead API token'
                    value={smartleadToken}
                    onChange={e => setSmartleadToken(e.target.value)}
                    className='w-full text-sm'
                  />
                </div>
                <div className='text-xs text-gray-500 bg-blue-50 p-2 rounded-lg'>
                  <p className='mb-1'>
                    <strong>Get your API token:</strong>
                  </p>
                  <p>1. Log in to your Smartlead dashboard</p>
                  <p>2. Go to Settings → API</p>
                  <p>3. Generate or copy your API token</p>
                </div>
              </div>
              <Button
                className='w-full'
                onClick={handleConnectSmartlead}
                disabled={smartleadLoading || !smartleadToken.trim()}
              >
                {smartleadLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : smartleadToken ? (
                  'Update Token'
                ) : (
                  'Connect Smartlead'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
