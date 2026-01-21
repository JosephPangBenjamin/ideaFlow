import React, { useEffect } from 'react';
import { Badge, Dropdown } from '@arco-design/web-react';
import { IconNotification } from '@arco-design/web-react/icon';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotificationBell: React.FC = () => {
  const { unreadCount, fetchNotifications } = useNotifications();
  const location = useLocation();

  // 策略：首次加载 + 页面路径切换时刷新通知
  useEffect(() => {
    fetchNotifications();
  }, [location.pathname, fetchNotifications]);

  return (
    <Dropdown droplist={<NotificationDropdown />} trigger="click" position="br">
      <div className="relative cursor-pointer">
        <Badge count={unreadCount} maxCount={99}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <IconNotification style={{ fontSize: 20, color: 'var(--color-text-1)' }} />
          </motion.div>
        </Badge>
      </div>
    </Dropdown>
  );
};
