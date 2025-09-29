import React from 'react';
import { InfoCard } from '../shared/InfoCard';
import { Button } from '@/components/ui/button';
import { ListItem } from '../shared/ListItem';
import { StatusBadge } from '../StatusBadge';
import { getProfileImage } from '@/utils/linkedinProfileUtils';
import { formatDateForSydney } from '@/utils/timezoneUtils';
import { User, Users, Briefcase } from 'lucide-react';

interface RelatedItemsListProps {
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

export const RelatedItemsList: React.FC<RelatedItemsListProps> = ({
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
  const renderItem = (item: any) => {
    if (itemType === 'lead') {
      return (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.name}
          subtitle={item.company_role}
          badge={<StatusBadge status={item.stage || "new"} size="sm" />}
          showCheckbox={showCheckbox}
          isSelected={selectedLeads.some(selected => selected.id === item.id)}
          onSelect={onToggleSelection ? (id: string, checked: boolean) => onToggleSelection(item.id) : undefined}
          onClick={() => onItemClick(item.id)}
        />
      );
    } else {
      return (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.title}
          subtitle={`${item.location} • ${item.created_at ? formatDateForSydney(item.created_at, 'date') : "No date"}`}
          badge={<StatusBadge status={item.priority || "Medium"} size="sm" />}
          onClick={() => onItemClick(item.id)}
        />
      );
    }
  };

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
            className="bg-primary hover:bg-primary/90 text-sm px-6 py-1 !h-8 min-h-[32px]"
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
          {items.slice(0, 5).map(renderItem)}
        </div>
      ) : (
        renderEmptyState()
      )}
    </InfoCard>
  );
};
