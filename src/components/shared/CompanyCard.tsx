import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';
import { getCompanyLogoUrlSync } from '@/services/logoService';
import React from 'react';

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    industry?: string;
    head_office?: string;
    company_size?: string;
    website?: string;
    logo?: string;
    lead_score?: string;
    pipeline_stage?: string;
  };
  onClick: () => void;
  className?: string;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onClick,
  className = '',
}) => {
  // Get company logo using stored/provider helper
  const getCompanyLogo = () => {
    if (company.logo) return company.logo;
    return getCompanyLogoUrlSync(company.name, company.website || undefined);
  };

  const logo = getCompanyLogo();

  return (
    <Card
      className={cn('cursor-pointer transition-all', className)}
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='flex items-center gap-3'>
          {/* Company Logo */}
          <div className='flex-shrink-0 w-8 h-8 rounded-md border border-border bg-background flex items-center justify-center'>
            {logo ? (
              <img
                src={logo}
                alt={`${company.name} logo`}
                className='w-full h-full rounded-md object-contain'
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className='w-full h-full rounded-md bg-muted text-muted-foreground flex items-center justify-center'>
                <Building2 className='h-4 w-4' />
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className='flex-1 min-w-0 cursor-pointer'>
            <div className='font-semibold text-sm truncate'>{company.name}</div>
            {company.head_office && (
              <div className='text-xs text-muted-foreground truncate'>
                {company.head_office}
              </div>
            )}
          </div>

          {/* Pipeline Stage and AI Score */}
          <div className='flex items-center gap-2'>
            <StatusBadge
              status={company.pipeline_stage || 'new_lead'}
              size='sm'
            />
            <span
              className={cn(
                'inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium border',
                company.lead_score === 'High' &&
                  'bg-success/10 text-success border-success/20',
                company.lead_score === 'Medium' &&
                  'bg-warning/10 text-warning border-warning/20',
                company.lead_score === 'Low' &&
                  'bg-destructive/10 text-destructive border-destructive/20',
                !company.lead_score && 'bg-muted text-foreground border-border'
              )}
            >
              {company.lead_score || '-'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
