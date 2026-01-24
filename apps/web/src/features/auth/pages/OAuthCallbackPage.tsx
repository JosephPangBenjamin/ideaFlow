import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Message } from '@arco-design/web-react';
import { useSetAtom } from 'jotai';
import { authAtom } from '@/stores/authAtom';

/**
 * OAuth 回调处理页面
 *
 * 处理第三方登录回调，接收 URL 参数中的 token 和用户信息
 * 成功后存储到 localStorage 并跳转到仪表盘
 */
export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useSetAtom(authAtom);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 从 URL 参数获取响应数据
        // 注意：由于 URL 参数大小限制，token 可能需要通过其他方式传递
        const userParam = searchParams.get('user');
        const tokenParam = searchParams.get('token');
        const errorParam = searchParams.get('error');
        const errorCode = searchParams.get('code');

        // 处理错误情况
        if (errorParam || errorCode === '403') {
          setStatus('error');
          setErrorMessage(errorParam || 'CSRF验证失败，请重试');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        if (errorCode === '409') {
          setStatus('error');
          setErrorMessage('该邮箱已注册，请用原方式登录后在设置中绑定第三方账号');
          setTimeout(() => navigate('/login', { replace: true }), 5000);
          return;
        }

        if (errorCode === '401') {
          setStatus('error');
          setErrorMessage(errorParam || '授权失败，请重试');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // 检查必要参数
        if (!userParam || !tokenParam) {
          setStatus('error');
          setErrorMessage('登录响应格式错误，请联系管理员');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // 解析用户信息
        const user = JSON.parse(decodeURIComponent(userParam));
        const accessToken = decodeURIComponent(tokenParam);

        // 存储到 auth atom
        setAuth({
          user,
          accessToken,
          isHydrated: true,
          isAuthenticated: true,
        });

        setStatus('success');

        // 延迟跳转到仪表盘，让用户看到成功提示
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      } catch (error) {
        console.error('OAuth callback 处理失败:', error);
        setStatus('error');
        setErrorMessage('登录处理失败，请重试');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuth]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Spin size="large" />
          <p className="text-slate-400 mt-4">正在处理登录...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">登录失败</h2>
          <p className="text-slate-400 mb-6">{errorMessage}</p>
          <p className="text-slate-500 text-sm">即将返回登录页面...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">登录成功</h2>
        <p className="text-slate-400">正在跳转到仪表盘...</p>
      </div>
    </div>
  );
}

export default OAuthCallbackPage;
