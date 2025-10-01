import { useEffect, useCallback, useRef } from 'react';

// Analytics event types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

// User behavior tracking interface
export interface UserBehavior {
  pageViews: number;
  timeOnPage: number;
  clicks: number;
  scrollDepth: number;
  formInteractions: number;
  popupInteractions: number;
  searchQueries: string[];
  navigationPath: string[];
}

// Analytics configuration
interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  trackPageViews: boolean;
  trackClicks: boolean;
  trackScroll: boolean;
  trackFormInteractions: boolean;
  trackPopupInteractions: boolean;
  trackSearchQueries: boolean;
  trackNavigation: boolean;
  sessionTimeout: number; // in minutes
}

const defaultConfig: AnalyticsConfig = {
  enabled: true,
  debug: import.meta.env.DEV,
  trackPageViews: true,
  trackClicks: true,
  trackScroll: true,
  trackFormInteractions: true,
  trackPopupInteractions: true,
  trackSearchQueries: true,
  trackNavigation: true,
  sessionTimeout: 30,
};

class AnalyticsTracker {
  private config: AnalyticsConfig;
  private sessionId: string;
  private userId: string | null = null;
  private behavior: UserBehavior;
  private events: AnalyticsEvent[] = [];
  private pageStartTime: number = Date.now();
  private scrollDepth: number = 0;
  private maxScrollDepth: number = 0;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.sessionId = this.generateSessionId();
    this.behavior = this.initializeBehavior();
    this.setupEventListeners();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeBehavior(): UserBehavior {
    return {
      pageViews: 0,
      timeOnPage: 0,
      clicks: 0,
      scrollDepth: 0,
      formInteractions: 0,
      popupInteractions: 0,
      searchQueries: [],
      navigationPath: [],
    };
  }

  private setupEventListeners(): void {
    if (!this.config.enabled) return;

    // Track page views
    if (this.config.trackPageViews) {
      this.trackPageView();
    }

    // Track clicks
    if (this.config.trackClicks) {
      document.addEventListener('click', this.handleClick.bind(this));
    }

    // Track scroll depth
    if (this.config.trackScroll) {
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    // Track form interactions
    if (this.config.trackFormInteractions) {
      document.addEventListener('input', this.handleFormInteraction.bind(this));
      document.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    // Track popup interactions
    if (this.config.trackPopupInteractions) {
      document.addEventListener('click', this.handlePopupInteraction.bind(this));
    }

    // Track search queries
    if (this.config.trackSearchQueries) {
      document.addEventListener('input', this.handleSearchQuery.bind(this));
    }

    // Track navigation
    if (this.config.trackNavigation) {
      window.addEventListener('popstate', this.handleNavigation.bind(this));
    }

    // Track page unload
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
  }

  private trackPageView(): void {
    this.behavior.pageViews++;
    this.pageStartTime = Date.now();
    this.behavior.navigationPath.push(window.location.pathname);
    
    this.trackEvent('page_view', {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }

  private handleClick(event: MouseEvent): void {
    this.behavior.clicks++;
    
    const target = event.target as HTMLElement;
    const elementInfo = this.getElementInfo(target);
    
    this.trackEvent('click', {
      element: elementInfo,
      position: {
        x: event.clientX,
        y: event.clientY,
      },
    });
  }

  private handleScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
    
    if (scrollPercentage > this.maxScrollDepth) {
      this.maxScrollDepth = scrollPercentage;
      this.behavior.scrollDepth = scrollPercentage;
      
      this.trackEvent('scroll', {
        depth: scrollPercentage,
        maxDepth: this.maxScrollDepth,
      });
    }
  }

  private handleFormInteraction(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      this.behavior.formInteractions++;
      
      this.trackEvent('form_interaction', {
        field: target.name || target.id || target.className,
        type: target.type,
        value: target.value?.length || 0,
      });
    }
  }

  private handleFormSubmit(event: Event): void {
    const target = event.target as HTMLFormElement;
    this.trackEvent('form_submit', {
      form: target.id || target.className,
      action: target.action,
      method: target.method,
    });
  }

  private handlePopupInteraction(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('[role="dialog"]') || target.closest('.popup-modal')) {
      this.behavior.popupInteractions++;
      
      this.trackEvent('popup_interaction', {
        action: 'click',
        element: this.getElementInfo(target),
      });
    }
  }

  private handleSearchQuery(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.type === 'search' || target.placeholder?.toLowerCase().includes('search')) {
      if (target.value.length > 2) {
        this.behavior.searchQueries.push(target.value);
        
        this.trackEvent('search_query', {
          query: target.value,
          field: target.name || target.id,
        });
      }
    }
  }

  private handleNavigation(): void {
    this.trackPageView();
  }

  private handlePageUnload(): void {
    this.behavior.timeOnPage = Date.now() - this.pageStartTime;
    
    this.trackEvent('page_unload', {
      timeOnPage: this.behavior.timeOnPage,
      scrollDepth: this.maxScrollDepth,
      clicks: this.behavior.clicks,
      formInteractions: this.behavior.formInteractions,
      popupInteractions: this.behavior.popupInteractions,
    });
    
    this.sendAnalytics();
  }

  private getElementInfo(element: HTMLElement): Record<string, any> {
    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      text: element.textContent?.substring(0, 100),
      role: element.getAttribute('role'),
      ariaLabel: element.getAttribute('aria-label'),
    };
  }

  public trackEvent(event: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.events.push(analyticsEvent);

    if (this.config.debug) {
      console.log('📊 Analytics Event:', analyticsEvent);
    }
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public getBehavior(): UserBehavior {
    return { ...this.behavior };
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public sendAnalytics(): void {
    if (this.events.length === 0) return;

    // In production, you would send this to your analytics service
    if (this.config.debug) {
      console.log('📊 Sending Analytics:', {
        sessionId: this.sessionId,
        userId: this.userId,
        behavior: this.behavior,
        events: this.events,
      });
    }

    // Reset for next session
    this.events = [];
    this.behavior = this.initializeBehavior();
  }

  public destroy(): void {
    // Remove event listeners
    document.removeEventListener('click', this.handleClick);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('input', this.handleFormInteraction);
    document.removeEventListener('submit', this.handleFormSubmit);
    document.removeEventListener('input', this.handleSearchQuery);
    window.removeEventListener('popstate', this.handleNavigation);
    window.removeEventListener('beforeunload', this.handlePageUnload);
  }
}

// Global analytics instance
let analyticsInstance: AnalyticsTracker | null = null;

export const initializeAnalytics = (config?: Partial<AnalyticsConfig>): AnalyticsTracker => {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker(config);
  }
  return analyticsInstance;
};

export const getAnalytics = (): AnalyticsTracker | null => {
  return analyticsInstance;
};

// React hook for analytics
export const useAnalytics = () => {
  const analyticsRef = useRef<AnalyticsTracker | null>(null);

  useEffect(() => {
    if (!analyticsRef.current) {
      analyticsRef.current = initializeAnalytics();
    }

    return () => {
      // Cleanup on unmount
      analyticsRef.current?.destroy();
    };
  }, []);

  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    analyticsRef.current?.trackEvent(event, properties);
  }, []);

  const setUserId = useCallback((userId: string) => {
    analyticsRef.current?.setUserId(userId);
  }, []);

  const getBehavior = useCallback(() => {
    return analyticsRef.current?.getBehavior();
  }, []);

  return {
    trackEvent,
    setUserId,
    getBehavior,
  };
};

// Specific tracking hooks
export const usePageTracking = (pageName: string) => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('page_view', { page: pageName });
  }, [pageName, trackEvent]);
};

export const useClickTracking = (elementName: string) => {
  const { trackEvent } = useAnalytics();

  const trackClick = useCallback((properties?: Record<string, any>) => {
    trackEvent('click', { element: elementName, ...properties });
  }, [elementName, trackEvent]);

  return trackClick;
};

export const useFormTracking = (formName: string) => {
  const { trackEvent } = useAnalytics();

  const trackFormSubmit = useCallback((properties?: Record<string, any>) => {
    trackEvent('form_submit', { form: formName, ...properties });
  }, [formName, trackEvent]);

  const trackFormError = useCallback((error: string) => {
    trackEvent('form_error', { form: formName, error });
  }, [formName, trackEvent]);

  return { trackFormSubmit, trackFormError };
};

export const usePopupTracking = (popupName: string) => {
  const { trackEvent } = useAnalytics();

  const trackPopupOpen = useCallback((properties?: Record<string, any>) => {
    trackEvent('popup_open', { popup: popupName, ...properties });
  }, [popupName, trackEvent]);

  const trackPopupClose = useCallback((properties?: Record<string, any>) => {
    trackEvent('popup_close', { popup: popupName, ...properties });
  }, [popupName, trackEvent]);

  return { trackPopupOpen, trackPopupClose };
};

export default AnalyticsTracker;





