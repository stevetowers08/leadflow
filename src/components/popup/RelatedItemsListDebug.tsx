import React from 'react';
import { InfoCard } from '../shared/InfoCard';
import { Button } from '@/components/ui/button';
import { ListItem } from '../shared/ListItem';
import { StatusBadge } from '../StatusBadge';
import { getProfileImage } from '@/utils/linkedinProfileUtils';
import { formatDateForSydney } from '@/utils/timezoneUtils';
import { User, Users, Briefcase } from 'lucide-react';

interface RelatedItemsListDebugProps {
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

export const RelatedItemsListDebug: React.FC<RelatedItemsListDebugProps> = ({
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
  const handleSelect = (item: any) => {
    console.log('🔍 Debug: Select button clicked for item:', item);
    console.log('🔍 Debug: onToggleSelection function:', onToggleSelection);
    
    if (onToggleSelection) {
      console.log('🔍 Debug: Calling onToggleSelection with item.id:', item.id);
      onToggleSelection(item.id);
    } else {
      console.log('🔍 Debug: onToggleSelection is undefined');
    }
  };

  const renderItem = (item: any) => {
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
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-600" 
                style={{ display: 'none' }}
              >
                {initials}
              </div>
            </div>
          }
          badge={<StatusBadge status={item.stage || "new"} size="sm" />}
          showCheckbox={showCheckbox}
          isSelected={selectedLeads.some(selected => selected.id === item.id)}
          onSelect={showCheckbox ? (id: string, checked: boolean) => {
            console.log('🔍 Debug: ListItem onSelect called with:', { id, checked });
            handleSelect(item);
          } : undefined}
          onClick={() => {
            console.log('🔍 Debug: ListItem onClick called for item:', item.id);
            onItemClick(item.id);
          }}
        />
      );
    } else {
      return (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.title}
          subtitle={`${item.location} • ${item.posted_date ? formatDateForSydney(item.posted_date, 'date') : "No date"}`}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
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
            className="bg-blue-600 hover:bg-blue-700 text-sm px-6 py-1 !h-8 min-h-[32px]"
            disabled={selectedLeads.length === 0}
            onClick={() => {
              console.log('🔍 Debug: Automate button clicked with selected leads:', selectedLeads);
            }}
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
