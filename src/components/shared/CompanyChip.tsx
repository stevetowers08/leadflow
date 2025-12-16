import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Company } from '@/types/database';

interface CompanyChipProps {
  company: Company | { name: string; logo_url?: string | null } | null;
  className?: string;
}

export function CompanyChip({ company, className }: CompanyChipProps) {
  if (!company?.name) return null;

  return (
    <Badge variant='outline' className={className}>
      <Building2 className='h-3 w-3 mr-1' />
      <span className='truncate max-w-[120px]'>{company.name}</span>
    </Badge>
  );
}
