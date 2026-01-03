import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { analyticsService } from '@/services/analytics.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependency
vi.mock('@/services/analytics.service', () => ({
  analyticsService: {
    track: vi.fn(),
  },
}));

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call analyticsService.track with correct arguments', async () => {
    const { result } = renderHook(() => useAnalytics());

    await act(async () => {
      await result.current.track('test_event', { foo: 'bar' });
    });

    expect(analyticsService.track).toHaveBeenCalledWith({
      eventName: 'test_event',
      metadata: { foo: 'bar' },
    });
  });

  it('should handle tracking errors gracefully', async () => {
    const { result } = renderHook(() => useAnalytics());
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    (analyticsService.track as any).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      // Should not throw
      await result.current.track('test_event');
    });

    expect(analyticsService.track).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Analytics error'),
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
