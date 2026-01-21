import { motion } from 'framer-motion';
import { Radio, Switch, Divider, Typography, Space, Spin } from '@arco-design/web-react';
import { IconNotification } from '@arco-design/web-react/icon';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { NotificationType } from '@ideaflow/shared';

const { Title, Text } = Typography;

export const NotificationSettings = () => {
  const { settings, updateSettings } = useNotificationSettings();

  if (!settings) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin size={30} />
      </div>
    );
  }

  const handleGlobalChange = (val: 'all' | 'important' | 'none') => {
    updateSettings({
      ...settings,
      globalLevel: val,
    });
  };

  const handleTypeChange = (type: NotificationType, checked: boolean) => {
    updateSettings({
      ...settings,
      types: {
        ...(settings.types || {}),
        [type]: checked,
      },
    });
  };

  const typeLabels: Record<NotificationType, string> = {
    system: '系统通知',
    stale_reminder: '沉底提醒',
    task_reminder: '任务提醒',
  };

  const typeDescriptions: Record<NotificationType, string> = {
    system: '关于账户安全、系统升级等重要信息',
    stale_reminder: '提醒您长时间未处理的想法或任务',
    task_reminder: '您设置的任务提醒时间到期时的通知',
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mt-6"
    >
      <div className="flex items-center mb-6">
        <IconNotification className="w-5 h-5 text-green-400 mr-2" />
        <h2 className="text-lg font-semibold text-white">通知偏好</h2>
      </div>

      <div className="space-y-6">
        {/* Global Level */}
        <div>
          <Title heading={6} style={{ marginTop: 0, color: 'var(--color-text-1)' }}>
            接收级别
          </Title>
          <Text type="secondary">选择接收通知的范围，避免过度干扰</Text>
          <div className="mt-4">
            <Radio.Group
              type="button"
              value={settings.globalLevel}
              onChange={handleGlobalChange}
              className="notification-radio-group"
            >
              <Radio value="all">全部</Radio>
              <Radio value="important">仅重要</Radio>
              <Radio value="none">完全静音</Radio>
            </Radio.Group>
          </div>
        </div>

        <Divider />

        {/* Specific Types */}
        <div>
          <Title heading={6} style={{ marginBottom: 16, color: 'var(--color-text-1)' }}>
            通知类型控制
          </Title>
          <div className="space-y-4">
            {(Object.keys(typeLabels) as NotificationType[]).map((type) => (
              <div
                key={type}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-700/30"
              >
                <Space direction="vertical" size={2}>
                  <Text bold style={{ color: 'var(--color-text-1)' }}>
                    {typeLabels[type]}
                  </Text>
                  <Text type="secondary">{typeDescriptions[type]}</Text>
                </Space>
                <Switch
                  checked={settings.types?.[type] !== false}
                  onChange={(checked) => handleTypeChange(type, checked)}
                  disabled={settings.globalLevel === 'none'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
