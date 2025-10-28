import { cn } from '@/lib/utils';
import { Person } from '@/types/database';
import { ExternalLink, Mail, MapPin } from 'lucide-react';
import React, { useState } from 'react';

interface PeopleAvatarsProps {
  people: Person[];
  onPersonClick: (personId: string) => void;
  maxVisible?: number;
}

export const PeopleAvatars: React.FC<PeopleAvatarsProps> = ({
  people,
  onPersonClick,
  maxVisible = 3,
}) => {
  const [hoveredPersonId, setHoveredPersonId] = useState<string | null>(null);

  if (people.length === 0) {
    return <span className='text-sm text-gray-500'>-</span>;
  }

  const visiblePeople = people.slice(0, maxVisible);
  const remainingCount = people.length - maxVisible;
  const hoveredPerson = hoveredPersonId
    ? people.find(p => p.id === hoveredPersonId)
    : null;

  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return '??';
    const parts = name
      .trim()
      .split(' ')
      .filter(n => n.length > 0);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-green-100 text-green-800',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className='relative flex items-center gap-1'>
      {visiblePeople.map((person, index) => (
        <div
          key={person.id}
          className='relative inline-block z-0'
          onMouseEnter={() => setHoveredPersonId(person.id)}
          onMouseLeave={() => setHoveredPersonId(null)}
        >
          <button
            onClick={e => {
              e.stopPropagation();
              onPersonClick(person.id);
            }}
            className={cn(
              'relative w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium hover:scale-110 transition-transform cursor-pointer',
              getAvatarColor(index)
            )}
            style={{ zIndex: maxVisible - index }}
            title={person.name || 'Person'}
          >
            {getInitials(person.name || '?')}
          </button>

          {/* Hover Tooltip */}
          {hoveredPersonId === person.id && hoveredPerson && (
            <div
              className={cn(
                'absolute left-0 top-full mt-2 z-[100] w-64',
                index >= maxVisible / 2 && 'left-auto right-0'
              )}
            >
              <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-auto'>
                {/* Header */}
                <div className='flex items-start gap-3 mb-3'>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      getAvatarColor(index)
                    )}
                  >
                    <span className='text-xs font-semibold'>
                      {getInitials(person.name || '?')}
                    </span>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h4 className='font-medium text-sm text-gray-900 truncate'>
                      {person.name || 'Unnamed'}
                    </h4>
                    {person.company_role && (
                      <p className='text-xs text-gray-500 truncate'>
                        {person.company_role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className='space-y-2'>
                  {person.email_address && (
                    <div className='flex items-center gap-2 text-xs text-gray-600'>
                      <Mail className='h-3 w-3 flex-shrink-0' />
                      <span className='truncate'>{person.email_address}</span>
                    </div>
                  )}
                  {person.employee_location && (
                    <div className='flex items-center gap-2 text-xs text-gray-600'>
                      <MapPin className='h-3 w-3 flex-shrink-0' />
                      <span className='truncate'>
                        {person.employee_location}
                      </span>
                    </div>
                  )}
                  {person.linkedin_url && (
                    <div className='flex items-center gap-2 text-xs text-gray-600'>
                      <ExternalLink className='h-3 w-3 flex-shrink-0' />
                      <span className='truncate'>LinkedIn</span>
                    </div>
                  )}
                  {person.people_stage && (
                    <div className='flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100'>
                      <span className='font-medium'>Status:</span>
                      <span className='text-gray-900'>
                        {person.people_stage}
                      </span>
                    </div>
                  )}
                </div>

                {/* Click to view button */}
                <div className='mt-3'>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onPersonClick(person.id);
                    }}
                    className='w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-medium rounded-md transition-colors'
                  >
                    <ExternalLink className='h-3 w-3' />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Remaining count badge */}
      {remainingCount > 0 && (
        <div className='relative inline-block'>
          <div
            className='w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-medium hover:scale-110 transition-transform'
            title={`${remainingCount} more person${remainingCount > 1 ? 's' : ''}`}
          >
            +{remainingCount}
          </div>
        </div>
      )}
    </div>
  );
};
