import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Button, Message } from '@arco-design/web-react';
import { IconArrowLeft } from '@arco-design/web-react/icon';
import { CanvasEditor } from './components/CanvasEditor';
import { CanvasSidebar } from './components/CanvasSidebar';
import { getCanvas } from './services/canvas.service';

export function CanvasDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['canvas', id],
    queryFn: () => getCanvas(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size={40} />
      </div>
    );
  }

  if (error || !data) {
    Message.error('加载画布失败');
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-slate-400">无法加载画布</p>
        <Button onClick={() => navigate('/canvas')}>返回画布列表</Button>
      </div>
    );
  }

  const canvas = data.data;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50 z-10">
        <Button type="text" icon={<IconArrowLeft />} onClick={() => navigate('/canvas')}>
          返回
        </Button>
        <div className="h-4 w-[1px] bg-slate-700" />
        <h1 className="text-lg font-semibold text-white flex-1 truncate">{canvas.name}</h1>
      </div>

      {/* Main Content Area: Sidebar + Editor */}
      <div className="flex-1 flex overflow-hidden">
        <CanvasSidebar />
        <div className="flex-1 relative bg-slate-900">
          <CanvasEditor canvas={canvas} initialNodes={canvas.nodes || []} />
        </div>
      </div>
    </div>
  );
}
