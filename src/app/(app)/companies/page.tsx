'use client';

import { UnifiedTable, ColumnConfig } from '@/components/ui/unified-table';
import { Page } from '@/design-system/components';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { useQuery } from '@tanstack/react-query';
import { Building2, ExternalLink, MapPin, Download } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import type { Company } from '@/types/database';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { CompanyChip } from '@/components/shared/CompanyChip';
import { CompanyDetailsSlideOut } from '@/components/slide-out/CompanyDetailsSlideOut';

export default function CompaniesPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);

  // Get company ID from URL params
  useEffect(() => {
    const companyId = searchParams.get('id');
    if (companyId) {
      setSelectedCompanyId(companyId);
      setIsSlideOutOpen(true);
    }
  }, [searchParams]);

  const {
    data: companies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Company[];
    },
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 2 * 60 * 1000,
  });

  const columns: ColumnConfig<Company>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Company',
        width: '250px',
        render: (value, row) => {
          return (
            <div className='flex items-center gap-2'>
              <CompanyChip company={row} />
            </div>
          );
        },
      },
      {
        key: 'industry',
        label: 'Industry',
        width: '180px',
        render: (value, row) => {
          const industry = row.industry;
          if (!industry)
            return <span className='text-muted-foreground'>-</span>;
          return <span className='text-sm'>{industry}</span>;
        },
      },
      {
        key: 'website',
        label: 'Website',
        width: '200px',
        render: (value, row) => {
          const website = row.website;
          if (!website) return <span className='text-muted-foreground'>-</span>;
          return (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline flex items-center gap-1 text-sm'
              onClick={e => e.stopPropagation()}
            >
              {website.replace(/^https?:\/\//, '')}
              <ExternalLink className='h-3 w-3' />
            </a>
          );
        },
      },
      {
        key: 'head_office',
        label: 'Location',
        width: '200px',
        render: (value, row) => {
          const location = row.head_office;
          if (!location)
            return <span className='text-muted-foreground'>-</span>;
          return (
            <div className='flex items-center gap-1 text-sm'>
              <MapPin className='h-3 w-3 text-muted-foreground' />
              <span className='truncate'>{location}</span>
            </div>
          );
        },
      },
      {
        key: 'company_size',
        label: 'Size',
        width: '120px',
        render: (value, row) => {
          const size = row.company_size;
          if (!size) return <span className='text-muted-foreground'>-</span>;
          return <span className='text-sm'>{size}</span>;
        },
      },
    ],
    []
  );

  if (error) {
    return (
      <Page>
        <div className='p-6 text-center'>
          <p className='text-destructive'>
            Error loading companies: {error.message}
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className='flex flex-col h-full gap-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold'>Companies</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              {companies.length}{' '}
              {companies.length === 1 ? 'company' : 'companies'}
            </p>
          </div>
        </div>

        {/* Table */}
        <div
          className='w-full min-w-0 flex-1'
          style={{ minHeight: '400px', maxHeight: 'calc(100vh - 200px)' }}
        >
          <UnifiedTable
            data={companies}
            columns={columns}
            loading={isLoading}
            emptyMessage='No companies found. Companies are created automatically when leads are enriched.'
            scrollable
            stickyHeaders
            onRowClick={company => {
              setSelectedCompanyId(company.id);
              setIsSlideOutOpen(true);
            }}
          />
        </div>
      </div>

      {/* Company Details Slide Out */}
      {selectedCompanyId && (
        <CompanyDetailsSlideOut
          companyId={selectedCompanyId}
          isOpen={isSlideOutOpen}
          onClose={() => {
            setIsSlideOutOpen(false);
            setSelectedCompanyId(null);
            // Remove ID from URL
            router.replace('/companies');
          }}
        />
      )}
    </Page>
  );
}
