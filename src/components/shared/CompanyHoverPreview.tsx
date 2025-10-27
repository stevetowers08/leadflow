import { Company } from '@/types/database';
import { Building2, Globe, MapPin } from 'lucide-react';
import React, { useState } from 'react';

interface CompanyHoverPreviewProps {
  company: Company;
  children: React.ReactNode;
}

export const CompanyHoverPreview: React.FC<CompanyHoverPreviewProps> = ({
  company,
  children,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className='relative inline-block'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      {isHovering && (
        <div className='absolute left-0 top-full mt-1 z-50 w-64'>
          <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-3'>
            {/* Company Logo/Icon */}
            <div className='flex items-start gap-3 mb-3'>
              <div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
                {company.website ? (
                  <img
                    src={`https://logo.clearbit.com/${
                      company.website
                        .replace(/^https?:\/\//, '')
                        .replace(/^www\./, '')
                        .split('/')[0]
                    }`}
                    alt={company.name}
                    className='w-10 h-10 rounded-lg object-cover'
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        'none';
                    }}
                  />
                ) : (
                  <Building2 className='h-5 w-5 text-gray-400' />
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <h4 className='font-medium text-sm text-gray-900 truncate'>
                  {company.name}
                </h4>
                {company.industry && (
                  <p className='text-xs text-gray-500 truncate'>
                    {company.industry}
                  </p>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div className='space-y-2 border-t border-gray-100 pt-2'>
              {company.head_office && (
                <div className='flex items-center gap-2 text-xs text-gray-600'>
                  <MapPin className='h-3 w-3 flex-shrink-0' />
                  <span className='truncate'>{company.head_office}</span>
                </div>
              )}
              {company.website && (
                <div className='flex items-center gap-2 text-xs text-gray-600'>
                  <Globe className='h-3 w-3 flex-shrink-0' />
                  <span className='truncate'>{company.website}</span>
                </div>
              )}
              {company.company_size && (
                <div className='flex items-center gap-2 text-xs text-gray-600'>
                  <Building2 className='h-3 w-3 flex-shrink-0' />
                  <span>{company.company_size}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
