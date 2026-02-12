import React from 'react';
import { Notification } from '../types';
import { Typography, Space, Tag } from '@arco-design/web-react';
import { IconClockCircle, IconUser, IconCheckCircle } from '@arco-design/web-react/icon';
import dayjs from '@/utils/dayjs';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const navigate = useNavigate();

  // Story 8.3: 处理点击跳转
  const handleClick = () => {
    onClick(notification.id);

    // task_assigned 通知点击跳转到任务详情
    if (notification.type === 'task_assigned' && notification.data?.taskId) {
      navigate(`/tasks/${notification.data.taskId}`);
    }
  };

  // Story 8.3: 渲染通知类型标签
  const renderTag = () => {
    switch (notification.type) {
      case 'stale_reminder':
        return (
          <Tag size="small" color="orange" className="opacity-90 scale-90 origin-right">
            沉底提醒
          </Tag>
        );
      case 'task_assigned':
        return (
          <Tag
            size="small"
            color="blue"
            className="opacity-90 scale-90 origin-right flex items-center gap-1"
          >
            <IconUser style={{ fontSize: 12 }} />
            任务分配
          </Tag>
        );
      case 'system':
        return (
          <Tag
            size="small"
            color="green"
            className="opacity-90 scale-90 origin-right flex items-center gap-1"
          >
            <IconCheckCircle style={{ fontSize: 12 }} />
            系统通知
          </Tag>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 cursor-pointer transition-all border-b border-slate-100 dark:border-slate-700/50 last:border-none group
                ${
                  !notification.isRead
                    ? 'bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
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
          {renderTag()}
        </div>
      </Space>
    </div>
  );
};
