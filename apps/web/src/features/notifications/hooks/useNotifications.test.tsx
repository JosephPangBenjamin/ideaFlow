import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useNotifications } from './useNotifications';
import { notificationsService } from '../services/notifications.service';
import { Provider } from 'jotai';
import React from 'react';

// Mock service
vi.mock('../services/notifications.service', () => ({
  notificationsService: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

describe('useNotifications Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children} </Provider>;

  it('should load more notifications when loadMore is called', async () => {
    const page1Data = {
      data: Array.from({ length: 10 }, (_, i) => ({
        id: `id-${i}`,
        title: `Title ${i}`,
        isRead: false,
      })),
      meta: { total: 25, page: 1, pageSize: 10, totalPages: 3 },
    };
    const page2Data = {
      data: Array.from({ length: 10 }, (_, i) => ({
        id: `id-${i + 10}`,
        title: `Title ${i + 10}`,
        isRead: false,
      })),
      meta: { total: 25, page: 2, pageSize: 10, totalPages: 3 },
    };

    (notificationsService.getNotifications as any)
      .mockResolvedValueOnce(page1Data)
      .mockResolvedValueOnce(page2Data);
    (notificationsService.getUnreadCount as any).mockResolvedValue(5);

    const { result } = renderHook(() => useNotifications(), { wrapper });

    // Initial fetch
    await act(async () => {
      await result.current.fetchNotifications();
    });

    expect(result.current.notifications).toHaveLength(10);
    expect((result.current as any).hasMore).toBe(true);

    // Load more
    await act(async () => {
      await (result.current as any).loadMore();
    });

    expect(result.current.notifications).toHaveLength(20);

    expect(result.current.notifications[10].id).toBe('id-10');
    expect((result.current as any).hasMore).toBe(true);
  });
});
