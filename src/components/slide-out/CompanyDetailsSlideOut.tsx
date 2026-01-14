'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TabNavigation, TabOption } from '@/components/ui/tab-navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getCompanyLogoUrlSync } from '@/services/logoService';
import { API_URLS } from '@/constants/urls';
import { Company, Lead } from '@/types/database';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { format } from 'date-fns';
import {
  getShowsForCompany,
  linkCompanyToShow,
  unlinkCompanyFromShow,
} from '@/services/showCompaniesService';
import { getShows } from '@/services/showsService';
import { ShowSelector } from '@/components/shared/ShowSelector';
import { SlideOutSection } from './SlideOutSection';
import { X } from 'lucide-react';
import {
  Building2,
  ExternalLink,
  MapPin,
  Users,
  Globe,
  Linkedin,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { SlideOutPanel } from './SlideOutPanel';
import { SlideOutGrid } from './SlideOutGrid';
import { logger } from '@/utils/productionLogger';
import { useRouter } from 'next/navigation';

interface CompanyDetailsSlideOutProps {
  companyId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface GridItem {
  label: string | React.ReactNode;
  value: React.ReactNode;
}

// Reusable company logo display component
const CompanyLogoDisplay: React.FC<{ company: Company; size?: number }> = memo(
  ({ company, size = 24 }) => {
    const [imageError, setImageError] = useState(false);

    // Use cached logo_url if available, filter out Clearbit URLs
    const cachedLogoUrl =
      company.logo_url && !company.logo_url.includes('logo.clearbit.com')
        ? company.logo_url
        : null;

    // Fallback to sync URL generation if no cached logo
    const logoUrl =
      cachedLogoUrl ||
      getCompanyLogoUrlSync(company.name, company.website || undefined);

    // Generate fallback avatar URL
    const fallbackUrl = `${API_URLS.UI_AVATARS}?name=${encodeURIComponent(company.name)}&background=random&size=${size}`;

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    return (
      <div className='flex items-center gap-2'>
        {!imageError && logoUrl ? (
          <div
            className='rounded bg-white flex-shrink-0 border border-border/50'
            style={{ width: `${size}px`, height: `${size}px` }}
          >
            <img
              src={logoUrl}
              alt={company.name}
              className='w-full h-full rounded object-contain block'
              onError={handleImageError}
            />
          </div>
        ) : (
          <img
            src={fallbackUrl}
            alt={company.name}
            className='rounded flex-shrink-0 border border-border/50'
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        )}
        <span className='font-medium'>{company.name}</span>
      </div>
    );
  }
);

CompanyLogoDisplay.displayName = 'CompanyLogoDisplay';

// Company logo header component with proper error handling
const CompanyLogoHeader: React.FC<{ company: Company }> = memo(
  ({ company }) => {
    const [imageError, setImageError] = useState(false);

    // Use cached logo_url if available, filter out Clearbit URLs
    const cachedLogoUrl =
      company.logo_url && !company.logo_url.includes('logo.clearbit.com')
        ? company.logo_url
        : null;

    // Fallback to sync URL generation if no cached logo
    const logoUrl =
      cachedLogoUrl ||
      getCompanyLogoUrlSync(company.name, company.website || undefined);

    // Generate fallback avatar URL - size to match logo
    const fallbackUrl = `${API_URLS.UI_AVATARS}?name=${encodeURIComponent(company.name)}&background=random&size=40`;

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    return (
      <div className='flex items-center gap-3'>
        {!imageError && logoUrl ? (
          <div className='w-10 h-10 rounded-lg bg-white flex-shrink-0 border border-border/50'>
            <img
              src={logoUrl}
              alt={company.name}
              className='w-full h-full rounded-md object-contain'
              onError={handleImageError}
            />
          </div>
        ) : (
          <img
            src={fallbackUrl}
            alt={company.name}
            className='w-10 h-10 rounded-lg flex-shrink-0 border border-border/50'
          />
        )}
        <div className='min-w-0 flex-1'>
          <h2 className='text-lg font-semibold text-foreground truncate leading-tight'>
            {company.name}
          </h2>
          {company.industry && (
            <p className='text-sm text-muted-foreground truncate leading-tight'>
              {company.industry}
            </p>
          )}
        </div>
      </div>
    );
  }
);

CompanyLogoHeader.displayName = 'CompanyLogoHeader';

const CompanyDetailsSlideOutComponent: React.FC<CompanyDetailsSlideOutProps> =
  memo(({ companyId, isOpen, onClose }) => {
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);
    const [relatedLeads, setRelatedLeads] = useState<Lead[]>([]);
    const [companyShows, setCompanyShows] = useState<
      Array<{
        id: string;
        name: string;
        start_date: string | null;
        end_date: string | null;
      }>
    >([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchCompanyDetails = useCallback(async () => {
      if (!companyId || !isOpen) return;

      setLoading(true);
      try {
        // Fetch company
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (companyError) throw companyError;
        setCompany(companyData as unknown as Company);

        // Fetch shows for this company
        try {
          const shows = await getShowsForCompany(companyId);
          setCompanyShows(shows);
        } catch (err) {
          logger.error('Error fetching company shows:', err);
          setCompanyShows([]);
        }

        // Fetch related leads (by company name)
        if (companyData?.name) {
          const { data: leadsData, error: leadsError } = await supabase
            .from('leads')
            .select(
              'id, first_name, last_name, email, phone, company, job_title, status, enrichment_timestamp, enrichment_data, created_at'
            )
            .eq('company', companyData.name)
            .order('created_at', { ascending: false })
            .limit(20);

          if (!leadsError && leadsData) {
            setRelatedLeads(leadsData as Lead[]);
          }
        }
      } catch (error) {
        logger.error('Error fetching company details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load company details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }, [companyId, isOpen, toast]);

    useEffect(() => {
      if (companyId && isOpen) {
        fetchCompanyDetails();
      }
    }, [companyId, isOpen, fetchCompanyDetails]);

    const handleLeadClick = (leadId: string) => {
      onClose();
      router.push(`/leads?id=${leadId}`);
    };

    const companyDetailsItems: GridItem[] = useMemo(
      () =>
        company
          ? [
              {
                label: 'Company Name',
                value: <CompanyLogoDisplay company={company} size={24} />,
              },
              {
                label: 'Industry',
                value: company.industry || '-',
              },
              {
                label: 'Website',
                value: company.website ? (
                  <a
                    href={
                      company.website.startsWith('http')
                        ? company.website
                        : `https://${company.website}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline flex items-center gap-1'
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className='h-3 w-3' />
                  </a>
                ) : (
                  '-'
                ),
              },
              {
                label: 'LinkedIn',
                value: company.linkedin_url ? (
                  <a
                    href={
                      company.linkedin_url.startsWith('http')
                        ? company.linkedin_url
                        : `https://${company.linkedin_url}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline flex items-center gap-1'
                  >
                    Company Page
                    <ExternalLink className='h-3 w-3' />
                  </a>
                ) : (
                  '-'
                ),
              },
              {
                label: 'Head Office',
                value: company.head_office || '-',
              },
              {
                label: 'Company Size',
                value: company.company_size || '-',
              },
              {
                label: (
                  <span className='flex items-center gap-1.5'>
                    <Sparkles className='h-3.5 w-3.5' />
                    AI Score
                  </span>
                ),
                value: company.lead_score ? (
                  <Badge variant='outline' className='rounded-md font-medium'>
                    {company.lead_score}
                  </Badge>
                ) : (
                  '-'
                ),
              },
              {
                label: 'Created',
                value: company.created_at
                  ? format(new Date(company.created_at), 'MMM d, yyyy')
                  : '-',
              },
            ]
          : [],
      [company]
    );

    const handleAddShow = useCallback(async () => {
      if (!selectedShowId || !companyId) return;

      try {
        await linkCompanyToShow(selectedShowId, companyId);
        const shows = await getShowsForCompany(companyId);
        setCompanyShows(shows);
        setSelectedShowId(null);
        toast({
          title: 'Success',
          description: 'Show linked to company',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Failed to link show',
          variant: 'destructive',
        });
      }
    }, [selectedShowId, companyId, toast]);

    const handleRemoveShow = useCallback(
      async (showId: string) => {
        if (!companyId) return;

        try {
          await unlinkCompanyFromShow(showId, companyId);
          const shows = await getShowsForCompany(companyId);
          setCompanyShows(shows);
          toast({
            title: 'Success',
            description: 'Show unlinked from company',
          });
        } catch (error) {
          toast({
            title: 'Error',
            description:
              error instanceof Error ? error.message : 'Failed to unlink show',
            variant: 'destructive',
          });
        }
      },
      [companyId, toast]
    );

    const tabOptions: TabOption[] = useMemo(
      () => [
        {
          id: 'overview',
          label: 'Overview',
          count: 0,
        },
        {
          id: 'leads',
          label: 'Leads',
          count: relatedLeads.length,
        },
      ],
      [relatedLeads.length]
    );

    if (loading) {
      return (
        <SlideOutPanel
          isOpen={isOpen}
          onClose={onClose}
          title='Loading...'
          width='wide'
        >
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          </div>
        </SlideOutPanel>
      );
    }

    if (!company) {
      return (
        <SlideOutPanel
          isOpen={isOpen}
          onClose={onClose}
          title='Company Not Found'
          width='wide'
        >
          <div className='p-6 text-center'>
            <p className='text-muted-foreground'>Company not found</p>
          </div>
        </SlideOutPanel>
      );
    }

    return (
      <SlideOutPanel
        isOpen={isOpen}
        onClose={onClose}
        title={company.name}
        subtitle={company.industry || undefined}
        width='wide'
        customHeader={<CompanyLogoHeader company={company} />}
      >
        <div className='border-b border-border'>
          <TabNavigation
            tabs={tabOptions}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className='flex-1 overflow-y-auto'>
          {activeTab === 'overview' && (
            <div className='p-6 space-y-6'>
              <SlideOutGrid items={companyDetailsItems} />

              {/* Shows Section */}
              <div className='mt-6 pt-6 border-t border-border'>
                <h3 className='text-sm font-semibold text-foreground mb-4 flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  Shows
                </h3>

                {/* Add Show */}
                <div className='flex gap-2 mb-4'>
                  <div className='flex-1'>
                    <ShowSelector
                      value={selectedShowId}
                      onValueChange={setSelectedShowId}
                      className='w-full'
                    />
                  </div>
                  <Button
                    onClick={handleAddShow}
                    disabled={!selectedShowId}
                    size='sm'
                  >
                    Add
                  </Button>
                </div>

                {/* Show List */}
                {companyShows.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No shows linked
                  </p>
                ) : (
                  <div className='space-y-2'>
                    {companyShows.map(show => (
                      <div
                        key={show.id}
                        className='flex items-center justify-between p-2 bg-muted rounded-md border border-border'
                      >
                        <div className='flex-1'>
                          <div className='text-sm font-medium text-foreground'>
                            {show.name}
                          </div>
                          {show.start_date && (
                            <div className='text-xs text-muted-foreground'>
                              {format(new Date(show.start_date), 'MMM d, yyyy')}
                              {show.end_date &&
                                ` - ${format(new Date(show.end_date), 'MMM d, yyyy')}`}
                            </div>
                          )}
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemoveShow(show.id)}
                          className='h-8 w-8 p-0'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className='p-6 space-y-4'>
              {relatedLeads.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <Users className='h-12 w-12 mx-auto mb-2 opacity-50' />
                  <p>No leads found for this company</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {relatedLeads.map(lead => (
                    <div
                      key={lead.id}
                      className='p-4 border rounded-lg hover:bg-accent dark:hover:bg-muted/60 transition-colors'
                    >
                      <div className='flex items-center justify-between gap-3 mb-3'>
                        <div
                          className='flex-1 cursor-pointer'
                          onClick={() => handleLeadClick(lead.id)}
                        >
                          <div className='font-medium'>
                            {lead.first_name || ''} {lead.last_name || ''}
                            {!lead.first_name && !lead.last_name && 'Unknown'}
                          </div>
                          {lead.job_title && (
                            <div className='text-sm text-muted-foreground'>
                              {lead.job_title}
                            </div>
                          )}
                          {lead.email && (
                            <div className='text-xs text-muted-foreground'>
                              {lead.email}
                            </div>
                          )}
                        </div>
                        <div className='flex items-center gap-2 flex-shrink-0'>
                          {lead.status && (
                            <Badge variant='outline' className='text-xs'>
                              {getStatusDisplayText(lead.status)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </SlideOutPanel>
    );
  });

CompanyDetailsSlideOutComponent.displayName = 'CompanyDetailsSlideOut';

export const CompanyDetailsSlideOut = CompanyDetailsSlideOutComponent;
