import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/utils/BadgeSystem';
import { cn } from '@/lib/utils';
import { Company, Person, UserProfile } from '@/types/database';
import { getScoreBadgeClasses } from '@/utils/scoreUtils';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import React, { useState } from 'react';

interface ExpandableCompanyRowProps {
  company: Company;
  people: Person[];
  users: UserProfile[];
  onCompanyClick: (company: Company) => void;
  onPersonClick: (person: Person) => void;
  onActionClick: (company: Company) => void;
}

export const ExpandableCompanyRow: React.FC<ExpandableCompanyRowProps> = ({
  company,
  people,
  users,
  onCompanyClick,
  onPersonClick,
  onActionClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const companyPeople = people.filter(
    person => person.company_id === company.id
  );

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCompanyClick = () => {
    onCompanyClick(company);
  };

  const handlePersonClick = (person: Person) => {
    onPersonClick(person);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onActionClick(company);
  };

  return (
    <>
      {/* Company Row */}
      <tr
        className='border-b border-gray-300 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-400 transition-colors duration-200 group cursor-pointer relative min-h-[48px]'
        onClick={handleCompanyClick}
      >
        {/* Status */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px] text-center'>
          <Badge
            type='status'
            value={company.pipeline_stage || 'new_lead'}
            size='sm'
          />
        </td>

        {/* Company Name with Expand/Collapse */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px]'>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleToggle}
              className='flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded transition-colors'
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4 text-gray-500' />
              ) : (
                <ChevronRight className='h-4 w-4 text-gray-500' />
              )}
            </button>

            <div className='w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
              {company.website ? (
                <img
                  src={`https://logo.clearbit.com/${
                    company.website
                      .replace(/^https?:\/\//, '')
                      .replace(/^www\./, '')
                      .split('/')[0]
                  }`}
                  alt={company.name}
                  className='w-6 h-6 rounded-lg object-cover'
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none';
                    const nextElement = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                className='w-6 h-6 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center'
                style={{ display: company.website ? 'none' : 'flex' }}
              >
                <Building2 className='h-3 w-3' />
              </div>
            </div>

            <div className='flex flex-col min-w-0 flex-1'>
              <div className='text-sm font-medium text-gray-900'>
                {company.name || '-'}
              </div>
              <div className='text-xs text-gray-500'>
                {companyPeople.length} people
              </div>
            </div>
          </div>
        </td>

        {/* Head Office */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px]'>
          {company.head_office || '-'}
        </td>

        {/* Industry */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px]'>
          {company.industry || '-'}
        </td>

        {/* Company Size */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px]'>
          {company.company_size || '-'}
        </td>

        {/* Assigned To */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px]'>
          <div className='text-sm'>
            {users.find(u => u.id === company.owner_id)?.full_name ||
              'Unassigned'}
          </div>
        </td>

        {/* AI Score */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px] text-center'>
          <span
            className={cn(
              'inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border',
              getScoreBadgeClasses(company.lead_score)
            )}
          >
            {company.lead_score || '-'}
          </span>
        </td>

        {/* People Count */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px] text-center'>
          <span className='inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-muted border'>
            {companyPeople.length}
          </span>
        </td>

        {/* Jobs Count */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px] text-center'>
          <span className='inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-muted border'>
            0
          </span>
        </td>

        {/* Created */}
        <td className='align-middle text-sm font-normal leading-tight px-4 border-r border-gray-300 group-hover:border-r-gray-400 min-h-[48px] text-center'>
          <div className='text-sm text-muted-foreground'>
            {company.created_at
              ? new Date(company.created_at).toLocaleDateString()
              : '-'}
          </div>
        </td>

        {/* Action Button */}
        <td className='align-middle text-sm font-normal leading-tight px-4 min-h-[48px] text-center'>
          <Button
            variant='ghost'
            size='xs'
            onClick={handleActionClick}
            className='h-6 w-6 p-0'
          >
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </td>
      </tr>

      {/* Expanded People Rows */}
      {isExpanded && companyPeople.length > 0 && (
        <tr>
          <td colSpan={10} className='p-0 bg-gray-50/30'>
            <Card className='m-2 border-0 shadow-none bg-transparent'>
              <CardContent className='p-0'>
                <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                  {/* People Table Header */}
                  <div className='bg-gray-50/80 border-b border-gray-200 px-4 py-2'>
                    <div className='grid grid-cols-8 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                      <div>Status</div>
                      <div>Person</div>
                      <div>Role</div>
                      <div>Location</div>
                      <div>Assigned To</div>
                      <div className='text-center'>AI Score</div>
                      <div className='text-center'>Created</div>
                      <div className='text-center'>Actions</div>
                    </div>
                  </div>

                  {/* People Rows */}
                  <div className='divide-y divide-gray-100'>
                    {companyPeople.map((person, index) => {
                      const assignedUser = users.find(
                        u => u.id === person.owner_id
                      );
                      return (
                        <div
                          key={person.id}
                          className='px-4 py-3 hover:bg-gray-50/50 transition-colors cursor-pointer'
                          onClick={() => handlePersonClick(person)}
                        >
                          <div className='grid grid-cols-8 gap-4 items-center'>
                            {/* Status */}
                            <div>
                              <StatusBadge
                                status={person.stage || 'new'}
                                size='sm'
                              />
                            </div>

                            {/* Person Name */}
                            <div className='min-w-0'>
                              <div className='text-sm font-medium text-gray-900 truncate'>
                                {person.name || '-'}
                              </div>
                              <div className='text-xs text-gray-500 truncate'>
                                {person.email_address || '-'}
                              </div>
                            </div>

                            {/* Role */}
                            <div className='text-sm text-gray-500 truncate'>
                              {person.company_role || '-'}
                            </div>

                            {/* Location */}
                            <div className='text-sm text-gray-500 truncate'>
                              {person.employee_location || '-'}
                            </div>

                            {/* Assigned To */}
                            <div className='text-sm'>
                              {assignedUser?.full_name || 'Unassigned'}
                            </div>

                            {/* AI Score */}
                            <div className='text-center'>
                              <span
                                className={cn(
                                  'inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border',
                                  getScoreBadgeClasses(person.lead_score)
                                )}
                              >
                                {person.lead_score || '-'}
                              </span>
                            </div>

                            {/* Created */}
                            <div className='text-center text-sm text-muted-foreground'>
                              {person.created_at
                                ? new Date(
                                    person.created_at
                                  ).toLocaleDateString()
                                : '-'}
                            </div>

                            {/* Actions */}
                            <div className='text-center'>
                              <Button
                                variant='ghost'
                                size='xs'
                                onClick={e => {
                                  e.stopPropagation();
                                  handlePersonClick(person);
                                }}
                                className='h-6 w-6 p-0'
                              >
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </td>
        </tr>
      )}
    </>
  );
};
