/**
 * Custom hook for haptic feedback on supported devices
 * Provides tactile feedback for touch interactions
 */

import { useCallback } from 'react';

export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error';

interface HapticFeedbackOptions {
  type?: HapticFeedbackType;
  duration?: number;
  intensity?: number;
}

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((options: HapticFeedbackOptions = {}) => {
    const { type = 'light', duration = 10, intensity = 0.5 } = options;

    // Check if device supports haptic feedback
    if (!('vibrate' in navigator)) {
      return;
    }

    // Different vibration patterns for different feedback types
    const patterns: Record<HapticFeedbackType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [20, 50, 20],
      error: [30, 100, 30],
    };

    const pattern = patterns[type];

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail if vibration is not supported
      console.debug('Haptic feedback not supported:', error);
    }
  }, []);

  const lightHaptic = useCallback(
    () => triggerHaptic({ type: 'light' }),
    [triggerHaptic]
  );
  const mediumHaptic = useCallback(
    () => triggerHaptic({ type: 'medium' }),
    [triggerHaptic]
  );
  const heavyHaptic = useCallback(
    () => triggerHaptic({ type: 'heavy' }),
    [triggerHaptic]
  );
  const successHaptic = useCallback(
    () => triggerHaptic({ type: 'success' }),
    [triggerHaptic]
  );
  const warningHaptic = useCallback(
    () => triggerHaptic({ type: 'warning' }),
    [triggerHaptic]
  );
  const errorHaptic = useCallback(
    () => triggerHaptic({ type: 'error' }),
    [triggerHaptic]
  );

  return {
    triggerHaptic,
    lightHaptic,
    mediumHaptic,
    heavyHaptic,
    successHaptic,
    warningHaptic,
    errorHaptic,
  };
};
