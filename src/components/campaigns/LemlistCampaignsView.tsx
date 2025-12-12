/**
 * Lemlist Campaigns View
 * 
 * Displays campaigns from lemlist (read-only, cannot create)
 * Matches the layout and design of the Email campaigns tab
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, RefreshCw, ExternalLink, Search, Mail, MailOpen, Reply, DollarSign, AlertTriangle, Target, Edit, Plus, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { getLemlistCampaigns } from '@/services/lemlistWorkflowService';
import { useAuth } from '@/contexts/AuthContext';
import { lemlistService, type LemlistCampaign } from '@/services/lemlistService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  running: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  draft: 'bg-gray-100 text-foreground',
};

interface LemlistCampaignAnalytics {
  total_sent: number;
  total_opened: number;
  total_replied: number;
  total_bounced: number;
  total_positive_replies: number;
}

export function LemlistCampaignsView() {
  const { user } = useAuth();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<LemlistCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [campaignAnalytics, setCampaignAnalytics] = useState<
    Record<string, LemlistCampaignAnalytics>
  >({});
  const [showAddLeadsDialog, setShowAddLeadsDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<LemlistCampaign | null>(null);

  const handleAddLeadsClick = (e: React.MouseEvent, campaign: LemlistCampaign) => {
    e.stopPropagation(); // Prevent row click
    setSelectedCampaign(campaign);
    setShowAddLeadsDialog(true);
  };

  const handleGoToPeople = () => {
    setShowAddLeadsDialog(false);
    router.push('/people');
  };

  const loadCampaigns = async (showRefreshing = false) => {
    if (!user) {
      setError('Please sign in to view campaigns');
      setLoading(false);
      return;
    }

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const loadedCampaigns = await getLemlistCampaigns(user.id);
      
      // Fetch email counts for campaigns (not available in list endpoint)
      // Process sequentially with rate limiting to avoid overwhelming API
      const campaignsWithCounts: LemlistCampaign[] = [];
      for (const campaign of loadedCampaigns) {
        try {
          const detail = await lemlistService.getCampaignDetail(campaign.id);
          campaignsWithCounts.push({ 
            ...campaign, 
            emailCount: detail.emailCount || campaign.emailCount || 0 
          });
          // Rate limiting: small delay between requests
          if (loadedCampaigns.indexOf(campaign) < loadedCampaigns.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch {
          campaignsWithCounts.push(campaign);
        }
      }
      
      setCampaigns(campaignsWithCounts);
      
      // Load analytics for all campaigns
      await loadCampaignAnalytics(campaignsWithCounts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
      setError(errorMessage);
      if (!showRefreshing) {
        toast.error('Failed to load Lemlist campaigns', {
          description: errorMessage,
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Load campaign analytics for all campaigns
   * Best practices:
   * - Implements rate limiting (200ms delay between requests)
   * - Gracefully handles errors (returns zeros instead of blocking UI)
   * - Processes campaigns sequentially to avoid overwhelming API
   */
  const loadCampaignAnalytics = async (campaignsToLoad: LemlistCampaign[]) => {
    if (!campaignsToLoad || campaignsToLoad.length === 0) return;

    const analyticsMap: Record<string, LemlistCampaignAnalytics> = {};

    // Load stats for each campaign sequentially with rate limiting
    // Per best practices: add delay between requests to respect rate limits
    for (const campaign of campaignsToLoad) {
      try {
        const stats = await lemlistService.getCampaignStats(campaign.id);
        analyticsMap[campaign.id] = {
          total_sent: stats.total_sent,
          total_opened: stats.total_opened,
          total_replied: stats.total_replied,
          total_bounced: stats.total_bounced,
          total_positive_replies: stats.total_positive_replies,
        };
        
        // Rate limiting: 200ms delay between requests (best practice)
        // Prevents hitting API rate limits
        if (campaignsToLoad.indexOf(campaign) < campaignsToLoad.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        // Best practice: Gracefully handle errors - use zeros instead of blocking UI
        analyticsMap[campaign.id] = {
          total_sent: 0,
          total_opened: 0,
          total_replied: 0,
          total_bounced: 0,
          total_positive_replies: 0,
        };
      }
    }

    setCampaignAnalytics(analyticsMap);
  };

  useEffect(() => {
    loadCampaigns();
  }, [user]);

  // Memoized filtered campaigns for better performance
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch =
        !searchTerm ||
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || 
        campaign.status === statusFilter ||
        (statusFilter === 'active' && campaign.status === 'running');

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.includes('credentials not found') ? (
              <div className="space-y-2">
                <p>Please connect Lemlist in Settings first.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/settings/integrations', '_blank')}
                >
                  Go to Settings
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadCampaigns(true)}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </>
                  )}
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section with Filters and Search - Matching Email Tab */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          {/* Filter Dropdown */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[200px] h-8 border-gray-300'>
              <SelectValue placeholder='All Campaigns' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Campaigns</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='running'>Running</SelectItem>
              <SelectItem value='paused'>Paused</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
            </SelectContent>
          </Select>

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

        {/* Refresh Button */}
        <Button
          variant="outline"
          onClick={() => loadCampaigns(true)}
          disabled={refreshing}
          className='h-8'
        >
          {refreshing ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className='h-4 w-4 mr-2' />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Campaign Details and Report - Matching Email Tab Layout */}
      {loading ? (
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='bg-gray-100 rounded-lg h-20 animate-pulse'
            ></div>
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Target className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No campaigns found</h3>
            <p className='text-muted-foreground text-center mb-4'>
              {searchTerm
                ? 'No campaigns match your search criteria.'
                : 'Create campaigns in Lemlist to see them here.'}
            </p>
            {!searchTerm && (
              <Button
                variant="outline"
                onClick={() => window.open('https://app.lemlist.com', '_blank')}
              >
                <ExternalLink className='h-4 w-4 mr-2' />
                Open Lemlist
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className='bg-white rounded-lg border border-gray-300 overflow-hidden'>
          {/* Campaign Details and Report Header */}
          <div className='bg-gray-50 border-b border-gray-300 px-6 py-3'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-foreground'>
                Campaign Details
              </h3>
              <h3 className='text-lg font-semibold text-foreground'>Report</h3>
            </div>
          </div>

          {/* Campaign Rows */}
          <div className='divide-y divide-gray-300'>
            {filteredCampaigns.map(campaign => {
              const statusColor =
                STATUS_COLORS[
                  (campaign.status === 'running' ? 'active' : campaign.status) as keyof typeof STATUS_COLORS
                ] || 'bg-gray-100 text-foreground';
              const analytics = campaignAnalytics[campaign.id] || {
                total_sent: 0,
                total_opened: 0,
                total_replied: 0,
                total_bounced: 0,
                total_positive_replies: 0,
              };

              return (
                <div
                  key={campaign.id}
                  className='px-6 py-3 hover:bg-gray-50 transition-colors'
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
                            <h4 
                              className='text-sm font-medium text-purple-600 hover:text-purple-700 cursor-pointer'
                              onClick={() => window.open('https://app.lemlist.com', '_blank')}
                            >
                              {campaign.name}
                            </h4>
                            <ExternalLink className='h-3 w-3 text-gray-400' />
                          </div>
                          <div className='flex items-center space-x-2 text-xs text-gray-500 mt-1'>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                            >
                              {campaign.status === 'running' ? 'Active' : campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </span>
                            <span>•</span>
                            <span>
                              Created At:{' '}
                              {format(
                                new Date(campaign.createdAt),
                                'dd MMM, hh:mm a'
                              )}
                            </span>
                            <span>•</span>
                            <span>{campaign.emailCount} email{campaign.emailCount !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions and Statistics */}
                    <div className='flex items-center space-x-4'>
                      {/* Add Leads Button - 2025 Best Practice: Simple, clear action button */}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={(e) => handleAddLeadsClick(e, campaign)}
                        className='h-8 gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Add Leads
                      </Button>

                      {/* Statistics - Matching Email Tab */}
                      <div className='flex items-center space-x-6'>
                        <div className='flex flex-col items-center justify-center min-w-[80px]'>
                          <div className='text-2xl font-bold text-purple-600'>
                            {analytics.total_sent}
                          </div>
                          <div className='flex items-center gap-1 mt-1'>
                            <Mail className='h-4 w-4 text-gray-500' />
                            <span className='text-xs text-gray-600'>Sent</span>
                          </div>
                        </div>
                        <div className='flex flex-col items-center justify-center min-w-[80px]'>
                          <div className='text-2xl font-bold text-purple-600'>
                            {analytics.total_opened}
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
                            {analytics.total_replied}
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
                            {analytics.total_positive_replies}
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
                            {analytics.total_bounced}
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
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Leads Dialog - Simple 2025 Best Practice Pattern */}
      <Dialog open={showAddLeadsDialog} onOpenChange={setShowAddLeadsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Add Leads to Campaign
            </DialogTitle>
            <DialogDescription>
              Add people to <strong>{selectedCampaign?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add leads to <strong>{selectedCampaign?.name}</strong> using one of these methods:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Method 1: From People Page (Recommended)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground ml-2">
                    <li>Go to the People page</li>
                    <li>Select people you want to add</li>
                    <li>Use workflows to add them to this Lemlist campaign</li>
                  </ol>
                </div>

                <div className="p-3 border rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Method 2: Direct in Lemlist
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Open this campaign in Lemlist and add leads directly there.
                  </p>
                </div>
              </div>
            </div>
            
            <Alert>
              <AlertDescription className="text-xs">
                <strong>Note:</strong> Only people with email addresses can be added to Lemlist campaigns.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddLeadsDialog(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              onClick={handleGoToPeople}
              className="gap-2 w-full sm:w-auto"
            >
              Go to People Page
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddLeadsDialog(false);
                window.open('https://app.lemlist.com', '_blank');
              }}
              className="gap-2 w-full sm:w-auto"
            >
              Open in Lemlist
              <ExternalLink className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

