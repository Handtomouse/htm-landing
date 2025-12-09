// Haptic feedback hook with Vibration API (mobile-first)
export function useHapticFeedback() {
  return (pattern: number | number[] = 10) => {
    if (typeof window === 'undefined') return;

    try {
      // Check if vibration API is supported
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Silently fail if vibration not supported
    }
  };
}
