/**
 * Onboarding Context - Minimal implementation
 * Tracks first-time user state and shows guided tooltips when needed
 */

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface OnboardingState {
  isFirstTime: boolean;
  hasSeenWelcome: boolean;
  jobsQualifiedCount: number;
  hasSeenCompanies: boolean;
  hasSentMessage: boolean;
  completedSteps: string[];
}

interface OnboardingContextType {
  state: OnboardingState;
  markStepComplete: (step: string) => void;
  incrementJobsQualified: () => void;
  markMessageSent: () => void;
}

const defaultState: OnboardingState = {
  isFirstTime: true,
  hasSeenWelcome: false,
  jobsQualifiedCount: 0,
  hasSeenCompanies: false,
  hasSentMessage: false,
  completedSteps: [],
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('onboarding_state');
    return stored ? JSON.parse(stored) : defaultState;
  });

  // Persist to localStorage on changes
  useEffect(() => {
    localStorage.setItem('onboarding_state', JSON.stringify(state));
  }, [state]);

  const markStepComplete = (step: string) => {
    setState(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, step],
    }));
  };

  const incrementJobsQualified = () => {
    setState(prev => ({
      ...prev,
      jobsQualifiedCount: prev.jobsQualifiedCount + 1,
    }));
  };

  const markMessageSent = () => {
    setState(prev => ({
      ...prev,
      hasSentMessage: true,
    }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        markStepComplete,
        incrementJobsQualified,
        markMessageSent,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
