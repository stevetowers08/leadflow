import React, { memo } from 'react';
import { VirtualizedList } from './VirtualizedList';
import { ListItem } from './shared/ListItem';
import { getProfileImage } from '@/utils/linkedinProfileUtils';

interface OptimizedRelatedListProps {
  items: Array<{
    id: string;
    name?: string;
    title?: string;
    company_role?: string;
    companies?: { name: string; logo_url?: string };
    company?: { name: string; logo_url?: string };
    status?: string;
    lead_score?: number;
    score?: number;
    location?: string;
    created_at?: string;
    date?: string;
  }>;
  type: 'lead' | 'job' | 'company';
  onItemClick: (item: any) => void;
  isLoading: boolean;
  maxItems?: number;
  height?: number;
}

export const OptimizedRelatedList: React.FC<OptimizedRelatedListProps> = memo(({
  items,
  type,
  onItemClick,
  isLoading,
  maxItems = 5,
  height = 300
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No items found
      </div>
    );
  }

  // Use virtual scrolling for large lists
  if (items.length > 10) {
    return (
      <VirtualizedList
        items={items}
        height={height}
        itemHeight={60}
        onItemClick={onItemClick}
        type={type}
      />
    );
  }

  // Use regular list for small lists
  return (
    <div className="space-y-3">
      {items.slice(0, maxItems).map((item) => {
        const { avatarUrl, initials } = getProfileImage(item.name, 32);
        
        return (
          <ListItem
            key={item.id}
            id={item.id}
            title={item.name || item.title}
            subtitle={item.company_role || item.companies?.name}
            icon={
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                <img 
                  src={avatarUrl} 
                  alt={item.name}
                  className="w-full h-full rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const nextElement = target.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600" style={{ display: 'none' }}>
                  {initials}
                </div>
              </div>
            }
            onClick={() => onItemClick(item)}
            type={type}
            metadata={{
              score: item.lead_score || item.score,
              location: item.location,
              date: item.created_at,
              logo: item.companies?.logo_url || item.company?.logo_url
            }}
          />
        );
      })}
    </div>
  );
});

OptimizedRelatedList.displayName = 'OptimizedRelatedList';
