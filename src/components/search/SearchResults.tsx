import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SearchResult } from '@/services/globalSearchService';
import {
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Star,
  User,
  Zap,
} from 'lucide-react';
import React from 'react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

const getTypeIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'lead':
      return Briefcase;
    case 'company':
      return Building2;
    default:
      return User;
  }
};

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'lead':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'company':
      return 'bg-green-100 text-success border-green-200';
    default:
      return 'bg-gray-100 text-foreground border-border';
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'lead':
      return 'Lead';
    case 'company':
      return 'Company';
    default:
      return 'Unknown';
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  } catch {
    return null;
  }
};

const SearchResultItem: React.FC<{
  result: SearchResult;
  onClick?: (result: SearchResult) => void;
}> = ({ result, onClick }) => {
  const typeColor = getTypeColor(result.type);
  const typeLabel = getTypeLabel(result.type);

  const handleClick = () => {
    onClick?.(result);
  };

  return (
    <Card className='cursor-pointer transition-all' onClick={handleClick}>
      <CardContent className='p-4'>
        <div className='flex items-start gap-3'>
          {/* Icon */}
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              typeColor
            )}
          >
            {React.createElement(getTypeIcon(result.type), {
              className: 'w-5 h-5',
            })}
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            {/* Title and Type Badge */}
            <div className='flex items-start justify-between gap-2 mb-2'>
              <h3 className='font-semibold text-foreground truncate'>
                {result.title}
              </h3>
              <Badge variant='outline' className={cn('text-xs', typeColor)}>
                {typeLabel}
              </Badge>
            </div>

            {/* Subtitle */}
            {result.subtitle && (
              <p className='text-sm text-muted-foreground mb-2 truncate'>
                {result.subtitle}
              </p>
            )}

            {/* Description */}
            {result.description && (
              <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                {result.description}
              </p>
            )}

            {/* Metadata */}
            <div className='flex items-center gap-4 text-xs text-muted-foreground'>
              {result.type === 'lead' &&
              result.metadata &&
              'email' in result.metadata &&
              result.metadata.email ? (
                <div className='flex items-center gap-1'>
                  <Mail className='w-3 h-3' />
                  <span className='truncate max-w-32'>
                    {String(result.metadata.email)}
                  </span>
                </div>
              ) : null}

              {result.metadata &&
              'employeeLocation' in result.metadata &&
              result.metadata.employeeLocation ? (
                <div className='flex items-center gap-1'>
                  <MapPin className='w-3 h-3' />
                  <span className='truncate max-w-24'>
                    {String(result.metadata.employeeLocation)}
                  </span>
                </div>
              ) : null}

              {result.type === 'company' &&
              result.metadata &&
              'companySize' in result.metadata &&
              result.metadata.companySize ? (
                <div className='flex items-center gap-1'>
                  <Building2 className='w-3 h-3' />
                  <span>{String(result.metadata.companySize)}</span>
                </div>
              ) : null}

              {/* Posted date for jobs */}
              {result.type === 'lead' &&
              result.metadata &&
              'postedDate' in result.metadata &&
              result.metadata.postedDate ? (
                <div className='flex items-center gap-1'>
                  <Clock className='w-3 h-3' />
                  <span>{formatDate(String(result.metadata.postedDate))}</span>
                </div>
              ) : null}

              {result.metadata &&
              'leadScore' in result.metadata &&
              result.metadata.leadScore ? (
                <div className='flex items-center gap-1'>
                  <Star className='w-3 h-3' />
                  <span>{String(result.metadata.leadScore)}</span>
                </div>
              ) : null}

              {result.metadata &&
              'automationActive' in result.metadata &&
              result.metadata.automationActive ? (
                <div className='flex items-center gap-1 text-success'>
                  <Zap className='w-3 h-3' />
                  <span>Automated</span>
                </div>
              ) : null}

              {result.metadata &&
              'priority' in result.metadata &&
              result.metadata.priority ? (
                <Badge
                  variant='outline'
                  className={cn(
                    'text-xs',
                    String(result.metadata.priority) === 'high' ||
                      String(result.metadata.priority) === 'urgent'
                      ? 'bg-red-100 text-destructive border-red-200'
                      : String(result.metadata.priority) === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-gray-100 text-foreground border-border'
                  )}
                >
                  {String(result.metadata.priority)}
                </Badge>
              ) : null}
            </div>
          </div>

          {/* External link indicator */}
          <ExternalLink className='w-4 h-4 text-muted-foreground flex-shrink-0' />
        </div>
      </CardContent>
    </Card>
  );
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading = false,
  onResultClick,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className='border border-border bg-white'>
            <CardContent className='p-4'>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 bg-gray-200 rounded-lg animate-pulse' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
                  <div className='h-3 bg-gray-200 rounded animate-pulse w-1/2' />
                  <div className='h-3 bg-gray-200 rounded animate-pulse w-2/3' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className='text-muted-foreground'>
          <User className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
          <p className='text-lg font-medium mb-2'>No results found</p>
          <p className='text-sm'>
            Try adjusting your search terms or check your spelling.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {results.map(result => (
        <SearchResultItem
          key={`${result.type}-${result.id}`}
          result={result}
          onClick={onResultClick}
        />
      ))}
    </div>
  );
};
