import { Building2 } from 'lucide-react';
import type { Company } from '@/types/database';
import { cn } from '@/lib/utils';

interface CompanyChipProps {
  company:
    | Company
    | { name: string; logo_url?: string | null; id?: string }
    | null;
  className?: string;
}

export function CompanyChip({ company, className }: CompanyChipProps) {
  if (!company?.name) return <span className='text-muted-foreground'>-</span>;

  const logoUrl = company.logo_url;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${company.name} logo`}
          className='h-5 w-5 rounded object-contain flex-shrink-0'
          onError={e => {
            // Fallback to icon if logo fails to load
            e.currentTarget.style.display = 'none';
            const icon = e.currentTarget.nextElementSibling;
            if (icon) icon.classList.remove('hidden');
          }}
        />
      ) : null}
      <Building2
        className={cn(
          'h-4 w-4 text-muted-foreground flex-shrink-0',
          logoUrl && 'hidden'
        )}
      />
      <span className='truncate text-foreground'>{company.name}</span>
    </div>
  );
}
