import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Spin } from '@arco-design/web-react';
import { getCanvases, createCanvas } from './services/canvas.service';

/**
 * 画布重定向组件
 * 当用户访问 /canvas 无 ID 时，自动重定向到第一个画布或创建新画布
 * AC: #2 切换画布 - 处理 /canvas 无 ID 访问
 */
export function CanvasRedirect() {
  const navigate = useNavigate();

  // 获取画布列表
  const { data, isLoading } = useQuery({
    queryKey: ['canvases'],
    queryFn: () => getCanvases(1, 1), // 只获取第一个画布
    staleTime: 0, // 总是获取最新数据
  });

  // 创建新画布
  const createMutation = useMutation({
    mutationFn: () => createCanvas({}),
    onSuccess: (response) => {
      // 跳转到新创建的画布
      navigate(`/canvas/${response.data.id}`, { replace: true });
    },
  });

  useEffect(() => {
    if (isLoading || createMutation.isPending) return;

    const canvases = data?.data || [];

    if (canvases.length > 0) {
      // 有画布，跳转到第一个
      navigate(`/canvas/${canvases[0]?.id}`, { replace: true });
    } else {
      // 没有画布，创建一个新的
      createMutation.mutate();
    }
  }, [isLoading, data, navigate, createMutation]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-slate-950 fixed inset-0 z-50">
      <div className="flex flex-col items-center gap-4">
        <Spin size={40} />
        <span className="text-slate-400 text-sm">
          {createMutation.isPending ? '正在创建画布...' : '正在加载...'}
        </span>
      </div>
    </div>
  );
}
