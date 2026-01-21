import React from 'react';
import { Typography, Button, Empty, Spin } from '@arco-design/web-react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown: React.FC = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    markAsRead(id);

    if (notification?.type === 'stale_reminder') {
      navigate('/ideas?isStale=true');
    }
  };

  return (
    <div className="w-[360px] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[480px]">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <Typography.Text bold className="text-slate-700 dark:text-slate-200">
          通知列表
        </Typography.Text>
        <Button
          type="text"
          size="mini"
          onClick={(e) => {
            e.stopPropagation();
            markAllAsRead();
          }}
          disabled={notifications.every((n) => n.isRead)}
          className="!text-slate-500 hover:!text-blue-600 dark:!text-slate-400 dark:hover:!text-blue-400"
        >
          全部已读
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[120px] custom-scrollbar">
        {isLoading && notifications.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <Spin tip="加载中..." />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleItemClick}
            />
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <Empty description="暂无通知" />
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-700 text-center bg-slate-50/30 dark:bg-slate-800/30">
          <Typography.Text
            className="text-slate-400 dark:text-slate-500"
            style={{ fontSize: '12px' }}
          >
            仅显示最近 50 条通知
          </Typography.Text>
        </div>
      )}
    </div>
  );
};
