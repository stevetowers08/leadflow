// AI Context Provider for global AI state management
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { aiService, type AIServiceConfig } from '../services/aiService';
import { geminiService } from '../services/geminiService';
import { useAIServiceStatus } from '../hooks/useAI';

export interface AIProviderState {
  // Service status
  isAvailable: boolean;
  activeProvider: 'openai' | 'gemini' | 'none';
  providers: {
    openai: { available: boolean; model: string };
    gemini: { available: boolean; model: string };
  };
  
  // Configuration
  config: AIServiceConfig;
  
  // Usage statistics
  usage: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    tokensUsed: number;
    lastUsed: Date | null;
  };
  
  // Error handling
  lastError: string | null;
  
  // Actions
  updateConfig: (config: Partial<AIServiceConfig>) => void;
  resetUsage: () => void;
  refreshStatus: () => void;
}

const AIContext = createContext<AIProviderState | undefined>(undefined);

export interface AIProviderProps {
  children: ReactNode;
  initialConfig?: AIServiceConfig;
}

export function AIProvider({ children, initialConfig }: AIProviderProps) {
  const [config, setConfig] = useState<AIServiceConfig>(
    initialConfig || { provider: 'auto' }
  );
  
  const [usage, setUsage] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    tokensUsed: 0,
    lastUsed: null as Date | null
  });
  
  const [lastError, setLastError] = useState<string | null>(null);

  const { status, geminiStatus, isLoading, error, refresh } = useAIServiceStatus();

  const updateConfig = useCallback((newConfig: Partial<AIServiceConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetUsage = useCallback(() => {
    setUsage({
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      tokensUsed: 0,
      lastUsed: null
    });
  }, []);

  const refreshStatus = useCallback(() => {
    refresh();
  }, [refresh]);

  // Update AI service configuration when config changes
  useEffect(() => {
    // Recreate AI service with new config
    // This is handled by the service itself through the config parameter
  }, [config]);

  // Track usage statistics
  const trackUsage = useCallback((success: boolean, tokensUsed: number = 0) => {
    setUsage(prev => ({
      totalRequests: prev.totalRequests + 1,
      successfulRequests: prev.successfulRequests + (success ? 1 : 0),
      failedRequests: prev.failedRequests + (success ? 0 : 1),
      tokensUsed: prev.tokensUsed + tokensUsed,
      lastUsed: new Date()
    }));
  }, []);

  // Track errors
  const trackError = useCallback((error: string) => {
    setLastError(error);
    trackUsage(false);
  }, [trackUsage]);

  const contextValue: AIProviderState = {
    isAvailable: status.available,
    activeProvider: status.activeProvider as 'openai' | 'gemini' | 'none',
    providers: status.providers,
    config,
    usage,
    lastError,
    updateConfig,
    resetUsage,
    refreshStatus
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

// Higher-order component for AI functionality
export function withAI<P extends object>(Component: React.ComponentType<P>) {
  return function AIWrappedComponent(props: P) {
    return (
      <AIProvider>
        <Component {...props} />
      </AIProvider>
    );
  };
}

// AI Status Indicator Component
export function AIStatusIndicator() {
  const { isAvailable, activeProvider, providers, usage, lastError } = useAI();
  
  if (!isAvailable) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span>AI Service Unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          activeProvider === 'gemini' ? 'bg-green-500' : 
          activeProvider === 'openai' ? 'bg-blue-500' : 'bg-gray-500'
        }`}></div>
        <span className="text-gray-600">
          AI: {activeProvider === 'gemini' ? 'Gemini (Free)' : 
               activeProvider === 'openai' ? 'OpenAI' : 'None'}
        </span>
      </div>
      
      {usage.totalRequests > 0 && (
        <div className="text-gray-500">
          {usage.successfulRequests}/{usage.totalRequests} requests
        </div>
      )}
      
      {lastError && (
        <div className="text-red-500 text-xs" title={lastError}>
          ⚠️ Error
        </div>
      )}
    </div>
  );
}

// AI Configuration Panel Component
export function AIConfigurationPanel() {
  const { config, updateConfig, providers, refreshStatus } = useAI();
  
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Configuration</h3>
        <button
          onClick={refreshStatus}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Refresh Status
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">AI Provider</label>
          <select
            value={config.provider}
            onChange={(e) => updateConfig({ provider: e.target.value as any })}
            className="w-full p-2 border rounded"
          >
            <option value="auto">Auto (Prefer Free)</option>
            <option value="gemini" disabled={!providers.gemini.available}>
              Gemini (Free) {!providers.gemini.available && '- Not Available'}
            </option>
            <option value="openai" disabled={!providers.openai.available}>
              OpenAI {!providers.openai.available && '- Not Available'}
            </option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium">Gemini Status</div>
            <div className={`text-sm ${providers.gemini.available ? 'text-green-600' : 'text-red-600'}`}>
              {providers.gemini.available ? 'Available' : 'Not Available'}
            </div>
            <div className="text-xs text-gray-500">
              Model: {providers.gemini.model}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium">OpenAI Status</div>
            <div className={`text-sm ${providers.openai.available ? 'text-green-600' : 'text-red-600'}`}>
              {providers.openai.available ? 'Available' : 'Not Available'}
            </div>
            <div className="text-xs text-gray-500">
              Model: {providers.openai.model}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
