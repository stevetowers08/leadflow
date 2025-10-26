import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Search,
  Send,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';

interface EmailSend {
  id: string;
  person_id: string;
  template_id?: string;
  gmail_message_id: string;
  to_email: string;
  subject: string;
  status: 'sent' | 'delivered' | 'failed' | 'bounced';
  sent_at: string;
  delivered_at?: string;
  failed_at?: string;
  error_message?: string;
  person_name?: string;
  template_name?: string;
}

interface EmailStats {
  totalSent: number;
  delivered: number;
  failed: number;
  bounced: number;
  deliveryRate: number;
}

export const EmailDashboard: React.FC = () => {
  const [emailSends, setEmailSends] = useState<EmailSend[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    totalSent: 0,
    delivered: 0,
    failed: 0,
    bounced: 0,
    deliveryRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  useEffect(() => {
    loadEmailData();
  }, [dateRange]);

  const loadEmailData = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      const daysBack = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date(
        now.getTime() - daysBack * 24 * 60 * 60 * 1000
      );

      // Load email sends with person and template data
      const { data, error } = await supabase
        .from('email_sends')
        .select(
          `
          *,
          people:person_id(name),
          email_templates:template_id(name)
        `
        )
        .gte('sent_at', startDate.toISOString())
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Failed to load email data:', error);
        return;
      }

      // Transform data
      const transformedData =
        data?.map(send => ({
          ...send,
          person_name: send.people?.name,
          template_name: send.email_templates?.name,
        })) || [];

      setEmailSends(transformedData);
      calculateStats(transformedData);
    } catch (error) {
      console.error('Failed to load email data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: EmailSend[]) => {
    const totalSent = data.length;
    const delivered = data.filter(send => send.status === 'delivered').length;
    const failed = data.filter(send => send.status === 'failed').length;
    const bounced = data.filter(send => send.status === 'bounced').length;
    const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0;

    setStats({
      totalSent,
      delivered,
      failed,
      bounced,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'failed':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'bounced':
        return <XCircle className='h-4 w-4 text-orange-500' />;
      default:
        return <Clock className='h-4 w-4 text-blue-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'bounced':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredEmails = emailSends.filter(email => {
    const matchesSearch =
      email.to_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.person_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.template_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || email.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='animate-pulse'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-8 bg-gray-200 rounded w-1/2'></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Sent</CardTitle>
            <Send className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalSent}</div>
            <p className='text-xs text-muted-foreground'>
              Emails sent in last {dateRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Delivered</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {stats.delivered}
            </div>
            <p className='text-xs text-muted-foreground'>
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Failed</CardTitle>
            <XCircle className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {stats.failed}
            </div>
            <p className='text-xs text-muted-foreground'>Failed to deliver</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Delivery Rate</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.deliveryRate}%</div>
            <p className='text-xs text-muted-foreground'>Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='flex-1'>
              <Label htmlFor='search'>Search</Label>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='search'
                  placeholder='Search by email, subject, person, or template...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <div className='sm:w-48'>
              <Label htmlFor='status'>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='sent'>Sent</SelectItem>
                  <SelectItem value='delivered'>Delivered</SelectItem>
                  <SelectItem value='failed'>Failed</SelectItem>
                  <SelectItem value='bounced'>Bounced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='sm:w-48'>
              <Label htmlFor='dateRange'>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select range' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='7d'>Last 7 days</SelectItem>
                  <SelectItem value='30d'>Last 30 days</SelectItem>
                  <SelectItem value='90d'>Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email List */}
          <ScrollArea className='h-[600px]'>
            <div className='space-y-4'>
              {filteredEmails.length === 0 ? (
                <div className='text-center py-8'>
                  <Mail className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
                  <h3 className='text-lg font-medium mb-2'>No emails found</h3>
                  <p className='text-muted-foreground'>
                    {emailSends.length === 0
                      ? 'No emails have been sent yet'
                      : 'Try adjusting your search or filter criteria'}
                  </p>
                </div>
              ) : (
                filteredEmails.map(email => (
                  <Card
                    key={email.id}
                    className='hover:shadow-md transition-shadow'
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2 flex-1'>
                          <div className='flex items-center gap-2'>
                            <h4 className='font-medium'>{email.subject}</h4>
                            <Badge className={getStatusColor(email.status)}>
                              {email.status}
                            </Badge>
                          </div>
                          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                            <div className='flex items-center gap-1'>
                              <Users className='h-4 w-4' />
                              <span>{email.person_name || 'Unknown'}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Mail className='h-4 w-4' />
                              <span>{email.to_email}</span>
                            </div>
                            {email.template_name && (
                              <div className='flex items-center gap-1'>
                                <span>Template: {email.template_name}</span>
                              </div>
                            )}
                          </div>
                          {email.error_message && (
                            <div className='text-sm text-red-600 bg-red-50 p-2 rounded'>
                              Error: {email.error_message}
                            </div>
                          )}
                        </div>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          {getStatusIcon(email.status)}
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            <span>{formatDate(email.sent_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
