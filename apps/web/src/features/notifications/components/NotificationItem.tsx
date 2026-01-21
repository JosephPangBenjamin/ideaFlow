import React from 'react';
import { Notification } from '../types';
import { Typography, Space, Tag } from '@arco-design/web-react';
import { IconClockCircle } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  return (
    <div
      className={`p-4 cursor-pointer transition-all border-b border-slate-100 dark:border-slate-700/50 last:border-none group
                ${
                  !notification.isRead
                    ? 'bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
      onClick={() => onClick(notification.id)}
    >
      <Space direction="vertical" size={6} className="w-full">
        <div className="flex justify-between items-start gap-2">
          <Typography.Text
            className={`text-sm leading-snug flex-1 ${!notification.isRead ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-600 dark:text-slate-300'}`}
          >
            {notification.title}
          </Typography.Text>
          {!notification.isRead && (
            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5 shadow-sm shadow-blue-500/20" />
          )}
        </div>

        <Typography.Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block line-clamp-2">
          {notification.message}
        </Typography.Text>

        <div className="flex justify-between items-center mt-1">
          <Space size={4} className="text-slate-400 dark:text-slate-500 text-xs">
            <IconClockCircle style={{ fontSize: 12 }} />
            <span>{dayjs(notification.createdAt).fromNow()}</span>
          </Space>
          {notification.type === 'stale_reminder' && (
            <Tag size="small" color="orange" className="opacity-90 scale-90 origin-right">
              沉底提醒
            </Tag>
          )}
        </div>
      </Space>
    </div>
  );
};
