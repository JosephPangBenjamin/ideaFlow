import { useCallback } from 'react';
import { analyticsService } from '@/services/analytics.service';

export function useAnalytics() {
  const track = useCallback(async (eventName: string, metadata?: Record<string, any>) => {
    try {
      await analyticsService.track({ eventName, metadata });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  return { track };
}
