import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  technology: 'bg-blue-100 text-blue-800 border-blue-200',
  'information technology': 'bg-blue-100 text-blue-800 border-blue-200',
  'computer software': 'bg-blue-100 text-blue-800 border-blue-200',
  telecommunications: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  internet: 'bg-purple-100 text-purple-800 border-purple-200',

  // Healthcare
  healthcare: 'bg-green-100 text-green-800 border-green-200',
  'health care': 'bg-green-100 text-green-800 border-green-200',
  medical: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  pharmaceuticals: 'bg-teal-100 text-teal-800 border-teal-200',
  biotechnology: 'bg-lime-100 text-lime-800 border-lime-200',

  // Finance
  finance: 'bg-amber-100 text-amber-800 border-amber-200',
  banking: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'financial services': 'bg-amber-100 text-amber-800 border-amber-200',
  insurance: 'bg-orange-100 text-orange-800 border-orange-200',
  accounting: 'bg-yellow-100 text-yellow-800 border-yellow-200',

  // Education
  education: 'bg-sky-100 text-sky-800 border-sky-200',
  'higher education': 'bg-sky-100 text-sky-800 border-sky-200',
  'e-learning': 'bg-cyan-100 text-cyan-800 border-cyan-200',

  // Manufacturing & Industrial
  manufacturing: 'bg-gray-100 text-gray-800 border-gray-200',
  automotive: 'bg-slate-100 text-slate-800 border-slate-200',
  aerospace: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  construction: 'bg-stone-100 text-stone-800 border-stone-200',

  // Retail & Consumer
  retail: 'bg-pink-100 text-pink-800 border-pink-200',
  'consumer goods': 'bg-rose-100 text-rose-800 border-rose-200',
  ecommerce: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',

  // Professional Services
  consulting: 'bg-violet-100 text-violet-800 border-violet-200',
  legal: 'bg-slate-100 text-slate-800 border-slate-200',

  // Marketing & Advertising
  marketing: 'bg-purple-100 text-purple-800 border-purple-200',
  advertising: 'bg-pink-100 text-pink-800 border-pink-200',
  'public relations': 'bg-rose-100 text-rose-800 border-rose-200',

  // Real Estate
  'real estate': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'property management': 'bg-sky-100 text-sky-800 border-sky-200',

  // Non-profit
  'non-profit': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'non profit': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  nonprofit: 'bg-emerald-100 text-emerald-800 border-emerald-200',

  // Energy & Utilities
  energy: 'bg-amber-100 text-amber-800 border-amber-200',
  utilities: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'oil & gas': 'bg-orange-100 text-orange-800 border-orange-200',

  // Hospitality & Tourism
  hospitality: 'bg-pink-100 text-pink-800 border-pink-200',
  tourism: 'bg-rose-100 text-rose-800 border-rose-200',
  'food & beverage': 'bg-red-100 text-red-800 border-red-200',

  // Media & Entertainment
  media: 'bg-purple-100 text-purple-800 border-purple-200',
  entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
  'broadcast media': 'bg-violet-100 text-violet-800 border-violet-200',

  // Transportation & Logistics
  transportation: 'bg-blue-100 text-blue-800 border-blue-200',
  logistics: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  shipping: 'bg-indigo-100 text-indigo-800 border-indigo-200',

  // Government & Public Sector
  government: 'bg-slate-100 text-slate-800 border-slate-200',
  'public sector': 'bg-gray-100 text-gray-800 border-gray-200',

  // Agriculture
  agriculture: 'bg-lime-100 text-lime-800 border-lime-200',
  'agriculture & forestry': 'bg-green-100 text-green-800 border-green-200',
};

/**
 * Gets the color class for an industry
 */
function getIndustryColor(industry: string | null | undefined): string {
  if (!industry) {
    return 'bg-gray-100 text-gray-500 border-gray-200';
  }

  const normalized = industry.toLowerCase().trim();
  return (
    industryColors[normalized] || 'bg-gray-100 text-gray-700 border-gray-200'
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
    <div
      className={cn(
        'flex items-center gap-1',
        noWrap ? 'flex-nowrap overflow-hidden' : 'flex-wrap',
        className
      )}
    >
      {/* Always visible badges */}
      {visible.map(item => (
        <IndustryBadge
          key={item}
          industry={item}
          variant={badgeVariant}
          className={cn('shrink-0', badgeClassName)}
        />
      ))}

      {/* Overflow indicator */}
      {showTruncate && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                'px-2 py-0.5 text-xs rounded-md border',
                'bg-gray-100 text-gray-700 border-gray-200',
                'hover:bg-gray-200 transition-colors',
                'cursor-pointer whitespace-nowrap shrink-0'
              )}
              onClick={e => {
                e.stopPropagation();
                setIsPopoverOpen(true);
              }}
            >
              +{overflow} more
            </button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto p-3 max-w-sm'
            onClick={e => e.stopPropagation()}
          >
            <div className='font-medium text-sm mb-2 text-gray-700'>
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
  );
}
