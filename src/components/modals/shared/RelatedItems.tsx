import React, { useMemo, useCallback } from 'react';
import { InfoCard } from '@/components/shared/InfoCard';
import { Button } from '@/components/ui/button';
import { ListItem } from '@/components/shared/ListItem';
import { StatusBadge } from '@/components/StatusBadge';
import { getProfileImage } from '@/utils/linkedinProfileUtils';
import { formatDateForSydney } from '@/utils/timezoneUtils';
import { User, Users, Briefcase } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company_role?: string;
  stage?: string;
  avatarUrl?: string;
  initials?: string;
  isSelected?: boolean;
}

interface Job {
  id: string;
  title: string;
  location?: string;
  priority?: string;
  posted_date?: string;
  formattedDate?: string;
  isSelected?: boolean;
}

interface RelatedItemsProps {
  title: string;
  items: Lead[] | Job[];
  isLoading: boolean;
  selectedLeads: Lead[];
  onItemClick: (id: string) => void;
  onToggleSelection?: (item: Lead) => void;
  showCheckbox?: boolean;
  showAutomateButton?: boolean;
  itemType: 'lead' | 'job';
}

export const RelatedItems: React.FC<RelatedItemsProps> = React.memo(({
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
  // Memoize selected lead IDs for efficient lookup
  const selectedLeadIds = useMemo(() => 
    new Set(selectedLeads.map(lead => lead.id)), 
    [selectedLeads]
  );

  // Memoize processed items to avoid recalculating on every render
  const processedItems = useMemo(() => 
    items.slice(0, 5).map(item => {
      if (itemType === 'lead') {
        const { avatarUrl, initials } = getProfileImage(item.name, 32);
        return {
          ...item,
          avatarUrl,
          initials,
          isSelected: selectedLeadIds.has(item.id)
        };
      } else {
        return {
          ...item,
          formattedDate: item.posted_date ? formatDateForSydney(item.posted_date, 'date') : "No date",
          isSelected: false
        };
      }
    }), 
    [items, itemType, selectedLeadIds]
  );

  // Memoized event handlers
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
    if (nextElement) {
      nextElement.style.display = 'flex';
    }
  }, []);

  const handleItemClick = useCallback((itemId: string) => {
    onItemClick(itemId);
  }, [onItemClick]);

  const handleItemSelect = useCallback((item: Lead) => {
    if (onToggleSelection) {
      onToggleSelection(item);
    }
  }, [onToggleSelection]);

  const renderItem = useCallback((item: Lead | Job) => {
    if (itemType === 'lead') {
      return (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.name}
          icon={
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
              <img 
                src={item.avatarUrl} 
                alt={item.name || 'Lead'}
                className="w-full h-full object-cover rounded-lg"
                onError={handleImageError}
              />
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-600" 
                style={{ display: 'none' }}
              >
                {item.initials}
              </div>
            </div>
          }
          badge={<StatusBadge status={item.stage || "new"} size="sm" />}
          showCheckbox={showCheckbox}
          isSelected={item.isSelected}
          onSelect={onToggleSelection ? () => handleItemSelect(item) : undefined}
          onClick={() => handleItemClick(item.id)}
        />
      );
    } else {
      return (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.title}
          subtitle={`${item.location} • ${item.formattedDate}`}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
          badge={<StatusBadge status={item.priority || "Medium"} size="sm" />}
          onClick={() => handleItemClick(item.id)}
        />
      );
    }
  }, [itemType, showCheckbox, onToggleSelection, handleImageError, handleItemClick, handleItemSelect]);

  const renderEmptyState = () => {
    const Icon = itemType === 'lead' ? User : Briefcase;
    const message = itemType === 'lead' ? 'No related leads found' : 'No related jobs found';
    
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Icon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">{message}</p>
      </div>
    );
  };

  return (
    <InfoCard 
      title={`${title} (${items?.length || 0})`}
      showDivider={false}
      contentSpacing="space-y-3 pt-3"
      actionButton={
        showAutomateButton ? (
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-sm px-6 py-1 !h-8 min-h-[32px]"
            disabled={selectedLeads.length === 0}
          >
            Automate ({selectedLeads.length})
          </Button>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      ) : items && items.length > 0 ? (
        <div className="space-y-3">
          {processedItems.map(renderItem)}
        </div>
      ) : (
        renderEmptyState()
      )}
    </InfoCard>
  );
});
