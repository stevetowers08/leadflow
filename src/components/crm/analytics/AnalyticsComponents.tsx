import { useAuth } from '@/contexts/AuthContext';
import {
  useAnalytics,
  useClickTracking,
  useFormTracking,
  usePageTracking,
  usePopupTracking,
} from '@/hooks/useAnalytics';
import React, { useEffect } from 'react';

// Analytics Dashboard Component
export const AnalyticsDashboard: React.FC = () => {
  const { trackEvent } = useAnalytics();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      trackEvent('analytics_dashboard_view', {
        userId: user.id,
        timestamp: Date.now(),
      });
    }
  }, [user, trackEvent]);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Analytics Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>User Behavior</h3>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Page Views:</span>
              <span className='font-medium'>-</span>
            </div>
            <div className='flex justify-between'>
              <span>Time on Page:</span>
              <span className='font-medium'>-</span>
            </div>
            <div className='flex justify-between'>
              <span>Clicks:</span>
              <span className='font-medium'>-</span>
            </div>
            <div className='flex justify-between'>
              <span>Scroll Depth:</span>
              <span className='font-medium'>-</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>Interactions</h3>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Form Interactions:</span>
              <span className='font-medium'>-</span>
            </div>
            <div className='flex justify-between'>
              <span>Popup Interactions:</span>
              <span className='font-medium'>-</span>
            </div>
            <div className='flex justify-between'>
              <span>Search Queries:</span>
              <span className='font-medium'>-</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>Navigation</h3>
          <div className='space-y-2'>
            <div className='text-sm'>
              <span className='font-medium'>Current Path:</span>
              <div className='text-gray-600'>{window.location.pathname}</div>
            </div>
            <div className='text-sm'>
              <span className='font-medium'>Session ID:</span>
              <div className='text-gray-600 font-mono text-xs'>-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced components with analytics
export const AnalyticsButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  analyticsName: string;
  analyticsProperties?: Record<string, unknown>;
  className?: string;
}> = ({ children, onClick, analyticsName, analyticsProperties, className }) => {
  const trackClick = useClickTracking(analyticsName);

  const handleClick = () => {
    trackClick(analyticsProperties);
    onClick?.();
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export const AnalyticsForm: React.FC<{
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  analyticsName: string;
  className?: string;
}> = ({ children, onSubmit, analyticsName, className }) => {
  const { trackFormSubmit, trackFormError } = useFormTracking(analyticsName);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      trackFormSubmit();
      onSubmit?.(e);
    } catch (error) {
      trackFormError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

export const AnalyticsPopup: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  analyticsName: string;
  analyticsProperties?: Record<string, unknown>;
}> = ({ children, isOpen, onClose, analyticsName, analyticsProperties }) => {
  const { trackPopupOpen, trackPopupClose } = usePopupTracking(analyticsName);

  useEffect(() => {
    if (isOpen) {
      trackPopupOpen(analyticsProperties);
    } else {
      trackPopupClose(analyticsProperties);
    }
  }, [isOpen, trackPopupOpen, trackPopupClose, analyticsProperties]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Analytics Popup</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Page wrapper with analytics
export const AnalyticsPageWrapper: React.FC<{
  children: React.ReactNode;
  pageName: string;
}> = ({ children, pageName }) => {
  usePageTracking(pageName);

  return <>{children}</>;
};

// Search component with analytics
export const AnalyticsSearch: React.FC<{
  placeholder?: string;
  onSearch?: (query: string) => void;
  analyticsName: string;
  className?: string;
}> = ({ placeholder = 'Search...', onSearch, analyticsName, className }) => {
  const { trackEvent } = useAnalytics();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;

    if (query.trim()) {
      trackEvent('search', {
        query: query.trim(),
        component: analyticsName,
      });
      onSearch?.(query.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <input
        type='search'
        name='search'
        placeholder={placeholder}
        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
    </form>
  );
};

// Navigation component with analytics
export const AnalyticsNavigation: React.FC<{
  items: Array<{
    name: string;
    href: string;
    analyticsName: string;
  }>;
  className?: string;
}> = ({ items, className }) => {
  const { trackEvent } = useAnalytics();

  const handleNavigation = (item: (typeof items)[0]) => {
    trackEvent('navigation', {
      from: window.location.pathname,
      to: item.href,
      item: item.analyticsName,
    });
  };

  return (
    <nav className={className}>
      <ul className='flex space-x-4'>
        {items.map(item => (
          <li key={item.name}>
            <a
              href={item.href}
              onClick={() => handleNavigation(item)}
              className='text-blue-600 hover:text-blue-800'
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AnalyticsDashboard;
