'use client';

import { cn } from '@/lib/utils';
import { Person } from '@/types/database';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Mail,
  MapPin,
  User,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ExpandableTableRowProps<T = unknown> {
  parentRow: T;
  parentColumns: Array<{
    key: string;
    label: string;
    width?: string;
    minWidth?: string;
    cellType?: 'status' | 'priority' | 'ai-score' | 'lead-score' | 'regular';
    align?: 'left' | 'center' | 'right';
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
    getStatusValue?: (row: T) => string;
  }>;
  children: Person[];
  onParentClick?: (row: T) => void;
  index: number;
  className?: string;
}

const PersonSubRow: React.FC<{
  person: Person;
  columns: ExpandableTableRowProps['parentColumns'];
  onPersonClick: (person: Person) => void;
}> = ({ person, columns, onPersonClick }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStageColor = (stage: string | null) => {
    switch (stage) {
      case 'connected':
        return 'text-success bg-success/10 border-success/20';
      case 'replied':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'meeting_booked':
        return 'text-info bg-info/10 border-info/20';
      case 'disqualified':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <tr className='bg-muted hover:bg-gray-100 transition-colors border-b border-border last:border-b-0'>
      {/* Expand/Collapse Cell - Empty for sub-rows */}
      <td className='px-4 py-2 border-r border-border border-b border-border'>
        <div className='w-6 h-6 flex items-center justify-center'>
          {/* Empty space to align with parent row */}
        </div>
      </td>

      {/* Person Info Cell - Spans multiple columns */}
      <td
        colSpan={columns.length - 1}
        className='px-4 py-2 border-r border-border border-b border-border'
      >
        <div className='flex items-center gap-4 pl-6'>
          {/* Avatar */}
          <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0'>
            <User className='w-4 h-4 text-muted-foreground' />
          </div>

          {/* Person Details */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-3 mb-1'>
              <button
                onClick={() => onPersonClick(person)}
                className='font-medium text-foreground hover:text-primary transition-colors text-left'
              >
                {person.name}
              </button>
              {person.people_stage && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full border',
                    getStageColor(person.people_stage)
                  )}
                >
                  {person.people_stage.replace('_', ' ')}
                </span>
              )}
              {person.lead_score && (
                <div className='w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground'>
                  {person.lead_score}
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              {person.company_role && (
                <span className='font-medium'>{person.company_role}</span>
              )}
              {person.email_address && (
                <div className='flex items-center gap-1'>
                  <Mail className='w-3 h-3' />
                  <span className='truncate'>{person.email_address}</span>
                </div>
              )}
              {person.employee_location && (
                <div className='flex items-center gap-1'>
                  <MapPin className='w-3 h-3' />
                  <span className='truncate'>{person.employee_location}</span>
                </div>
              )}
              {person.last_interaction_at && (
                <div className='flex items-center gap-1'>
                  <Calendar className='w-3 h-3' />
                  <span>Last: {formatDate(person.last_interaction_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export const ExpandableTableRow: React.FC<ExpandableTableRowProps> = ({
  parentRow,
  parentColumns,
  children,
  onParentClick,
  index,
  className,
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  }, []);

  const handleParentClick = useCallback(() => {
    if (onParentClick) {
      onParentClick(parentRow);
    }
  }, [parentRow, onParentClick]);

  const handlePersonClick = useCallback(
    (person: Person) => {
      router.push(`/people/${person.id}`);
    },
    [router]
  );

  const childrenCount = children.length;
  const hasChildren = childrenCount > 0;

  return (
    <>
      {/* Parent Row */}
      <tr
        className={cn(
          'data-[state=selected]:bg-muted border-b border-border hover:bg-muted hover:shadow-sm hover:border-border transition-colors duration-200 group cursor-pointer relative min-h-[48px]',
          className
        )}
        role='row'
        tabIndex={0}
        aria-label={`Row ${index + 1}`}
        onClick={handleParentClick}
      >
        {parentColumns.map((column, colIndex) => {
          const value = (parentRow as Record<string, unknown>)[column.key];
          const isFirstColumn = colIndex === 0;

          return (
            <td
              key={column.key}
              className={cn(
                'align-middle px-4 border-r border-border border-b border-border last:border-r-0 group-hover:border-r-gray-200 group-hover:last:border-r-0 min-h-[44px]',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right'
              )}
              style={{
                width: column.width,
                minWidth: column.minWidth || column.width,
              }}
            >
              <div className='flex items-center gap-2'>
                {/* Expand/Collapse Button - Only in first column */}
                {isFirstColumn && (
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={handleExpandToggle}
                      disabled={!hasChildren}
                      className={cn(
                        'w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors group',
                        !hasChildren && 'opacity-30 cursor-not-allowed',
                        hasChildren && 'hover:bg-primary/10'
                      )}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {hasChildren ? (
                        isExpanded ? (
                          <ChevronDown className='w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors' />
                        ) : (
                          <ChevronRight className='w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors' />
                        )
                      ) : (
                        <div className='w-2 h-2 rounded-full bg-muted' />
                      )}
                    </button>
                    {hasChildren && (
                      <span className='text-xs text-muted-foreground font-medium'>
                        {childrenCount}
                      </span>
                    )}
                  </div>
                )}

                {/* Cell Content */}
                <div className='flex-1'>
                  {column.render ? (
                    column.render(value, parentRow, index)
                  ) : (
                    <span>{value || '-'}</span>
                  )}
                </div>
              </div>
            </td>
          );
        })}
      </tr>

      {/* Child Rows */}
      {isExpanded && hasChildren && (
        <>
          {children.map(person => (
            <PersonSubRow
              key={person.id}
              person={person}
              columns={parentColumns}
              onPersonClick={handlePersonClick}
            />
          ))}
        </>
      )}
    </>
  );
};
