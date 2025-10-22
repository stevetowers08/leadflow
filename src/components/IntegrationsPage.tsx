import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { gmailService } from '@/services/gmailService';
import { toast } from '@/utils/simpleToast';
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          {/* Work Management Integration */}
          <Card className='group hover:shadow-md transition-all duration-300 h-48'>
            <CardHeader className='pb-3'>
              <div className='flex items-start gap-3'>
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
                    Work management
                  </CardTitle>
                  <CardDescription className='text-gray-600 text-sm'>
                    Streamline and manage any kind of work
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex justify-end'>
              <Badge
                variant='default'
                className='bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full'
              >
                ✓ Active
              </Badge>
            </CardContent>
          </Card>

          {/* CRM Integration */}
          <Card className='group hover:shadow-md transition-all duration-300 h-48'>
            <CardHeader className='pb-3'>
              <div className='flex items-start gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300'>
                  <svg
                    className='h-6 w-6 text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <circle
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='2'
                      fill='none'
                    />
                    <path
                      d='M8 12h8M12 8v8'
                      stroke='currentColor'
                      strokeWidth='2'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <CardTitle className='text-lg font-semibold text-gray-900 mb-1'>
                    CRM
                  </CardTitle>
                  <CardDescription className='text-gray-600 text-sm'>
                    Automate sales cycles to close more deals
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex justify-end'>
              <Button variant='outline' size='sm' className='text-xs px-3 py-1'>
                Open
              </Button>
            </CardContent>
          </Card>

          {/* Service Integration */}
          <Card className='group hover:shadow-md transition-all duration-300 h-48'>
            <CardHeader className='pb-3'>
              <div className='flex items-start gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300'>
                  <svg
                    className='h-6 w-6 text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z'
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
                    Service
                  </CardTitle>
                  <div className='flex items-center gap-1 mb-1'>
                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                    <span className='text-xs text-gray-500'>
                      14 day free trial
                    </span>
                  </div>
                  <CardDescription className='text-gray-600 text-sm'>
                    Empower any team to deliver efficient service at scale
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex justify-end'>
              <Button variant='outline' size='sm' className='text-xs px-3 py-1'>
                Learn more
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Dev Integration */}
          <Card className='group hover:shadow-md transition-all duration-300 h-48'>
            <CardHeader className='pb-3'>
              <div className='flex items-start gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300'>
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
                    Dev
                  </CardTitle>
                  <div className='flex items-center gap-1 mb-1'>
                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                    <span className='text-xs text-gray-500'>
                      14 day free trial
                    </span>
                  </div>
                  <CardDescription className='text-gray-600 text-sm'>
                    Accelerate your product from concept to launch
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex justify-end'>
              <Button variant='outline' size='sm' className='text-xs px-3 py-1'>
                Learn more
              </Button>
            </CardContent>
          </Card>

          {/* Empty space for layout consistency */}
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
