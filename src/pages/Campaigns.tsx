import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useCampaignSequences } from '@/hooks/useCampaignSequences';
import { supabase } from '@/integrations/supabase/client';
import { CampaignSequence } from '@/types/campaign.types';
import { format } from 'date-fns';
import {
  AlertTriangle,
  DollarSign,
  Edit,
  ExternalLink,
  Filter,
  Mail,
  MailOpen,
  Plus,
  Reply,
  Search,
  Target,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface CampaignAnalytics {
  total_sent: number;
  total_opened: number;
  total_replied: number;
  total_bounced: number;
  total_positive_replies: number;
  total_sender_bounced: number;
}

export default function Campaigns() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignAnalytics, setCampaignAnalytics] = useState<
    Record<string, CampaignAnalytics>
  >({});

  const { toast } = useToast();
  const { sequences, isLoading, createSequence, deleteSequence } =
    useCampaignSequences();

  // Load analytics for all campaigns
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!sequences || sequences.length === 0) return;

      const analyticsMap: Record<string, CampaignAnalytics> = {};

      for (const sequence of sequences) {
        // Get email sends for this campaign sequence from metadata
        const { data: emailSends } = await supabase
          .from('email_sends')
          .select('status, metadata')
          .eq('metadata->>campaign_sequence_id', sequence.id);

        const analytics: CampaignAnalytics = {
          total_sent: emailSends?.length || 0,
          total_opened: 0, // Gmail API doesn't track opens
          total_replied: 0,
          total_bounced:
            emailSends?.filter(es => es.status === 'bounced').length || 0,
          total_positive_replies: 0,
          total_sender_bounced: 0,
        };

        // Get replies for people in this sequence
        const { data: sequenceLeads } = await supabase
          .from('campaign_sequence_leads')
          .select('lead_id')
          .eq('sequence_id', sequence.id);

        if (sequenceLeads && sequenceLeads.length > 0) {
          const leadIds = sequenceLeads.map(l => l.lead_id);

          // Get email replies for these leads
          const { data: replies } = await supabase
            .from('email_replies')
            .select('id, sentiment')
            .in('person_id', leadIds);

          if (replies) {
            analytics.total_replied = replies.length;
            analytics.total_positive_replies = replies.filter(
              r => r.sentiment === 'positive'
            ).length;
          }
        }

        analyticsMap[sequence.id] = analytics;
      }

      console.log('📊 Analytics loaded:', analyticsMap);
      setCampaignAnalytics(analyticsMap);
    };

    if (!isLoading && sequences) {
      loadAnalytics();
    }
  }, [sequences, isLoading]);

  // Debug logging
  console.log('🔍 Campaigns page - sequences:', sequences);
  console.log('🔍 Campaigns page - isLoading:', isLoading);
  console.log('🔍 Campaigns page - sequences length:', sequences?.length);
  console.log('📊 Campaign analytics state:', campaignAnalytics);

  // Memoized filtered sequences for better performance
  const filteredSequences = useMemo(() => {
    return sequences.filter(sequence => {
      const matchesSearch =
        !searchTerm ||
        sequence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sequence.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || sequence.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sequences, searchTerm, statusFilter]);

  const handleCreateNewSequence = async () => {
    try {
      const newSequence = await createSequence.mutateAsync({
        name: 'Untitled Campaign',
        description: '',
        status: 'draft',
      });
      navigate(`/campaigns/sequence/${newSequence.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create sequence. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (sequence: CampaignSequence) => {
    if (confirm(`Are you sure you want to delete "${sequence.name}"?`)) {
      try {
        await deleteSequence.mutateAsync(sequence.id);
        toast({
          title: 'Sequence Deleted',
          description: 'Campaign sequence has been deleted successfully.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete campaign sequence.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleOpenSequenceBuilder = (sequence: CampaignSequence) => {
    navigate(`/campaigns/sequence/${sequence.id}`);
  };

  return (
    <Page title='Campaigns' hideHeader>
      <div className='space-y-4'>
        {/* Header Section with Filters and Search */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            {/* Filter Dropdown */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[200px] h-8 border-gray-300'>
                <SelectValue placeholder='All Campaigns' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Campaigns</SelectItem>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='paused'>Paused</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Icon */}
            <Button
              variant='outline'
              size='sm'
              className='h-8 w-8 p-0 border-gray-300'
            >
              <Filter className='h-4 w-4' />
            </Button>

            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search Campaigns'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 h-8 w-[200px] border-gray-300'
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2'>
            <Button
              onClick={handleCreateNewSequence}
              className='h-8 bg-purple-600 hover:bg-purple-700 text-white'
            >
              <Plus className='h-4 w-4 mr-2' />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Campaign Tabs */}
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8'>
            <button className='border-b-2 border-purple-500 py-2 px-1 text-sm font-medium text-purple-600'>
              All Campaigns ({sequences.length})
            </button>
            <button className='border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'>
              Folders
            </button>
          </nav>
        </div>

        {/* Campaign Details and Report */}
        {isLoading ? (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='bg-gray-100 rounded-lg h-20 animate-pulse'
              ></div>
            ))}
          </div>
        ) : filteredSequences.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Target className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No campaigns found</h3>
              <p className='text-muted-foreground text-center mb-4'>
                {searchTerm
                  ? 'No campaigns match your search criteria.'
                  : 'Create your first campaign to start organizing your outreach efforts.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateNewSequence}>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Your First Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className='bg-white rounded-lg border border-gray-300 overflow-hidden'>
            {/* Campaign Details and Report Header */}
            <div className='bg-gray-50 border-b border-gray-300 px-6 py-3'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Campaign Details
                </h3>
                <h3 className='text-lg font-semibold text-gray-900'>Report</h3>
              </div>
            </div>

            {/* Campaign Rows */}
            <div className='divide-y divide-gray-300'>
              {filteredSequences.map(sequence => {
                const statusColor =
                  STATUS_COLORS[
                    sequence.status as keyof typeof STATUS_COLORS
                  ] || 'bg-gray-100 text-gray-800';

                return (
                  <div
                    key={sequence.id}
                    className='px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer'
                    onClick={() => handleOpenSequenceBuilder(sequence)}
                  >
                    <div className='flex items-center justify-between'>
                      {/* Campaign Details */}
                      <div className='flex items-center space-x-4 flex-1'>
                        <div className='flex items-center space-x-3'>
                          <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
                            <Edit className='h-4 w-4 text-gray-600' />
                          </div>
                          <div>
                            <div className='flex items-center space-x-2'>
                              <h4 className='text-sm font-medium text-purple-600 hover:text-purple-700'>
                                {sequence.name}
                              </h4>
                              <ExternalLink className='h-3 w-3 text-gray-400' />
                            </div>
                            <div className='flex items-center space-x-2 text-xs text-gray-500 mt-1'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                {sequence.status.charAt(0).toUpperCase() +
                                  sequence.status.slice(1)}
                              </span>
                              <span>•</span>
                              <span>
                                Created At:{' '}
                                {format(
                                  new Date(sequence.created_at),
                                  'dd MMM, hh:mm a'
                                )}
                              </span>
                              <span>•</span>
                              <span>{sequence.total_leads || 0} sequences</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className='flex items-center space-x-6'>
                        <div className='flex flex-col items-center justify-center min-w-[80px]'>
                          <div className='text-2xl font-bold text-purple-600'>
                            {campaignAnalytics[sequence.id]?.total_sent || 0}
                          </div>
                          <div className='flex items-center gap-1 mt-1'>
                            <Mail className='h-4 w-4 text-gray-500' />
                            <span className='text-xs text-gray-600'>Sent</span>
                          </div>
                        </div>
                        <div className='flex flex-col items-center justify-center min-w-[80px]'>
                          <div className='text-2xl font-bold text-purple-600'>
                            {campaignAnalytics[sequence.id]?.total_opened || 0}
                          </div>
                          <div className='flex items-center gap-1 mt-1'>
                            <MailOpen className='h-4 w-4 text-gray-500' />
                            <span className='text-xs text-gray-600'>
                              Opened
                            </span>
                          </div>
                        </div>
                        <div className='flex flex-col items-center justify-center min-w-[80px]'>
                          <div className='text-2xl font-bold text-blue-500'>
                            {campaignAnalytics[sequence.id]?.total_replied || 0}
                          </div>
                          <div className='flex items-center gap-1 mt-1'>
                            <Reply className='h-4 w-4 text-gray-500' />
                            <span className='text-xs text-gray-600'>
                              Replied
                            </span>
                          </div>
                        </div>
                        <div className='flex flex-col items-center justify-center min-w-[80px]'>
                          <div className='text-2xl font-bold text-green-600'>
                            {campaignAnalytics[sequence.id]
                              ?.total_positive_replies || 0}
                          </div>
                          <div className='flex items-center gap-1 mt-1'>
                            <DollarSign className='h-4 w-4 text-gray-500' />
                            <span className='text-xs text-gray-600'>
                              Positive
                            </span>
                          </div>
                        </div>
                        <div className='flex flex-col items-center justify-center min-w-[80px]'>
                          <div className='text-2xl font-bold text-red-600'>
                            {campaignAnalytics[sequence.id]?.total_bounced || 0}
                          </div>
                          <div className='flex items-center gap-1 mt-1'>
                            <AlertTriangle className='h-4 w-4 text-gray-500' />
                            <span className='text-xs text-gray-600'>
                              Bounced
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
