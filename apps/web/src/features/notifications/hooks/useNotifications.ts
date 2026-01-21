import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  notificationsAtom,
  unreadCountAtom,
  isLoadingNotificationsAtom,
} from '../stores/notifications';
import { notificationsService } from '../services/notifications.service';
import { Message } from '@arco-design/web-react';

export function useNotifications() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingNotificationsAtom);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const [listRes, count] = await Promise.all([
        notificationsService.getNotifications({ page: 1, pageSize: 50 }),
        notificationsService.getUnreadCount(),
      ]);
      setNotifications(listRes.data);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setNotifications, setUnreadCount, setIsLoading]);

  const markAsRead = useCallback(
    async (id: string) => {
      // 查找目标通知
      const notification = notifications.find((n) => n.id === id);
      if (!notification || notification.isRead) return;

      // 1. 乐观更新
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await notificationsService.markAsRead(id);
      } catch (error) {
        // 2. 失败回滚
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
        setUnreadCount((prev) => prev + 1);
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

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
