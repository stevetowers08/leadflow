import React from 'react';
import { Loader2, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  isLoading: boolean;
  isRetrying?: boolean;
  retryCount?: number;
  error?: string | null;
  onRetry?: () => void;
  loadingText?: string;
  errorText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  isRetrying = false,
  retryCount = 0,
  error,
  onRetry,
  loadingText = 'Loading...',
  errorText = 'Something went wrong',
  size = 'md',
  variant = 'spinner',
  className
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-2 p-4', className)}>
        <AlertCircle className={cn('text-red-500', iconSizes[size])} />
        <p className={cn('text-red-600 text-center', sizeClasses[size])}>
          {errorText}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={cn(
              'flex items-center space-x-1 px-3 py-1 text-xs bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors',
              sizeClasses[size]
            )}
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
            {retryCount > 0 && <span>({retryCount})</span>}
          </button>
        )}
      </div>
    );
  }

  if (!isLoading) return null;

  const renderLoadingContent = () => {
    switch (variant) {
      case 'skeleton':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        );
      
      case 'pulse':
        return (
          <div className="flex items-center space-x-2">
            <div className={cn('bg-gray-300 rounded-full animate-pulse', iconSizes[size])} />
            <span className={cn('text-gray-600', sizeClasses[size])}>{loadingText}</span>
          </div>
        );
      
      default: // spinner
        return (
          <div className="flex items-center space-x-2">
            <Loader2 className={cn('animate-spin text-gray-500', iconSizes[size])} />
            <span className={cn('text-gray-600', sizeClasses[size])}>
              {isRetrying ? `Retrying... (${retryCount})` : loadingText}
            </span>
          </div>
        );
    }
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {renderLoadingContent()}
    </div>
  );
};

// Specialized loading components for different contexts
export const InlineLoading: React.FC<Omit<LoadingStateProps, 'variant'>> = (props) => (
  <LoadingState {...props} variant="spinner" size="sm" />
);

export const CardLoading: React.FC<Omit<LoadingStateProps, 'variant'>> = (props) => (
  <LoadingState {...props} variant="skeleton" size="md" />
);

export const ButtonLoading: React.FC<Omit<LoadingStateProps, 'variant'>> = (props) => (
  <LoadingState {...props} variant="spinner" size="sm" />
);

export const PageLoading: React.FC<Omit<LoadingStateProps, 'variant'>> = (props) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingState {...props} variant="spinner" size="lg" />
  </div>
);

// Loading overlay component
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  className
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">{loadingText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress indicator component
export interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  size = 'md',
  className
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="text-gray-500">{percentage}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('bg-blue-600 transition-all duration-300 ease-out', sizeClasses[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{current}</span>
        <span>{total}</span>
      </div>
    </div>
  );
};

// Status indicator component
export interface StatusIndicatorProps {
  status: 'idle' | 'loading' | 'success' | 'error' | 'retrying';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  size = 'md',
  className
}) => {
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: Loader2,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          animate: 'animate-spin'
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          animate: ''
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          animate: ''
        };
      case 'retrying':
        return {
          icon: RefreshCw,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          animate: 'animate-spin'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          animate: ''
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('p-1 rounded-full', config.bgColor)}>
        <IconComponent className={cn(iconSizes[size], config.color, config.animate)} />
      </div>
      {message && (
        <span className={cn('text-sm', config.color)}>
          {message}
        </span>
      )}
    </div>
  );
};
