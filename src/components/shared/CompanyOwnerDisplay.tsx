import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface CompanyOwnerDisplayProps {
  personId: string;
  companyId: string | null;
  className?: string;
}

interface OwnerInfo {
  id: string;
  full_name: string;
}

// Cache to prevent duplicate queries for the same company
const ownerCache = new Map<string, { data: OwnerInfo | null; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const pendingQueries = new Map<string, Promise<OwnerInfo | null>>();

export const CompanyOwnerDisplay: React.FC<CompanyOwnerDisplayProps> = ({
  personId,
  companyId,
  className,
}) => {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!companyId) {
      setOwnerInfo(null);
      setLoading(false);
      return;
    }

    // Check cache first
    const cached = ownerCache.get(companyId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setOwnerInfo(cached.data);
      setLoading(false);
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const fetchCompanyOwner = async () => {
      // Check if there's already a pending query for this company
      if (pendingQueries.has(companyId)) {
        try {
          const result = await pendingQueries.get(companyId)!;
          setOwnerInfo(result);
          return;
        } catch {
          // If pending query fails, continue with new query
        }
      }

      setLoading(true);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const queryPromise = (async () => {
        try {
          // Get company with owner info in one query
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('owner_id')
            .eq('id', companyId)
            .maybeSingle();

          if (companyError) throw companyError;

          if (!companyData?.owner_id) {
            ownerCache.set(companyId, { data: null, timestamp: Date.now() });
            return null;
          }

          // Get owner details
          const { data: ownerData, error: ownerError } = await supabase
            .from('user_profiles')
            .select('id, full_name')
            .eq('id', companyData.owner_id)
            .maybeSingle();

          if (ownerError) throw ownerError;
          
          const result = ownerData || null;
          ownerCache.set(companyId, { data: result, timestamp: Date.now() });
          return result;
        } catch (error) {
          if (!controller.signal.aborted) {
            // Only log if not aborted
            if (process.env.NODE_ENV === 'development') {
              console.error('Error fetching company owner:', error);
            }
          }
          return null;
        } finally {
          pendingQueries.delete(companyId);
        }
      })();

      pendingQueries.set(companyId, queryPromise);

      try {
        const result = await queryPromise;
        if (!controller.signal.aborted) {
          setOwnerInfo(result);
        }
      } catch {
        if (!controller.signal.aborted) {
          setOwnerInfo(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCompanyOwner();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
          <User className='w-3 h-3 text-muted-foreground' />
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
          <User className='w-3 h-3 text-muted-foreground' />
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
