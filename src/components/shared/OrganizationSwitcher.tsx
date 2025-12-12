import { useOrganization } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OrganizationSwitcher() {
  const { currentOrganization, organizations, switchOrganization, isLoading } = useOrganization();

  if (isLoading || organizations.length === 0) {
    return null;
  }

  // Don't show switcher if user only has one organization
  if (organizations.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span className="truncate">{currentOrganization?.name || 'Organization'}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto font-normal"
        >
          <Building2 className="h-4 w-4" />
          <span className="truncate max-w-[200px]">
            {currentOrganization?.name || 'Select Organization'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[250px]">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrganization(org.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="font-medium truncate">{org.name}</span>
              {org.company_name && (
                <span className="text-xs text-muted-foreground truncate">
                  {org.company_name}
                </span>
              )}
            </div>
            {currentOrganization?.id === org.id && (
              <Check className="h-4 w-4 ml-2 flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

