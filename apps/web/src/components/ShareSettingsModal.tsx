import { useState, useRef, useEffect } from 'react';
import { Modal, Switch, Typography, Checkbox, Message } from '@arco-design/web-react';
import { IconLock, IconUnlock, IconLink } from '@arco-design/web-react/icon';
import ShareLinkCopy, { ShareLinkCopyHandle } from './ShareLinkCopy';

interface ShareSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'idea' | 'canvas';
  isPublic: boolean;
  publicToken: string | null;
  onVisibilityChange: (isPublic: boolean) => Promise<void>;
}

export const ShareSettingsModal: React.FC<ShareSettingsModalProps> = ({
  visible,
  onClose,
  type,
  isPublic,
  publicToken,
  onVisibilityChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [autoCopy, setAutoCopy] = useState(true);
  const [pendingAutoCopy, setPendingAutoCopy] = useState(false);
  const shareLinkRef = useRef<ShareLinkCopyHandle>(null);

  // Safe auto-copy: triggered only after publicToken is available
  useEffect(() => {
    if (pendingAutoCopy && isPublic && publicToken) {
      shareLinkRef.current?.copy();
      setPendingAutoCopy(false);
    }
  }, [pendingAutoCopy, isPublic, publicToken]);

  const handleToggleVisibility = async (checked: boolean) => {
    setLoading(true);
    try {
      await onVisibilityChange(checked);
      if (checked && autoCopy) {
        setPendingAutoCopy(true);
      }
    } catch (error) {
      Message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={onClose}
      footer={null}
      unmountOnExit
      focusLock={false}
      autoFocus={false}
      style={{ width: 420 }}
      className="share-settings-modal"
    >
      {/* Custom Header */}
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/10">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
            isPublic
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30'
              : 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-slate-500/20'
          }`}
        >
          {isPublic ? (
            <IconUnlock className="text-white text-xl" />
          ) : (
            <IconLock className="text-white/80 text-xl" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">分享设置</h2>
          <p className="text-xs text-slate-400">
            管理{type === 'idea' ? '想法' : '画布'}的公开访问权限
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Visibility Toggle Card */}
        <div
          className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-500 ${
            isPublic
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          {/* Subtle gradient overlay when public */}
          {isPublic && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
          )}

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isPublic ? 'bg-emerald-500/20' : 'bg-white/10'
                }`}
              >
                <IconLink
                  className={`text-lg ${isPublic ? 'text-emerald-400' : 'text-slate-400'}`}
                />
              </div>
              <div>
                <Typography.Text className="text-white font-semibold block">
                  公开分享
                </Typography.Text>
                <Typography.Text className="text-[11px] text-slate-400">
                  {isPublic ? '任何人都可以通过链接访问' : '仅您自己可见'}
                </Typography.Text>
              </div>
            </div>
            <Switch
              checked={isPublic}
              loading={loading}
              onChange={handleToggleVisibility}
              className={isPublic ? '!bg-emerald-500' : ''}
            />
          </div>
        </div>

        {/* Share Link Section */}
        {isPublic && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-300 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <ShareLinkCopy ref={shareLinkRef} token={publicToken || ''} type={type} />
            </div>
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                checked={autoCopy}
                onChange={setAutoCopy}
                className="share-auto-copy-checkbox"
              >
                <span className="text-slate-400 text-[11px] hover:text-slate-300 transition-colors">
                  开启分享时自动复制链接
                </span>
              </Checkbox>
            </div>
          </div>
        )}

        {/* Private State Message */}
        {!isPublic && (
          <div className="animate-in fade-in duration-300 py-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
              <IconLock className="text-slate-500 text-sm" />
              <Typography.Text className="text-slate-400 text-xs">
                当前内容为私密状态
              </Typography.Text>
            </div>
          </div>
        )}
      </div>

      {/* Custom Modal Styles */}
      <style>{`
                .share-settings-modal .arco-modal-content {
                    background: rgba(15, 23, 42, 0.95) !important;
                    backdrop-filter: blur(24px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px !important;
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.5),
                        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
                    overflow: visible !important;
                }
                .share-settings-modal .arco-modal-header {
                    display: none;
                }
                .share-settings-modal .arco-modal-body {
                    padding: 28px !important;
                    overflow: visible !important;
                }
                .share-settings-modal .arco-modal-wrapper {
                    overflow: visible !important;
                }
                .share-settings-modal .arco-switch-checked {
                    background: linear-gradient(135deg, #10b981, #14b8a6) !important;
                }
                .share-auto-copy-checkbox .arco-checkbox-icon {
                    border-radius: 4px;
                }
                .share-auto-copy-checkbox .arco-checkbox-checked .arco-checkbox-icon {
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    border-color: transparent;
                }
            `}</style>
    </Modal>
  );
};
