import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CompanyOwnerDisplayProps {
  personId: string;
  companyId: string | null;
  className?: string;
}

interface OwnerInfo {
  id: string;
  full_name: string;
}

export const CompanyOwnerDisplay: React.FC<CompanyOwnerDisplayProps> = ({
  personId,
  companyId,
  className,
}) => {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!companyId) {
      setOwnerInfo(null);
      setLoading(false);
      return;
    }

    const fetchCompanyOwner = async () => {
      setLoading(true);
      try {
        // Get company with owner info in one query
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('owner_id')
          .eq('id', companyId)
          .maybeSingle();

        if (companyError) throw companyError;

        if (!companyData?.owner_id) {
          setOwnerInfo(null);
          return;
        }

        // Get owner details
        const { data: ownerData, error: ownerError } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('id', companyData.owner_id)
          .maybeSingle();

        if (ownerError) throw ownerError;
        setOwnerInfo(ownerData);
      } catch (error) {
        console.error('Error fetching company owner:', error);
        setOwnerInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyOwner();
  }, [companyId]);

  if (loading) {
    return (
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden',
          className
        )}
      >
        <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 animate-pulse'>
          <User className='w-3 h-3 text-gray-400' />
        </div>
      </div>
    );
  }

  if (!ownerInfo) {
    return (
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden',
          className
        )}
      >
        <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
          <User className='w-3 h-3 text-gray-400' />
        </div>
      </div>
    );
  }

  const initials = ownerInfo.full_name
    .split(' ')
    .map(namePart => namePart[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden',
        className
      )}
    >
      <div
        className='w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0'
        title={ownerInfo.full_name}
      >
        <span className='text-xs font-medium text-orange-800'>{initials}</span>
      </div>
    </div>
  );
};
