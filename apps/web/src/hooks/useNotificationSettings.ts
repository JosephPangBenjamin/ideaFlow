import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { notificationSettingsAtom } from '../stores/notificationSettings';
import { userService } from '../services/user.service';
import { NotificationSettings } from '@ideaflow/shared';
import { Message } from '@arco-design/web-react';

export const useNotificationSettings = () => {
  const [settings, setSettings] = useAtom(notificationSettingsAtom);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await userService.getNotificationSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch notification settings', error);
    }
  }, [setSettings]);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const updateSettings = useCallback(
    async (newSettings: NotificationSettings) => {
      // Optimistic update
      setSettings(newSettings);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
          await userService.updateNotificationSettings(newSettings);
          Message.success('通知设置已保存');
        } catch (err) {
          console.error('Failed to update notification settings', err);
          Message.error('保存失败，请重试');
        }
      }, 1000);
    },
    [setSettings]
  );

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [settings, fetchSettings]);

  return {
    settings,
    updateSettings,
    refresh: fetchSettings,
  };
};
