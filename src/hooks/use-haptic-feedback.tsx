import { useCallback } from 'react';

interface HapticFeedback {
  light: () => void;
  medium: () => void;
  heavy: () => void;
  success: () => void;
  warning: () => void;
  error: () => void;
}

export function useHapticFeedback(): HapticFeedback {
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(50);
          break;
        case 'heavy':
          navigator.vibrate([100, 30, 100]);
          break;
      }
    }
  }, []);

  const triggerHapticPattern = useCallback((pattern: number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  return {
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHapticPattern([50, 50, 100]),
    warning: () => triggerHapticPattern([100, 50, 100, 50, 100]),
    error: () => triggerHapticPattern([200, 100, 200]),
  };
}