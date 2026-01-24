import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Message, Spin, Avatar, Modal } from '@arco-design/web-react';
import { IconLink } from '@arco-design/web-react/icon';

/**
 * API 基础路径
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/ideaFlow/api/v1';

/**
 * 关联账号数据结构
 */
interface LinkedAccount {
  id: string;
  provider: 'wechat' | 'google';
  nickname: string | null;
  avatar: string | null;
  email: string | null;
  linkedAt: string;
}

/**
 * 关联账号组件
 * 在设置页面显示已绑定的第三方账号，支持绑定/解绑操作
 * AC: 7 - 已登录用户绑定/解绑第三方账号
 */
export function LinkedAccounts() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);

  useEffect(() => {
    loadLinkedAccounts();
  }, []);

  /**
   * 加载已关联的第三方账号
   */
  const loadLinkedAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/link`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('获取关联账号失败');
      }

      const result = await response.json();
      setAccounts(result.data || []);
    } catch (error) {
      console.error('加载关联账号失败:', error);
      // 静默失败，不显示错误消息
    } finally {
      setLoading(false);
    }
  };

  /**
   * 绑定微信账号
   */
  const handleLinkWechat = () => {
    window.location.href = `${API_BASE_URL}/auth/link/wechat`;
  };

  /**
   * 绑定Google账号
   */
  const handleLinkGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/link/google`;
  };

  /**
   * 解绑第三方账号
   */
  const handleUnlink = async (provider: 'wechat' | 'google') => {
    Modal.confirm({
      title: '确认解绑',
      content: `确定要解绑${provider === 'wechat' ? '微信' : 'Google'}账号吗？解绑后将无法使用该账号登录。`,
      okText: '确认解绑',
      cancelText: '取消',
      okButtonProps: { status: 'danger' },
      onOk: async () => {
        try {
          setUnlinkingProvider(provider);
          const response = await fetch(`${API_BASE_URL}/auth/link/${provider}`, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '解绑失败');
          }

          Message.success('解绑成功');
          // 刷新关联账号列表
          loadLinkedAccounts();
        } catch (error: any) {
          Message.error(error.message || '解绑失败，请重试');
        } finally {
          setUnlinkingProvider(null);
        }
      },
    });
  };

  /**
   * 检查是否已绑定指定提供商
   */
  const isLinked = (provider: 'wechat' | 'google') => {
    return accounts.some((acc) => acc.provider === provider);
  };

  /**
   * 获取指定提供商的账号信息
   */
  const getAccount = (provider: 'wechat' | 'google') => {
    return accounts.find((acc) => acc.provider === provider);
  };

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mt-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-center h-32">
          <Spin size={24} />
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mt-6 border border-slate-700/50"
    >
      <div className="flex items-center mb-6">
        <IconLink className="w-5 h-5 text-green-400 mr-2" />
        <h2 className="text-lg font-semibold text-white">关联账号</h2>
      </div>

      <div className="space-y-4">
        {/* 微信账号 */}
        <div className="flex items-center justify-between py-3 border-b border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#07C160] flex items-center justify-center">
              <WechatIcon />
            </div>
            <div>
              <span className="text-white font-medium">微信</span>
              {isLinked('wechat') && (
                <p className="text-slate-400 text-xs mt-0.5">
                  {getAccount('wechat')?.nickname || '已绑定'}
                </p>
              )}
            </div>
          </div>

          {isLinked('wechat') ? (
            <Button
              size="small"
              status="danger"
              loading={unlinkingProvider === 'wechat'}
              onClick={() => handleUnlink('wechat')}
            >
              解绑
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              className="!bg-[#07C160] hover:!bg-[#06AD56] !border-0"
              onClick={handleLinkWechat}
            >
              绑定微信
            </Button>
          )}
        </div>

        {/* Google账号 */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4285F4] flex items-center justify-center">
              <GoogleIcon />
            </div>
            <div>
              <span className="text-white font-medium">Google</span>
              {isLinked('google') && (
                <p className="text-slate-400 text-xs mt-0.5">
                  {getAccount('google')?.email || getAccount('google')?.nickname || '已绑定'}
                </p>
              )}
            </div>
          </div>

          {isLinked('google') ? (
            <Button
              size="small"
              status="danger"
              loading={unlinkingProvider === 'google'}
              onClick={() => handleUnlink('google')}
            >
              解绑
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              className="!bg-[#4285F4] hover:!bg-[#3367D6] !border-0"
              onClick={handleLinkGoogle}
            >
              绑定Google
            </Button>
          )}
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-4">
        绑定第三方账号后，您可以使用该账号快速登录系统。
      </p>
    </motion.section>
  );
}

/**
 * 微信图标组件
 */
function WechatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z" />
    </svg>
  );
}

/**
 * Google图标组件
 */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default LinkedAccounts;
