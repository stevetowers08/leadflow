import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
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
        return 'text-green-600 bg-green-50 border-green-200';
      case 'replied':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'meeting_booked':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'disqualified':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <tr className='bg-gray-50/30 hover:bg-gray-100/50 transition-colors border-b border-gray-200 last:border-b-0'>
      {/* Expand/Collapse Cell - Empty for sub-rows */}
      <td className='px-4 py-3 border-r border-gray-200'>
        <div className='w-6 h-6 flex items-center justify-center'>
          {/* Empty space to align with parent row */}
        </div>
      </td>

      {/* Person Info Cell - Spans multiple columns */}
      <td
        colSpan={columns.length - 1}
        className='px-4 py-3 border-r border-gray-200'
      >
        <div className='flex items-center gap-4 pl-6'>
          {/* Avatar */}
          <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
            <User className='w-4 h-4 text-gray-500' />
          </div>

          {/* Person Details */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-3 mb-1'>
              <button
                onClick={() => onPersonClick(person)}
                className='font-medium text-gray-900 hover:text-blue-600 transition-colors text-left'
              >
                {person.name}
              </button>
              {person.stage && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full border',
                    getStageColor(person.stage)
                  )}
                >
                  {person.stage.replace('_', ' ')}
                </span>
              )}
              {person.lead_score && (
                <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600'>
                  {person.lead_score}
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className='flex items-center gap-4 text-sm text-gray-500'>
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
  const { openPopup } = usePopupNavigation();
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
      openPopup('person', person.id, person.name);
    },
    [openPopup]
  );

  const childrenCount = children.length;
  const hasChildren = childrenCount > 0;

  return (
    <>
      {/* Parent Row */}
      <tr
        className={cn(
          'data-[state=selected]:bg-muted border-b border-gray-200 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-300 transition-colors duration-200 group cursor-pointer relative min-h-[48px]',
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
                'align-middle px-4 border-r border-gray-200 last:border-r-0 group-hover:border-r-gray-300 group-hover:last:border-r-0 min-h-[44px]',
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
                        'w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors group',
                        !hasChildren && 'opacity-30 cursor-not-allowed',
                        hasChildren && 'hover:bg-blue-50'
                      )}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {hasChildren ? (
                        isExpanded ? (
                          <ChevronDown className='w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors' />
                        ) : (
                          <ChevronRight className='w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors' />
                        )
                      ) : (
                        <div className='w-2 h-2 rounded-full bg-gray-300' />
                      )}
                    </button>
                    {hasChildren && (
                      <span className='text-xs text-gray-500 font-medium'>
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
