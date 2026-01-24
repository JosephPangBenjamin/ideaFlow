import { useState } from 'react';
import { Button, Message } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { tapAnimation } from '@/utils/motion';

/**
 * API 基础路径
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/ideaFlow/api/v1';

/**
 * 社交登录按钮组件
 * 提供微信和Google第三方登录入口
 * AC: 1, 4 - 微信和Google登录入口
 */
export function SocialLoginButtons() {
  const [wechatLoading, setWechatLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /**
   * 处理微信登录
   * 重定向到后端微信OAuth入口
   */
  const handleWechatLogin = () => {
    setWechatLoading(true);
    try {
      // 重定向到后端微信OAuth端点
      window.location.href = `${API_BASE_URL}/auth/wechat`;
    } catch (error) {
      Message.error('微信登录失败，请重试');
      setWechatLoading(false);
    }
  };

  /**
   * 处理Google登录
   * 重定向到后端Google OAuth入口
   */
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    try {
      // 重定向到后端Google OAuth端点
      window.location.href = `${API_BASE_URL}/auth/google`;
    } catch (error) {
      Message.error('Google登录失败，请重试');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* 分隔线 */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-800/40 text-slate-400">或使用第三方账号登录</span>
        </div>
      </div>

      {/* 微信登录按钮 - 使用微信品牌绿色 #07C160 */}
      <motion.div whileTap={tapAnimation}>
        <Button
          long
          loading={wechatLoading}
          onClick={handleWechatLogin}
          className="!h-12 !rounded-xl !bg-[#07C160] hover:!bg-[#06AD56] !border-0 !text-white !font-medium !text-base shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          icon={<WechatIcon />}
        >
          微信登录
        </Button>
      </motion.div>

      {/* Google登录按钮 - 使用Google品牌色 #4285F4 */}
      <motion.div whileTap={tapAnimation}>
        <Button
          long
          loading={googleLoading}
          onClick={handleGoogleLogin}
          className="!h-12 !rounded-xl !bg-[#4285F4] hover:!bg-[#3367D6] !border-0 !text-white !font-medium !text-base shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          icon={<GoogleIcon />}
        >
          Google 登录
        </Button>
      </motion.div>
    </div>
  );
}

/**
 * 微信图标组件
 */
function WechatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="mr-1">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
    </svg>
  );
}

/**
 * Google图标组件
 */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="mr-1">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default SocialLoginButtons;
