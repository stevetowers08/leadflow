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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useCampaignSequences } from '@/hooks/useCampaignSequences';
import { supabase } from '@/integrations/supabase/client';
import { CampaignSequence } from '@/types/campaign.types';
import { format } from 'date-fns';
import { getErrorMessage } from '@/lib/utils';
import {
  AlertTriangle,
  DollarSign,
  Edit,
  ExternalLink,
  Mail,
  MailOpen,
  Plus,
  Reply,
  Search,
  Target,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LemlistCampaignsView } from '@/components/campaigns/LemlistCampaignsView';

// Client-side mount guard wrapper
const Campaigns: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return <CampaignsContent />;
};

const STATUS_COLORS = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-success/10 text-success',
  paused: 'bg-warning/10 text-warning',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-destructive/10 text-destructive',
};

interface CampaignAnalytics {
  total_sent: number;
  total_opened: number;
  total_replied: number;
  total_bounced: number;
  total_positive_replies: number;
  total_sender_bounced: number;
}

function CampaignsContent() {
  const router = useRouter();
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
        // Get email sends for this campaign sequence from campaign_sequence_executions
        // Campaign sequences removed - not in PDR. Use workflows and activity_log instead.
        // For now, return empty analytics since the feature is not implemented
        interface EmailSend {
          status?: string;
          opened_at?: string | null;
          replied_at?: string | null;
          bounced_at?: string | null;
        }
        const emailSends: EmailSend[] = [];
        // const { data: emailSends } = await supabase
        //   .from('campaign_sequence_executions')
        //   .select('status, opened_at, clicked_at, replied_at, bounced_at')
        //   .eq('sequence_id', sequence.id);

        const analytics: CampaignAnalytics = {
          total_sent:
            emailSends.filter(
              es => es.status === 'sent' || es.status === 'delivered'
            ).length || 0,
          total_opened: emailSends.filter(es => es.opened_at).length || 0,
          total_replied: emailSends.filter(es => es.replied_at).length || 0,
          total_bounced:
            emailSends.filter(es => es.status === 'bounced' || es.bounced_at)
              .length || 0,
          total_positive_replies: 0, // Would need sentiment analysis from activity_log metadata
          total_sender_bounced: 0,
        };

        // Get replies from activity_log for leads in this sequence
        // Campaign sequences removed - not in PDR
        // Campaign sequences removed - not in PDR. Use workflows and activity_log instead.
        interface SequenceLead {
          lead_id: string;
        }
        const sequenceLeads: SequenceLead[] = [];
        // const { data: sequenceLeads } = await supabase
        //   .from('campaign_sequence_leads')
        //   .select('lead_id')
        //   .eq('sequence_id', sequence.id);

        if (sequenceLeads.length > 0) {
          const leadIds = sequenceLeads.map(l => l.lead_id);

          // Get email replies from activity_log
          const { data: replies } = await supabase
            .from('activity_log')
            .select('id, metadata')
            .in('lead_id', leadIds)
            .eq('activity_type', 'email_replied');

          if (replies) {
            analytics.total_replied = replies.length;
            // Check metadata for sentiment if available
            analytics.total_positive_replies = replies.filter(
              r =>
                (r.metadata as { sentiment?: string })?.sentiment === 'positive'
            ).length;
          }
        }

        analyticsMap[sequence.id] = analytics;
      }

      if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
        console.log('≡ƒôè Analytics loaded:', analyticsMap);
      }
      setCampaignAnalytics(analyticsMap);
    };

    if (!isLoading && sequences) {
      loadAnalytics();
    }
  }, [sequences, isLoading]);

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
    console.log('🔵 Create campaign button clicked');
    try {
      console.log('🟢 Starting campaign creation...');
      const newSequence = await createSequence.mutateAsync({
        name: 'Untitled Campaign',
        description: '',
        status: 'draft',
      });
      console.log('✅ Campaign created:', newSequence);
      // Use workflows route if we're on /workflows, otherwise use campaigns
      const basePath = window.location.pathname.startsWith('/workflows')
        ? '/workflows'
        : '/campaigns';
      const targetPath = `${basePath}/sequence/${newSequence.id}`;
      console.log('🔄 Navigating to:', targetPath);
      router.push(targetPath);
    } catch (error) {
      console.error('❌ Error creating campaign:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: 'Error',
        description: `Failed to create campaign sequence: ${errorMessage}`,
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
    // Use workflows route if we're on /workflows, otherwise use campaigns
    const basePath = window.location.pathname.startsWith('/workflows')
      ? '/workflows'
      : '/campaigns';
    router.push(`${basePath}/sequence/${sequence.id}`);
  };

  return (
    <Page title='Campaigns' hideHeader>
      <Tabs defaultValue='email' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='email'>Email</TabsTrigger>
          <TabsTrigger value='lemlist'>Lemlist</TabsTrigger>
        </TabsList>

        {/* Email Tab */}
        <TabsContent value='email' className='space-y-4'>
          {/* Header Section with Filters and Search */}
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              {/* Filter Dropdown */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[200px] h-8 border-border'>
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

              {/* Search */}
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search Campaigns'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10 h-8 w-[200px] border-border'
                />
              </div>
            </div>

            {/* Create Campaign Button */}
            <Button
              onClick={handleCreateNewSequence}
              className='h-8'
              disabled={createSequence.isPending}
            >
              <Plus className='h-4 w-4 mr-2' />
              {createSequence.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>

          {/* Campaign Details and Report */}
          {isLoading ? (
            <div className='space-y-4'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='bg-muted rounded-lg h-20 animate-pulse'
                ></div>
              ))}
            </div>
          ) : filteredSequences.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <Target className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-semibold mb-2'>
                  No campaigns found
                </h3>
                <p className='text-muted-foreground text-center mb-4'>
                  {searchTerm
                    ? 'No campaigns match your search criteria.'
                    : 'Create your first campaign to start organizing your outreach efforts.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={handleCreateNewSequence}
                    disabled={createSequence.isPending}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    {createSequence.isPending
                      ? 'Creating...'
                      : 'Create Your First Campaign'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className='bg-background rounded-lg border border-border overflow-hidden'>
              {/* Campaign Details and Report Header */}
              <div className='bg-muted border-b border-border px-6 py-3'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-lg font-semibold text-foreground'>
                    Campaign Details
                  </h3>
                  <h3 className='text-lg font-semibold text-foreground'>
                    Report
                  </h3>
                </div>
              </div>

              {/* Campaign Rows */}
              <div className='divide-y divide-border'>
                {filteredSequences.map(sequence => {
                  const statusColor =
                    STATUS_COLORS[
                      sequence.status as keyof typeof STATUS_COLORS
                    ] || 'bg-muted text-muted-foreground';

                  return (
                    <div
                      key={sequence.id}
                      className='px-6 py-3 hover:bg-muted transition-colors cursor-pointer'
                      onClick={() => handleOpenSequenceBuilder(sequence)}
                    >
                      <div className='flex items-center justify-between'>
                        {/* Campaign Details */}
                        <div className='flex items-center space-x-4 flex-1'>
                          <div className='flex items-center space-x-3'>
                            <div className='w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border'>
                              <Edit className='h-4 w-4 text-muted-foreground' />
                            </div>
                            <div>
                              <div className='flex items-center space-x-2'>
                                <h4 className='text-sm font-medium text-primary hover:text-primary/80'>
                                  {sequence.name}
                                </h4>
                                <ExternalLink className='h-3 w-3 text-muted-foreground' />
                              </div>
                              <div className='flex items-center space-x-2 text-xs text-muted-foreground mt-1'>
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
                                <span>
                                  {sequence.total_leads || 0} sequences
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Statistics */}
                        <div className='flex items-center space-x-6'>
                          <div className='flex flex-col items-center justify-center min-w-[80px]'>
                            <div className='text-2xl font-bold text-primary'>
                              {campaignAnalytics[sequence.id]?.total_sent || 0}
                            </div>
                            <div className='flex items-center gap-1 mt-1'>
                              <Mail className='h-4 w-4 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                Sent
                              </span>
                            </div>
                          </div>
                          <div className='flex flex-col items-center justify-center min-w-[80px]'>
                            <div className='text-2xl font-bold text-primary'>
                              {campaignAnalytics[sequence.id]?.total_opened ||
                                0}
                            </div>
                            <div className='flex items-center gap-1 mt-1'>
                              <MailOpen className='h-4 w-4 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                Opened
                              </span>
                            </div>
                          </div>
                          <div className='flex flex-col items-center justify-center min-w-[80px]'>
                            <div className='text-2xl font-bold text-primary'>
                              {campaignAnalytics[sequence.id]?.total_replied ||
                                0}
                            </div>
                            <div className='flex items-center gap-1 mt-1'>
                              <Reply className='h-4 w-4 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                Replied
                              </span>
                            </div>
                          </div>
                          <div className='flex flex-col items-center justify-center min-w-[80px]'>
                            <div className='text-2xl font-bold text-success'>
                              {campaignAnalytics[sequence.id]
                                ?.total_positive_replies || 0}
                            </div>
                            <div className='flex items-center gap-1 mt-1'>
                              <DollarSign className='h-4 w-4 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                Positive
                              </span>
                            </div>
                          </div>
                          <div className='flex flex-col items-center justify-center min-w-[80px]'>
                            <div className='text-2xl font-bold text-destructive'>
                              {campaignAnalytics[sequence.id]?.total_bounced ||
                                0}
                            </div>
                            <div className='flex items-center gap-1 mt-1'>
                              <AlertTriangle className='h-4 w-4 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
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
        </TabsContent>

        {/* Lemlist Tab */}
        <TabsContent value='lemlist'>
          <LemlistCampaignsView />
        </TabsContent>
      </Tabs>
    </Page>
  );
}

export default Campaigns;
