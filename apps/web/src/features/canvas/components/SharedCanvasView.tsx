import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Typography } from '@arco-design/web-react';
import { IconLock, IconEye, IconEdit, IconUser } from '@arco-design/web-react/icon';
import { getSharedCanvas, Permission } from '../services/canvas-share.service';
import { joinByShareToken } from '@/services/teams.api';
import { CanvasEditor } from './CanvasEditor';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@arco-design/web-react';

/**
 * 验证 ShareToken 格式
 * Nanoid 21 字符，只包含大小写字母和数字
 */
const validateShareToken = (token: string): boolean => {
  return /^[a-zA-Z0-9]{21}$/.test(token);
};

/**
 * Shared Canvas View
 * Story 8.1: 画布分享链接访问页面
 * Story 8.2: 支持通过邀请链接注册并加入团队
 */
export const SharedCanvasView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [canvasData, setCanvasData] = useState<any>(null);
  const [permission, setPermission] = useState<Permission>(Permission.VIEW_ONLY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCanvas = async () => {
      if (!token) {
        setError('分享链接无效');
        setLoading(false);
        return;
      }

      // 验证 token 格式
      if (!validateShareToken(token)) {
        setError('分享链接格式无效');
        setLoading(false);
        return;
      }

      try {
        const response = await getSharedCanvas(token);
        setCanvasData(response.data.canvas);
        setPermission(response.data.permission);

        // 如果用户已登录，自动加入团队
        if (isAuthenticated && user && token) {
          try {
            await joinByShareToken(token);
            Message.success('已加入团队');
          } catch (joinError: any) {
            // 加入失败不影响查看画布
            const joinMessage = joinError.response?.data?.message || '加入团队失败';
            Message.warning(joinMessage);
            console.error('Failed to join team:', joinError);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };

    loadCanvas();
  }, [token, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Spin />
          <Typography.Text className="block mt-4 text-slate-400">加载中...</Typography.Text>
        </div>
      </div>
    );
  }

  if (error || !canvasData) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <IconLock className="text-red-400 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">分享链接无效</h1>
          <Typography.Text className="text-slate-400 block mb-6">
            {error || '该分享链接不存在或已过期'}
          </Typography.Text>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/')}
            className="!bg-gradient-to-r !from-blue-500 !to-indigo-600 !border-0"
          >
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  // 判断是否只读
  const isReadOnly = permission === Permission.VIEW_ONLY;

  return (
    <div className="h-screen bg-slate-900 overflow-hidden">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isReadOnly ? 'bg-blue-500/20' : 'bg-green-500/20'
            }`}
          >
            {isReadOnly ? (
              <IconEye className="text-blue-400 text-lg" />
            ) : (
              <IconEdit className="text-green-400 text-lg" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{canvasData.name}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {isReadOnly ? '仅查看模式' : '可编辑模式'}
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <span>分享画布</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 权限提示 */}
          {isReadOnly && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30">
              <IconEye className="text-blue-400 text-sm" />
              <Typography.Text className="text-blue-300 text-sm">仅查看</Typography.Text>
            </div>
          )}

          {/* 登录提示 - 动态显示 */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isAuthenticated ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-purple-500/20 border border-purple-500/30'}`}
          >
            <IconUser className={isAuthenticated ? 'text-emerald-400' : 'text-purple-400'} />
            <Typography.Text
              className={isAuthenticated ? 'text-emerald-300' : 'text-purple-300'}
              text-sm
            >
              {isAuthenticated && user ? user.username : '未登录'}
            </Typography.Text>
          </div>

          {/* 返回按钮 */}
          <Button type="outline" size="small" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>

      {/* Canvas Editor (只读或可编辑) */}
      <div className="h-full pt-16">
        <CanvasEditor
          canvas={canvasData}
          initialNodes={canvasData.nodes || []}
          initialConnections={canvasData.connections || []}
        />
      </div>
    </div>
  );
};
