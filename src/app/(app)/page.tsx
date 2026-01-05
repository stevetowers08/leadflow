'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getLeadStats, getLeads } from '@/services/leadsService';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import {
  Users,
  Flame,
  Zap,
  Snowflake,
  Clock,
  Building2,
  Briefcase,
} from 'lucide-react';
import { toast } from '@/utils/toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types/database';

/**
 * Overview Page - PDR Section 5.2
 *
 * Key Metrics + Recent Leads Feed
 * Simple MVP dashboard
 */
const OverviewPage = React.memo(function OverviewPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle OAuth errors from callback route
  useEffect(() => {
    const authError = searchParams.get('auth_error');
    const errorDescription = searchParams.get('error_description');

    if (authError) {
      // Show user-friendly error message
      let errorMessage = 'Authentication failed';

      switch (authError) {
        case 'exchange_failed':
          errorMessage = 'Failed to complete sign-in. Please try again.';
          break;
        case 'no_session':
          errorMessage =
            'Session could not be created. Please try signing in again.';
          break;
        case 'unexpected_error':
          errorMessage =
            errorDescription || 'An unexpected error occurred during sign-in.';
          break;
        default:
          errorMessage = errorDescription || 'Authentication error occurred.';
      }

      toast.error('Sign-in Failed', {
        description: errorMessage,
        duration: 8000,
      });

      // Clean up URL params
      const url = new URL(window.location.href);
      url.searchParams.delete('auth_error');
      url.searchParams.delete('error_description');
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);

  const { data: stats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: () => getLeadStats(),
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 5 * 60 * 1000, // Cache stats for 5 minutes (less frequently changing)
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  const { data: recentLeads = [] } = useQuery({
    queryKey: ['recent-leads'],
    queryFn: () => getLeads({ limit: 10 }),
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
  });

  return (
    <div className='h-full overflow-y-auto'>
      <div className='max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6'>
        {/* Section 1: Key Metrics */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* Total Leads */}
          <Card className='rounded-xl'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Total Leads
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>{stats?.total || 0}</div>
              <p className='text-xs text-muted-foreground mt-1'>
                All captured leads
              </p>
            </CardContent>
          </Card>

          {/* Hot Leads */}
          <Card className='rounded-xl'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Hot Leads
              </CardTitle>
              <Flame className='h-4 w-4 text-destructive' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-destructive'>
                {stats?.hot || 0}
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                High priority
              </p>
            </CardContent>
          </Card>

          {/* Warm Leads */}
          <Card className='rounded-xl'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Warm Leads
              </CardTitle>
              <Zap className='h-4 w-4 text-warning' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-warning'>
                {stats?.warm || 0}
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Medium priority
              </p>
            </CardContent>
          </Card>

          {/* Cold Leads */}
          <Card className='rounded-xl'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Cold Leads
              </CardTitle>
              <Snowflake className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-muted-foreground'>
                {stats?.cold || 0}
              </div>
              <p className='text-xs text-muted-foreground mt-1'>Low priority</p>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Recent Leads */}
        <Card className='rounded-xl'>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[400px]'>
              {recentLeads.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-64 text-center'>
                  <Users className='h-12 w-12 text-muted-foreground mb-4' />
                  <p className='text-muted-foreground'>No leads captured yet</p>
                  <p className='text-sm text-muted-foreground mt-2'>
                    Start by capturing your first business card
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {recentLeads.map(lead => {
                    const name =
                      [lead.first_name, lead.last_name]
                        .filter(Boolean)
                        .join(' ') || 'Unknown';
                    const initials = name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    const quality = lead.quality_rank || 'warm';
                    const qualityVariants = {
                      hot: {
                        icon: Flame,
                        className:
                          'bg-destructive/10 text-destructive border-destructive/20',
                      },
                      warm: {
                        icon: Zap,
                        className:
                          'bg-warning/10 text-warning border-warning/20',
                      },
                      cold: {
                        icon: Snowflake,
                        className:
                          'bg-muted text-muted-foreground border-border',
                      },
                    };
                    const qualityVariant =
                      qualityVariants[quality] || qualityVariants.warm;
                    const QualityIcon = qualityVariant.icon;

                    return (
                      <div
                        key={lead.id}
                        className='flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-pointer group'
                        onClick={() => router.push(`/leads?leadId=${lead.id}`)}
                      >
                        <Avatar className='h-12 w-12 border-2 border-border/50 group-hover:border-border transition-colors'>
                          <AvatarFallback className='text-sm font-semibold'>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0 space-y-1.5'>
                          <div className='flex items-center gap-2'>
                            <p className='text-sm font-semibold text-foreground truncate'>
                              {name}
                            </p>
                            {lead.quality_rank && (
                              <Badge
                                variant='outline'
                                className={cn(
                                  'h-5 px-2 text-xs',
                                  qualityVariant.className
                                )}
                              >
                                <QualityIcon className='h-3 w-3 mr-1' />
                                {quality.charAt(0).toUpperCase() +
                                  quality.slice(1)}
                              </Badge>
                            )}
                          </div>
                          <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                            {lead.company && (
                              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                                <Building2 className='h-3.5 w-3.5 flex-shrink-0' />
                                <span className='truncate max-w-[200px]'>
                                  {lead.company}
                                </span>
                              </div>
                            )}
                            {lead.job_title && (
                              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                                <Briefcase className='h-3.5 w-3.5 flex-shrink-0' />
                                <span className='truncate max-w-[200px]'>
                                  {lead.job_title}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='flex flex-col items-end gap-1.5 flex-shrink-0'>
                          {lead.created_at && (
                            <div className='flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap'>
                              <Clock className='h-3.5 w-3.5' />
                              <span>
                                {formatDistanceToNow(
                                  new Date(lead.created_at),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default OverviewPage;
