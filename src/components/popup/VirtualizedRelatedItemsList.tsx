import { Button } from '@/components/ui/button';
import { getProfileImage } from '@/utils/linkedinProfileUtils';
import { formatDateForSydney } from '@/utils/timezoneUtils';
import { Briefcase, Users } from 'lucide-react';
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { StatusBadge } from '../StatusBadge';
import { InfoCard } from '../shared/InfoCard';
import { ListItem } from '../shared/ListItem';

interface VirtualizedRelatedItemsListProps {
  title: string;
  items: any[];
  isLoading: boolean;
  selectedLeads: any[];
  onItemClick: (id: string) => void;
  onToggleSelection?: (item: any) => void;
  showCheckbox?: boolean;
  showAutomateButton?: boolean;
  itemType: 'lead' | 'job';
}

// Individual list item component for virtual scrolling
const VirtualListItem = ({ index, style, data }: { index: number; style: any; data: any }) => {
  const { items, itemType, selectedLeads, onItemClick, onToggleSelection, showCheckbox } = data;
  const item = items[index];

  if (!item) return null;

  const renderItem = () => {
    if (itemType === 'lead') {
      const { avatarUrl, initials } = getProfileImage(item.name, 32);
      return (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.name}
          subtitle={item.company_role}
          icon={
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
              <img 
                src={avatarUrl} 
                alt={item.name || 'Lead'}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) nextElement.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-200 rounded-lg items-center justify-center text-xs font-medium text-gray-600 hidden">
                {initials}
              </div>
            </div>
          }
          rightContent={
            <div className="flex items-center gap-2">
              <StatusBadge status={item.stage || 'new'} size="sm" />
              {showCheckbox && (
                <input
                  type="checkbox"
                  checked={selectedLeads.some(lead => lead.id === item.id)}
                  onChange={() => onToggleSelection?.(item)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              )}
            </div>
          }
          onClick={() => onItemClick(item.id)}
        />
      );
    } else {
      return (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.title}
          subtitle={item.location}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          rightContent={
            <div className="flex items-center gap-2">
              <StatusBadge status={item.priority || 'Medium'} size="sm" />
              <span className="text-xs text-muted-foreground">
                {formatDateForSydney(item.posted_date)}
              </span>
            </div>
          }
          onClick={() => onItemClick(item.id)}
        />
      );
    }
  };

  return (
    <div style={style}>
      {renderItem()}
    </div>
  );
};

export const VirtualizedRelatedItemsList: React.FC<VirtualizedRelatedItemsListProps> = React.memo(({
  title,
  items,
  isLoading,
  selectedLeads,
  onItemClick,
  onToggleSelection,
  showCheckbox = false,
  showAutomateButton = false,
  itemType
}) => {
  // Memoize list data to prevent unnecessary re-renders
  const listData = useMemo(() => ({
    items,
    itemType,
    selectedLeads,
    onItemClick,
    onToggleSelection,
    showCheckbox
  }), [items, itemType, selectedLeads, onItemClick, onToggleSelection, showCheckbox]);

  if (isLoading) {
    return (
      <InfoCard title={title} contentSpacing="space-y-3 pt-3">
        <div className="space-y-3">
          {[1, 2, 3].map(index => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </InfoCard>
    );
  }

  if (!items || items.length === 0) {
    return (
      <InfoCard title={title} contentSpacing="space-y-3 pt-3">
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No {itemType}s found</p>
        </div>
      </InfoCard>
    );
  }

  // Use virtual scrolling for lists with more than 10 items
  const shouldUseVirtualScrolling = items.length > 10;
  const listHeight = Math.min(items.length * 64, 400); // Max height of 400px

  return (
    <InfoCard title={title} contentSpacing="space-y-3 pt-3">
      {shouldUseVirtualScrolling ? (
        <div className="h-96">
          <List
            height={listHeight}
            itemCount={items.length}
            itemSize={64}
            itemData={listData}
            overscanCount={5} // Render 5 extra items for smooth scrolling
          >
            {VirtualListItem}
          </List>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            if (itemType === 'lead') {
              const { avatarUrl, initials } = getProfileImage(item.name, 32);
              return (
                <ListItem
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  subtitle={item.company_role}
                  icon={
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                      <img 
                        src={avatarUrl} 
                        alt={item.name || 'Lead'}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) nextElement.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-200 rounded-lg items-center justify-center text-xs font-medium text-gray-600 hidden">
                        {initials}
                      </div>
                    </div>
                  }
                  rightContent={
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.stage || 'new'} size="sm" />
                      {showCheckbox && (
                        <input
                          type="checkbox"
                          checked={selectedLeads.some(lead => lead.id === item.id)}
                          onChange={() => onToggleSelection?.(item)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      )}
                    </div>
                  }
                  onClick={() => onItemClick(item.id)}
                />
              );
            } else {
              return (
                <ListItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  subtitle={item.location}
                  icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                  rightContent={
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.priority || 'Medium'} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {formatDateForSydney(item.posted_date)}
                      </span>
                    </div>
                  }
                  onClick={() => onItemClick(item.id)}
                />
              );
            }
          })}
        </div>
      )}

      {showAutomateButton && selectedLeads.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button 
            className="w-full"
            onClick={() => {
              // Handle automation
              console.log('Automating selected leads:', selectedLeads);
            }}
          >
            <Users className="h-4 w-4 mr-2" />
            Automate {selectedLeads.length} Lead{selectedLeads.length > 1 ? 's' : ''}
          </Button>
        </div>
      