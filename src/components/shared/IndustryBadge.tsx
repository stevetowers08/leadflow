import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 * Industry Badge Component
 * Displays industry as a colored badge with consistent styling
 */

export interface IndustryBadgeProps {
  industry: string | null | undefined;
  className?: string;
  variant?: 'default' | 'compact' | 'outline';
}

export interface IndustryBadgesProps {
  industries: string | string[] | null | undefined;
  className?: string;
  badgeClassName?: string;
  badgeVariant?: 'default' | 'compact' | 'outline';
  maxVisible?: number; // optional cap with "+N" overflow
  noWrap?: boolean; // force single-line badges container
  showOverflowIndicator?: boolean; // when true, show +N popover; otherwise just cut off
}

/**
 * Maps industry names to color classes for consistent branding
 */
const industryColors: Record<string, string> = {
  // Technology & IT
  technology: 'bg-primary/10 text-primary border-primary/20',
  'information technology': 'bg-primary/10 text-primary border-primary/20',
  'computer software': 'bg-primary/10 text-primary border-primary/20',
  telecommunications: 'bg-primary/10 text-primary border-primary/20',
  internet: 'bg-primary/10 text-primary border-primary/20',

  // Healthcare
  healthcare: 'bg-success/10 text-success border-success/20',
  'health care': 'bg-success/10 text-success border-success/20',
  medical: 'bg-success/10 text-success border-success/20',
  pharmaceuticals: 'bg-success/10 text-success border-success/20',
  biotechnology: 'bg-success/10 text-success border-success/20',

  // Finance
  finance: 'bg-warning/10 text-warning border-warning/20',
  banking: 'bg-warning/10 text-warning border-warning/20',
  'financial services': 'bg-warning/10 text-warning border-warning/20',
  insurance: 'bg-warning/10 text-warning border-warning/20',
  accounting: 'bg-warning/10 text-warning border-warning/20',

  // Education
  education: 'bg-primary/10 text-primary border-primary/20',
  'higher education': 'bg-primary/10 text-primary border-primary/20',
  'e-learning': 'bg-primary/10 text-primary border-primary/20',

  // Manufacturing & Industrial
  manufacturing: 'bg-muted text-foreground border-border',
  automotive: 'bg-muted text-foreground border-border',
  aerospace: 'bg-muted text-foreground border-border',
  construction: 'bg-muted text-foreground border-border',

  // Retail & Consumer
  retail: 'bg-warning/10 text-warning border-warning/20',
  'consumer goods': 'bg-warning/10 text-warning border-warning/20',
  ecommerce: 'bg-primary/10 text-primary border-primary/20',

  // Professional Services
  consulting: 'bg-primary/10 text-primary border-primary/20',
  legal: 'bg-muted text-foreground border-border',

  // Marketing & Advertising
  marketing: 'bg-primary/10 text-primary border-primary/20',
  advertising: 'bg-warning/10 text-warning border-warning/20',
  'public relations': 'bg-warning/10 text-warning border-warning/20',

  // Real Estate
  'real estate': 'bg-primary/10 text-primary border-primary/20',
  'property management': 'bg-primary/10 text-primary border-primary/20',

  // Non-profit
  'non-profit': 'bg-success/10 text-success border-success/20',
  'non profit': 'bg-success/10 text-success border-success/20',
  nonprofit: 'bg-success/10 text-success border-success/20',

  // Energy & Utilities
  energy: 'bg-warning/10 text-warning border-warning/20',
  utilities: 'bg-warning/10 text-warning border-warning/20',
  'oil & gas': 'bg-warning/10 text-warning border-warning/20',

  // Hospitality & Tourism
  hospitality: 'bg-warning/10 text-warning border-warning/20',
  tourism: 'bg-warning/10 text-warning border-warning/20',
  'food & beverage': 'bg-destructive/10 text-destructive border-destructive/20',

  // Media & Entertainment
  media: 'bg-primary/10 text-primary border-primary/20',
  entertainment: 'bg-warning/10 text-warning border-warning/20',
  'broadcast media': 'bg-primary/10 text-primary border-primary/20',

  // Transportation & Logistics
  transportation: 'bg-primary/10 text-primary border-primary/20',
  logistics: 'bg-primary/10 text-primary border-primary/20',
  shipping: 'bg-primary/10 text-primary border-primary/20',

  // Government & Public Sector
  government: 'bg-muted text-foreground border-border',
  'public sector': 'bg-muted text-foreground border-border',

  // Agriculture
  agriculture: 'bg-success/10 text-success border-success/20',
  'agriculture & forestry': 'bg-success/10 text-success border-success/20',
};

/**
 * Gets the color class for an industry
 */
function getIndustryColor(industry: string | null | undefined): string {
  if (!industry) {
    return 'bg-muted text-muted-foreground border-border';
  }

  const normalized = industry.toLowerCase().trim();
  return (
    industryColors[normalized] || 'bg-muted text-foreground border-border'
  );
}

export function IndustryBadge({
  industry,
  className,
  variant = 'default',
}: IndustryBadgeProps) {
  if (!industry) {
    return null;
  }

  const colorClass = getIndustryColor(industry);
  const sizeClass =
    variant === 'compact' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const borderClass = variant === 'outline' ? 'border-2' : 'border';

  return (
    <Badge
      variant='outline'
      className={cn(
        'rounded-md font-medium whitespace-nowrap',
        colorClass,
        sizeClass,
        borderClass,
        className
      )}
    >
      {industry}
    </Badge>
  );
}

// Utility: split a free-text industries string into clean tokens
function parseIndustries(value: string): string[] {
  return value
    .split(/[,;/|]|\s&\s|\sand\s/i)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.replace(/^&\s*/, '')) // cleanup leading ampersand
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

export function IndustryBadges({
  industries,
  className,
  badgeClassName,
  badgeVariant = 'compact',
  maxVisible = 3,
  noWrap = false,
  showOverflowIndicator = true,
}: IndustryBadgesProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  if (!industries) return null;

  const items = Array.isArray(industries)
    ? industries
    : parseIndustries(industries);

  if (items.length === 0) return null;

  const showTruncate = showOverflowIndicator && items.length > maxVisible;
  const visible = showOverflowIndicator ? items.slice(0, maxVisible) : items;
  const overflow = items.length - visible.length;

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex items-center gap-1',
          noWrap ? 'flex-nowrap overflow-hidden' : 'flex-wrap',
          className
        )}
      >
        {visible.map(item => (
          <IndustryBadge
            key={item}
            industry={item}
            variant={badgeVariant}
            className={cn('flex-shrink-0', badgeClassName)}
          />
        ))}
        {showTruncate && (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  'px-1.5 py-0.5 text-xs rounded-md border',
                  'bg-muted text-foreground border-border',
                  'hover:bg-gray-200 transition-colors',
                  'cursor-pointer whitespace-nowrap shrink-0'
                )}
                onClick={e => {
                  e.stopPropagation();
                  setIsPopoverOpen(true);
                }}
              >
                +{overflow}
              </button>
            </PopoverTrigger>
          <PopoverContent
            className='w-auto p-3 max-w-sm'
            onClick={e => e.stopPropagation()}
          >
            <div className='font-medium text-sm mb-2 text-foreground'>
              All Industries ({items.length})
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {items.map(item => (
                <IndustryBadge
                  key={item}
                  industry={item}
                  variant={badgeVariant}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
      </div>
    </TooltipProvider>
  );
}
