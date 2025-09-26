import React, { memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ListItem } from './shared/ListItem';

interface VirtualizedListProps {
  items: Array<{
    id: string;
    name?: string;
    title?: string;
    company?: { name: string; logo_url?: string };
    companies?: { name: string; logo_url?: string };
    status?: string;
    lead_score?: number;
    score?: number;
    location?: string;
    created_at?: string;
    date?: string;
  }>;
  height?: number;
  itemHeight?: number;
  onItemClick?: (item: any) => void;
  type?: 'lead' | 'job' | 'company';
}

const VirtualizedListItem = memo(({ index, style, data }: { 
  index: number; 
  style: React.CSSProperties; 
  data: { 
    items: VirtualizedListProps['items']; 
    onItemClick?: (item: any) => void; 
    type?: 'lead' | 'job' | 'company' 
  } 
}) => {
  const { items, onItemClick, type } = data;
  const item = items[index];

  if (!item) return null;

  return (
    <div style={style}>
      <ListItem
        key={item.id}
        title={item.title || item.name || item.position}
        subtitle={item.company?.name || item.companies?.name || item.subtitle}
        status={item.status}
        onClick={() => onItemClick?.(item)}
        type={type}
        metadata={{
          score: item.lead_score || item.score,
          location: item.location,
          date: item.created_at || item.date,
          logo: item.companies?.logo_url || item.company?.logo_url
        }}
      />
    </div>
  );
});

VirtualizedListItem.displayName = 'VirtualizedListItem';

export const VirtualizedList: React.FC<VirtualizedListProps> = memo(({
  items,
  height = 400,
  itemHeight = 60,
  onItemClick,
  type
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No items to display
      </div>
    );
  }

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={{ items, onItemClick, type }}
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      {VirtualizedListItem}
    </List>
  );
});

VirtualizedList.displayName = 'VirtualizedList';
