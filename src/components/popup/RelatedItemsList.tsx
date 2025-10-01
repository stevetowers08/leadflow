import React from 'react';
import { InfoCard } from '../shared/InfoCard';
import { Button } from '@/components/ui/button';
import { ListItem } from '../shared/ListItem';
import { StatusBadge } from '../StatusBadge';
import { AssignedUserBadge } from '../AssignedUserBadge';
import { getProfileImage } from '@/utils/linkedinProfileUtils';
import { formatDateForSydney } from '@/utils/timezoneUtils';
import { User, Users } from 'lucide-react';

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
  onAutomationClick?: () => void;
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
  itemType,
  onAutomationClick
}) => {
  const renderItem = (item: any) => {
    if (itemType === 'lead') {
      return (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.name}
          subtitle={item.company_role}
          badge={
            <div className="flex items-center gap-2">
              <StatusBadge status={item.stage || "new"} size="sm" />
              <AssignedUserBadge 
                ownerId={item.owner_id} 
                automationStatus={null} 
              />
            </div>
          }
          showCheckbox={showCheckbox}
          isSelected={selectedLeads.some(selected => selected.id === item.id)}
          onSelect={onToggleSelection ? (id: string, checked: boolean) => onToggleSelection(id) : undefined}
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


  return (
    <InfoCard 
      title={`${title} (${items?.length || 0})`}
      showDivider={false}
      contentSpacing="space-y-6 pt-1.5"
      actionButton={
        showAutomateButton ? (
          <Button 
            size="sm" 
            className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground text-sm px-6 py-1 !h-8 min-h-[32px]"
            disabled={selectedLeads.length === 0}
            onClick={onAutomationClick}
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
        // Empty state - just show empty content, no text or icon
        <div></div>
      )}
    </InfoCard>
  );
};
