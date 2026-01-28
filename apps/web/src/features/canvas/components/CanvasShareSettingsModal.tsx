import { useState, useEffect } from 'react';
import {
  Modal,
  DatePicker,
  Button,
  Typography,
  Tabs,
  Card,
  Space,
  Tooltip,
} from '@arco-design/web-react';
import {
  IconUser,
  IconEdit,
  IconEye,
  IconLink,
  IconDelete,
  IconCalendar,
  IconPlus,
} from '@arco-design/web-react/icon';
import { useCanvasShare } from '../hooks/useCanvasShare';
import { Permission, ShareStatus } from '../services/canvas-share.service';
import { Message } from '@arco-design/web-react';
import dayjs from 'dayjs';

interface CanvasShareSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  canvasId: string;
}

/**
 * Canvas Share Settings Modal
 * Story 8.1: 画布协作分享链接
 */
export const CanvasShareSettingsModal: React.FC<CanvasShareSettingsModalProps> = ({
  visible,
  onClose,
  canvasId,
}) => {
  const { shares, loading, createShareLink, updateShareLink, removeShareLink, loadShares } =
    useCanvasShare(canvasId);

  // 新建分享链接表单状态
  const [newSharePermission, setNewSharePermission] = useState<Permission>(Permission.VIEW_ONLY);
  const [newShareExpiresAt, setNewShareExpiresAt] = useState<Date | null>(null);

  // 加载分享链接列表（仅首次打开或从外部触发刷新）
  useEffect(() => {
    if (visible && shares.length === 0) {
      loadShares();
    }
  }, [visible]); // 移除 loadShares 依赖，避免无限循环

  // 创建新分享链接
  const handleCreateShare = async () => {
    try {
      await createShareLink({
        permission: newSharePermission,
        expiresAt: newShareExpiresAt?.toISOString(),
      });
      // 重置表单
      setNewSharePermission(Permission.VIEW_ONLY);
      setNewShareExpiresAt(null);
    } catch (error) {
      // Error already handled in hook
    }
  };

  // 撤销分享链接
  const handleRevokeShare = async (shareToken: string) => {
    try {
      await updateShareLink(shareToken, { status: ShareStatus.REVOKED });
    } catch (error) {
      // Error already handled in hook
    }
  };

  // 删除分享链接
  const handleDeleteShare = async (shareToken: string) => {
    try {
      await removeShareLink(shareToken);
    } catch (error) {
      // Error already handled in hook
    }
  };

  // 复制链接
  const handleCopyLink = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl);
    Message.success('链接已复制');
  };

  // 权限选项
  const permissionOptions = [
    {
      value: Permission.VIEW_ONLY,
      label: '仅查看',
      icon: <IconEye />,
      desc: '访问者只能查看，不能编辑',
    },
    {
      value: Permission.EDITABLE,
      label: '可编辑',
      icon: <IconEdit />,
      desc: '访问者可以查看和编辑',
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <IconUser className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">协作分享</h2>
            <p className="text-xs text-slate-400">创建和管理协作分享链接</p>
          </div>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{ width: 520 }}
      unmountOnExit
      focusLock={false}
      autoFocus={false}
      className="canvas-share-settings-modal"
    >
      <Tabs defaultActiveKey="list" type="line" tabPosition="left">
        <Tabs.TabPane key="list" title="分享链接">
          <div className="space-y-3">
            {shares.length === 0 ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                  <IconLink className="text-slate-500" />
                  <Typography.Text className="text-slate-400 text-sm">暂无分享链接</Typography.Text>
                </div>
              </div>
            ) : (
              shares.map((share) => (
                <Card
                  key={share.id}
                  className="!bg-white/5 !border-white/10 hover:!border-white/20 transition-colors"
                  bodyStyle={{ padding: '16px' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {share.permission === Permission.VIEW_ONLY ? (
                          <IconEye className="text-blue-400" />
                        ) : (
                          <IconEdit className="text-green-400" />
                        )}
                        <Typography.Text className="text-white">
                          {share.permission === Permission.VIEW_ONLY ? '仅查看' : '可编辑'}
                        </Typography.Text>
                        {share.status === 'REVOKED' && (
                          <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                            已撤销
                          </span>
                        )}
                      </div>
                      <Space>
                        <Tooltip content="复制链接">
                          <Button
                            size="small"
                            type="text"
                            icon={<IconLink />}
                            onClick={() => handleCopyLink(share.shareUrl)}
                          />
                        </Tooltip>
                        {share.status === 'ACTIVE' && (
                          <Tooltip content="撤销链接">
                            <Button
                              size="small"
                              type="text"
                              status="warning"
                              icon={<IconDelete />}
                              onClick={() => handleRevokeShare(share.shareToken)}
                            />
                          </Tooltip>
                        )}
                        <Tooltip content="删除">
                          <Button
                            size="small"
                            type="text"
                            status="danger"
                            icon={<IconDelete />}
                            onClick={() => handleDeleteShare(share.shareToken)}
                          />
                        </Tooltip>
                      </Space>
                    </div>

                    <div className="flex items-center gap-2">
                      <Typography.Text className="text-slate-400 text-xs flex-1 truncate" ellipsis>
                        {share.shareUrl}
                      </Typography.Text>
                    </div>

                    {share.expiresAt && (
                      <div className="flex items-center gap-1 text-xs">
                        <IconCalendar className="text-slate-500" />
                        <Typography.Text className="text-slate-400">
                          过期时间：{dayjs(share.expiresAt).format('YYYY-MM-DD HH:mm')}
                        </Typography.Text>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs">
                      <Typography.Text className="text-slate-500">
                        创建于 {dayjs(share.createdAt).format('YYYY-MM-DD HH:mm')}
                      </Typography.Text>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key="create" title="新建链接">
          <div className="space-y-5">
            <div>
              <Typography.Text className="text-white text-sm font-semibold block mb-3">
                访问权限
              </Typography.Text>
              <div className="space-y-2">
                {permissionOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      newSharePermission === option.value
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setNewSharePermission(option.value)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 ${
                          newSharePermission === option.value ? 'text-purple-400' : 'text-slate-400'
                        }`}
                      >
                        {option.icon}
                      </div>
                      <div>
                        <Typography.Text
                          className={`block text-sm ${
                            newSharePermission === option.value ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          {option.label}
                        </Typography.Text>
                        <Typography.Text className="text-xs text-slate-500">
                          {option.desc}
                        </Typography.Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Typography.Text className="text-white text-sm font-semibold block mb-3">
                过期时间（可选）
              </Typography.Text>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="选择过期时间"
                value={newShareExpiresAt ? dayjs(newShareExpiresAt) : undefined}
                onChange={(date) => {
                  if (date && 'toDate' in date) {
                    setNewShareExpiresAt((date as any).toDate());
                  } else {
                    setNewShareExpiresAt(null);
                  }
                }}
                disabledDate={(current) => current && current < dayjs().endOf('day')}
                style={{ width: '100%' }}
                className="!bg-white/5 !border-white/10"
              />
              <Typography.Text className="text-xs text-slate-500 block mt-2">
                不设置则永不过期
              </Typography.Text>
            </div>

            <Button
              type="primary"
              long
              size="large"
              icon={<IconPlus />}
              onClick={handleCreateShare}
              loading={loading}
              className="!bg-gradient-to-r !from-purple-500 !to-pink-600 !border-0"
            >
              创建分享链接
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>

      {/* Custom Modal Styles */}
      <style>{`
        .canvas-share-settings-modal .arco-modal-content {
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px !important;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          overflow: visible !important;
        }
        .canvas-share-settings-modal .arco-modal-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px 24px;
        }
        .canvas-share-settings-modal .arco-modal-title {
          color: white;
        }
        .canvas-share-settings-modal .arco-modal-close-btn {
          color: rgb(156, 163, 175);
        }
        .canvas-share-settings-modal .arco-modal-body {
          padding: 20px 24px 24px !important;
          overflow: visible !important;
        }
        .canvas-share-settings-modal .arco-tabs-nav-tab {
          color: rgb(156, 163, 175);
        }
        .canvas-share-settings-modal .arco-tabs-nav-tab-active {
          color: white;
        }
        .canvas-share-settings-modal .arco-select-view-wrapper,
        .canvas-share-settings-modal .arco-picker {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .canvas-share-settings-modal .arco-select-view-value {
          color: white !important;
        }
        .canvas-share-settings-modal .arco-picker-input {
          color: white !important;
        }
      `}</style>
    </Modal>
  );
};
