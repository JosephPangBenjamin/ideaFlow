import { api } from '@/services/api';
import type { Notification, GetNotificationsParams, ApiResponse } from '../types';

export const notificationsService = {
  /**
   * 获取通知列表
   */
  async getNotifications(params: GetNotificationsParams): Promise<ApiResponse<Notification[]>> {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  /**
   * 获取未读通知数量
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  /**
   * 标记通知为已读
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * 标记所有通知为已读
   */
  async markAllAsRead(): Promise<{ count: number }> {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
};
