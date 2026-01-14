'use client';

import { UnifiedTable, ColumnConfig } from '@/components/ui/unified-table';
import { Page } from '@/design-system/components';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  ExternalLink,
  MapPin,
  Download,
  Linkedin,
  Clock,
  Globe,
  FileText,
  Tag,
  Signal,
  Zap,
} from 'lucide-react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import type { Company } from '@/types/database';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { CompanyChip } from '@/components/shared/CompanyChip';
import { CompanyDetailsSlideOut } from '@/components/slide-out/CompanyDetailsSlideOut';
import { formatDistanceToNow } from 'date-fns';
import { TableFilterBar } from '@/components/tables/TableFilterBar';
import { useTableViewPreferences } from '@/hooks/useTableViewPreferences';
import type { SortOption, FilterConfig } from '@/types/tableFilters';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { CellLoadingSpinner } from '@/components/ui/cell-loading-spinner';
import { useCompanyEnrichmentRealtime } from '@/hooks/useCompanyEnrichmentRealtime';

// Sort options for companies
const COMPANY_SORT_OPTIONS: SortOption[] = [
  {
    value: 'created_at_desc',
    label: 'Newest First',
    field: 'created_at',
    direction: 'desc',
  },
  {
    value: 'created_at_asc',
    label: 'Oldest First',
    field: 'created_at',
    direction: 'asc',
  },
  { value: 'name_asc', label: 'Name (A-Z)', field: 'name', direction: 'asc' },
  { value: 'name_desc', label: 'Name (Z-A)', field: 'name', direction: 'desc' },
];

export default function CompaniesPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
  const bulkSelection = useBulkSelection();

  // Enable real-time enrichment updates
  useCompanyEnrichmentRealtime();

  // Table view preferences (filters + sorting)
  const { preferences, updatePreferences } = useTableViewPreferences(
    'companies',
    {
      sortBy: 'created_at_desc',
      filters: {
        connectionStrength: 'all',
      },
    }
  );

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
    queryKey: ['companies', preferences],
    queryFn: async () => {
      // Parse sorting
      const sortOption =
        COMPANY_SORT_OPTIONS.find(opt => opt.value === preferences.sortBy) ||
        COMPANY_SORT_OPTIONS[0];

      let query = supabase
        .from('companies')
        .select('id, name, website, industry, created_at');

      // Apply filters
      // Note: connection_strength column doesn't exist in current schema
      // if (preferences.filters.connectionStrength !== 'all') {
      //   query = query.eq('connection_strength', preferences.filters.connectionStrength);
      // }

      // Apply sorting
      query = query.order(sortOption.field, {
        ascending: sortOption.direction === 'asc',
      });

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Company[];
    },
    enabled: shouldBypassAuth() || (!authLoading && !!user),
    staleTime: 2 * 60 * 1000,
  });

  // Build filter configurations
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'connectionStrength',
        label: 'Connection',
        placeholder: 'All Connections',
        options: [
          { value: 'all', label: 'All Connections' },
          { value: 'strong', label: 'Strong (Replied)' },
          { value: 'medium', label: 'Medium (Opened)' },
          { value: 'weak', label: 'Weak (Sent)' },
          { value: 'none', label: 'None' },
        ],
      },
    ],
    []
  );

  // Memoized checkbox render to prevent re-renders
  const renderCheckbox = useCallback(
    (company: Company) => (
      <div
        className='flex items-center justify-center'
        data-bulk-checkbox
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          checked={bulkSelection.isSelected(company.id)}
          onCheckedChange={() => bulkSelection.toggleItem(company.id)}
          aria-label={`Select ${company.name}`}
        />
      </div>
    ),
    [bulkSelection]
  );

  const columns: ColumnConfig<Company>[] = useMemo(
    () => [
      {
        key: 'checkbox',
        label: (
          <div className='flex items-center justify-center' data-bulk-checkbox>
            <Checkbox
              checked={
                companies.length > 0 &&
                companies.every(c => bulkSelection.isSelected(c.id))
              }
              onCheckedChange={checked => {
                if (checked) {
                  bulkSelection.selectAll(companies.map(c => c.id));
                } else {
                  bulkSelection.deselectAll();
                }
              }}
              aria-label='Select all companies'
            />
          </div>
        ),
        width: '44px',
        cellType: 'regular',
        align: 'center',
        className: 'px-0',
        render: (_, company) => renderCheckbox(company),
      },
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
        key: 'categories',
        label: (
          <div
            className='flex items-center gap-1.5'
            title='Categories are enriched from external sources'
          >
            <span>Categories</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '200px',
        render: (value, row) => {
          const isEnriching =
            row.enrichment_status === 'enriching' ||
            row.enrichment_status === 'pending';

          if (isEnriching) {
            return <CellLoadingSpinner size='sm' />;
          }

          const categories = row.categories;
          if (
            !categories ||
            !Array.isArray(categories) ||
            categories.length === 0
          )
            return <span className='text-muted-foreground'>-</span>;

          // Filter out any null/undefined values and ensure strings
          const validCategories = categories.filter(
            (cat): cat is string =>
              typeof cat === 'string' && cat.trim().length > 0
          );

          if (validCategories.length === 0)
            return <span className='text-muted-foreground'>-</span>;

          return (
            <div className='flex items-center gap-1.5 flex-wrap'>
              <Tag className='h-3.5 w-3.5 text-muted-foreground flex-shrink-0' />
              <div className='flex gap-1 flex-wrap'>
                {validCategories.slice(0, 2).map((cat, idx) => (
                  <Badge key={idx} variant='outline' className='text-xs'>
                    {cat}
                  </Badge>
                ))}
                {validCategories.length > 2 && (
                  <Badge variant='outline' className='text-xs'>
                    +{validCategories.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: 'connection_strength',
        label: 'Connection',
        width: '140px',
        render: (value, row) => {
          const strength = row.connection_strength || 'none';
          const strengthConfig = {
            strong: {
              label: 'Replied',
              color: 'bg-green-500',
              textColor: 'text-green-700',
            },
            medium: {
              label: 'Opened',
              color: 'bg-amber-500',
              textColor: 'text-amber-700',
            },
            weak: {
              label: 'Sent',
              color: 'bg-red-500',
              textColor: 'text-red-700',
            },
            none: {
              label: 'None',
              color: 'bg-gray-300',
              textColor: 'text-gray-600',
            },
          };
          const config = strengthConfig[strength] || strengthConfig.none;
          return (
            <div className='flex items-center gap-2'>
              <div className={`w-2 h-2 rounded-full ${config.color}`} />
              <span className={`text-sm font-medium ${config.textColor}`}>
                {config.label}
              </span>
            </div>
          );
        },
      },
      {
        key: 'industry',
        label: (
          <div
            className='flex items-center gap-1.5'
            title='Industry data is enriched from external sources'
          >
            <span>Industry</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '180px',
        render: (value, row) => {
          const isEnriching =
            row.enrichment_status === 'enriching' ||
            row.enrichment_status === 'pending';

          if (isEnriching) {
            return <CellLoadingSpinner size='sm' />;
          }

          const industry = row.industry;
          if (!industry)
            return <span className='text-muted-foreground'>-</span>;
          return <span className='text-sm'>{industry}</span>;
        },
      },
      {
        key: 'website',
        label: (
          <div
            className='flex items-center gap-1.5'
            title='Website URLs are enriched from external sources'
          >
            <span>Website</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '200px',
        render: (value, row) => {
          const isEnriching =
            row.enrichment_status === 'enriching' ||
            row.enrichment_status === 'pending';

          if (isEnriching) {
            return <CellLoadingSpinner size='sm' />;
          }

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
        key: 'domain',
        label: (
          <div
            className='flex items-center gap-1.5'
            title='Domain information is enriched from external sources'
          >
            <span>Domain</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '180px',
        render: (value, row) => {
          const isEnriching =
            row.enrichment_status === 'enriching' ||
            row.enrichment_status === 'pending';

          if (isEnriching) {
            return <CellLoadingSpinner size='sm' />;
          }

          const domain = row.domain;
          if (!domain) return <span className='text-muted-foreground'>-</span>;
          return (
            <div className='flex items-center gap-1.5 text-sm'>
              <Globe className='h-3.5 w-3.5 text-muted-foreground' />
              <span className='truncate'>{domain}</span>
            </div>
          );
        },
      },
      {
        key: 'linkedin_url',
        label: (
          <div
            className='flex items-center gap-1.5'
            title='LinkedIn URLs are enriched from external sources'
          >
            <span>LinkedIn</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '180px',
        render: (value, row) => {
          const isEnriching =
            row.enrichment_status === 'enriching' ||
            row.enrichment_status === 'pending';

          if (isEnriching) {
            return <CellLoadingSpinner size='sm' />;
          }

          const linkedinUrl = row.linkedin_url;
          if (!linkedinUrl)
            return <span className='text-muted-foreground'>-</span>;
          return (
            <a
              href={
                linkedinUrl.startsWith('http')
                  ? linkedinUrl
                  : `https://${linkedinUrl}`
              }
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline flex items-center gap-1 text-sm'
              onClick={e => e.stopPropagation()}
            >
              <Linkedin className='h-4 w-4' />
              <span className='truncate'>LinkedIn</span>
              <ExternalLink className='h-3 w-3' />
            </a>
          );
        },
      },
      {
        key: 'description',
        label: (
          <div
            className='flex items-center gap-1.5'
            title='Company descriptions are enriched from external sources'
          >
            <span>Description</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '300px',
        render: (value, row) => {
          const isEnriching =
            row.enrichment_status === 'enriching' ||
            row.enrichment_status === 'pending';

          if (isEnriching) {
            return <CellLoadingSpinner size='sm' />;
          }

          const description = row.description;
          if (!description)
            return <span className='text-muted-foreground'>-</span>;
          return (
            <div className='flex items-start gap-1.5 text-sm'>
              <FileText className='h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0' />
              <span
                className='text-muted-foreground line-clamp-2'
                title={description}
              >
                {description}
              </span>
            </div>
          );
        },
      },
      {
        key: 'head_office',
        label: (
          <div
            className='flex items-center gap-1.5'
            title='Location data is enriched from external sources'
          >
            <span>Location</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '200px',
        render: (value, row) => {
          const isEnriching =
            row.enrichment_status === 'enriching' ||
            row.enrichment_status === 'pending';

          if (isEnriching) {
            return <CellLoadingSpinner size='sm' />;
          }

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
        label: (
          <div
            className='flex items-center gap-1.5'
            title='Company size is enriched from external sources'
          >
            <span>Size</span>
            <Zap className='h-3.5 w-3.5 text-yellow-500' />
          </div>
        ),
        width: '120px',
        render: (value, row) => {
          const isEnriching =
            row.enrichment_status === 'enriching' ||
            row.enrichment_status === 'pending';

          if (isEnriching) {
            return <CellLoadingSpinner size='sm' />;
          }

          const size = row.company_size;
          if (!size) return <span className='text-muted-foreground'>-</span>;
          return <span className='text-sm'>{size}</span>;
        },
      },
      {
        key: 'last_activity',
        label: 'Last Interaction',
        width: '180px',
        render: (value, row) => {
          const lastActivity = row.last_activity;
          if (!lastActivity)
            return <span className='text-muted-foreground'>-</span>;
          return (
            <div className='flex items-center gap-1.5 text-sm'>
              <Clock className='h-3.5 w-3.5 text-muted-foreground' />
              <span className='text-muted-foreground'>
                {formatDistanceToNow(new Date(lastActivity), {
                  addSuffix: true,
                })}
              </span>
            </div>
          );
        },
      },
    ],
    [companies, bulkSelection, renderCheckbox]
  );

  if (error) {
    return (
      <Page title='Companies'>
        <div className='p-6 text-center'>
          <p className='text-destructive'>
            Error loading companies: {error.message}
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page title='Companies' padding='none' hideHeader>
      <TableFilterBar
        entityLabel='Companies'
        entityCount={companies.length}
        sortOptions={COMPANY_SORT_OPTIONS}
        filterConfigs={filterConfigs}
        preferences={preferences}
        onPreferencesChange={updatePreferences}
      />

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

      {/* Company Details Slide Out */}
      {selectedCompanyId && (
        <CompanyDetailsSlideOut
          companyId={selectedCompanyId}
          isOpen={isSlideOutOpen}
          onClose={() => {
            setIsSlideOutOpen(false);
            setSelectedCompanyId(null);
            // Remove ID from URL
            router.replace('/');
          }}
        />
      )}
    </Page>
  );
}
