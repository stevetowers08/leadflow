import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Person } from '@/types/database';
import React from 'react';

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
  if (people.length === 0) {
    return null;
  }

  const visiblePeople = people.slice(0, maxVisible);
  const remainingCount = people.length - maxVisible;

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

  return (
    <div className='flex -space-x-2'>
      {visiblePeople.map((person, idx) => (
        <Avatar
          key={person.id}
          className='h-8 w-8 border-2 border-background cursor-pointer'
          onClick={e => {
            e.stopPropagation();
            onPersonClick(person.id);
          }}
        >
          <AvatarImage src={undefined} alt={person.name || 'Person'} />
          <AvatarFallback>{getInitials(person.name || '?')}</AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar className='h-8 w-8 border-2 border-background bg-muted'>
          <AvatarFallback className='text-xs'>+{remainingCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
