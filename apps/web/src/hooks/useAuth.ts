import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAtom } from '@/stores/authAtom';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);
  const navigate = useNavigate();

  const register = useCallback(
    async (username: string, password: string, inviteToken?: string) => {
      const response = await authService.register({ username, password, inviteToken });
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        isAuthenticated: true,
        isHydrated: true,
      });
      // 如果有重定向 URL（来自邀请链接），跳转到指定页面
      if (response.redirectUrl) {
        navigate(response.redirectUrl);
      } else {
        navigate('/dashboard');
      }
      return response; // 返回响应以便调用者检查 warning 等字段
    },
    [setAuth, navigate]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await authService.login({ username, password });
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        isAuthenticated: true,
        isHydrated: true,
      });
      navigate('/dashboard');
    },
    [setAuth, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAuth({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isHydrated: true,
      });
      navigate('/login');
    }
  }, [setAuth, navigate]);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    accessToken: auth.accessToken,
    register,
    login,
    logout,
  };
}
