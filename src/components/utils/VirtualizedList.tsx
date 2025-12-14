import React, { memo } from 'react';
import { List } from 'react-window';
import { ListItem } from '@/components/shared/ListItem';

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
  onItemClick?: (item: VirtualizedListProps['items'][number]) => void;
  type?: 'lead' | 'contact' | 'company';
}

type RowProps = {
  items: VirtualizedListProps['items'];
  onItemClick?: (item: VirtualizedListProps['items'][number]) => void;
  type?: 'lead' | 'contact' | 'company';
};

const VirtualizedListItem = memo(
  ({
    index,
    style,
    items,
    onItemClick,
    type,
    ariaAttributes,
  }: {
    index: number;
    style: React.CSSProperties;
    items: VirtualizedListProps['items'];
    onItemClick?: (item: VirtualizedListProps['items'][number]) => void;
    type?: 'lead' | 'contact' | 'company';
    ariaAttributes: {
      'aria-posinset': number;
      'aria-setsize': number;
      role: 'listitem';
    };
  }) => {
    const item = items[index];

    if (!item) {
      return <div style={style} />;
    }

    return (
      <div style={style}>
        <ListItem
          id={item.id}
          title={item.title || item.name || 'Untitled'}
          subtitle={item.company?.name || item.companies?.name}
          onClick={() => onItemClick?.(item)}
          badge={
            item.status ? (
              <span className='px-2 py-1 text-xs rounded-full bg-muted'>
                {item.status}
              </span>
            ) : undefined
          }
        />
      </div>
    );
  }
);

VirtualizedListItem.displayName = 'VirtualizedListItem';

export const VirtualizedList: React.FC<VirtualizedListProps> = memo(
  ({ items, height = 400, itemHeight = 60, onItemClick, type }) => {
    if (!items || items.length === 0) {
      return (
        <div className='text-center text-muted-foreground py-8'>
          No items to display
        </div>
      );
    }

    return (
      <List
        rowCount={items.length}
        rowHeight={itemHeight}
        rowProps={{ items, onItemClick, type } as Record<string, unknown>}
        className='scrollbar-modern'
        rowComponent={VirtualizedListItem as React.ComponentType<unknown>}
        style={{ height }}
      />
    );
  }
);

VirtualizedList.displayName = 'VirtualizedList';
