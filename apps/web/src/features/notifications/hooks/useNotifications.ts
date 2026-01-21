import { useCallback } from 'react';
import { useAtom } from 'jotai';
import {
  notificationsAtom,
  unreadCountAtom,
  isLoadingNotificationsAtom,
  notificationsPageAtom,
  notificationsHasMoreAtom,
} from '../stores/notifications';
import { notificationsService } from '../services/notifications.service';
import { Message } from '@arco-design/web-react';
import { Notification } from '../types';

export function useNotifications() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingNotificationsAtom);
  const [page, setPage] = useAtom(notificationsPageAtom);
  const [hasMore, setHasMore] = useAtom(notificationsHasMoreAtom);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const [listRes, count] = await Promise.all([
        notificationsService.getNotifications({ page: 1, pageSize: 15 }),
        notificationsService.getUnreadCount(),
      ]);
      setNotifications(listRes.data);
      setUnreadCount(count);
      setPage(1);
      setHasMore(listRes.meta ? listRes.meta.page < listRes.meta.totalPages : false);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setNotifications, setUnreadCount, setIsLoading, setPage, setHasMore]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const listRes = await notificationsService.getNotifications({
        page: nextPage,
        pageSize: 15,
      });

      // 避免重复添加：如果第一页已经包含这些数据（理论上不应该，但为了健壮性）
      // 这里我们简单追加，依赖分页逻辑的正确性
      setNotifications((prev: Notification[]) => [...prev, ...listRes.data]);
      setPage(nextPage);
      setHasMore(listRes.meta ? listRes.meta.page < listRes.meta.totalPages : false);
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, setIsLoading, setNotifications, setPage, setHasMore]);

  const markAsRead = useCallback(
    async (id: string) => {
      // 查找目标通知
      const notification = notifications.find((n: Notification) => n.id === id);
      if (!notification || notification.isRead) return;

      // 1. 乐观更新
      setNotifications((prev: Notification[]) =>
        prev.map((n: Notification) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev: number) => Math.max(0, prev - 1));

      try {
        await notificationsService.markAsRead(id);
      } catch (error) {
        // 2. 失败回滚
        setNotifications((prev: Notification[]) =>
          prev.map((n: Notification) => (n.id === id ? { ...n, isRead: false } : n))
        );
        setUnreadCount((prev: number) => prev + 1);
        Message.error('标记已读失败');
      }
    },
    [notifications, setNotifications, setUnreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    // 1. 乐观更新
    const previousNotifications = [...notifications];
    const previousCount = unreadCount;

    setNotifications((prev: Notification[]) =>
      prev.map((n: Notification) => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);

    try {
      await notificationsService.markAllAsRead();
    } catch (error) {
      // 2. 失败回滚
      setNotifications(previousNotifications);
      setUnreadCount(previousCount);
      Message.error('全部标记已读失败');
    }
  }, [notifications, unreadCount, setNotifications, setUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
  };
}
