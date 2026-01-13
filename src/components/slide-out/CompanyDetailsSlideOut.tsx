'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TabNavigation, TabOption } from '@/components/ui/tab-navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getCompanyLogoUrlSync } from '@/services/logoService';
import { Company, Lead } from '@/types/database';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { format } from 'date-fns';
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

const CompanyDetailsSlideOutComponent: React.FC<CompanyDetailsSlideOutProps> =
  memo(({ companyId, isOpen, onClose }) => {
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);
    const [relatedLeads, setRelatedLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
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
        setCompany(companyData as Company);

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
        console.error('Error fetching company details:', error);
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
                value: (
                  <div className='flex items-center gap-2'>
                    <img
                      src={
                        getCompanyLogoUrlSync(
                          company.name,
                          company.website || undefined
                        ) || ''
                      }
                      alt={company.name}
                      className='w-6 h-6 rounded'
                    />
                    <span className='font-medium'>{company.name}</span>
                  </div>
                ),
              },
              {
                label: 'Industry',
                value: company.industry || '-',
              },
              {
                label: 'Website',
                value: company.website ? (
                  <a
                    href={company.website}
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
                    href={company.linkedin_url}
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
        customHeader={
          <div className='flex items-center gap-2'>
            <img
              src={
                getCompanyLogoUrlSync(
                  company.name,
                  company.website || undefined
                ) || ''
              }
              alt={company.name}
              className='w-6 h-6 rounded'
            />
            <div>
              <h2 className='text-lg font-semibold text-foreground truncate'>
                {company.name}
              </h2>
              {company.industry && (
                <p className='text-sm text-muted-foreground mt-0.5 truncate'>
                  {company.industry}
                </p>
              )}
            </div>
          </div>
        }
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
            <div className='p-6'>
              <SlideOutGrid items={companyDetailsItems} />
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
                <div className='space-y-2'>
                  {relatedLeads.map(lead => (
                    <div
                      key={lead.id}
                      className='p-3 border rounded-lg hover:bg-accent transition-colors'
                    >
                      <div className='flex items-center justify-between gap-3'>
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
