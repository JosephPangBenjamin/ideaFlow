import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Button, Message, Drawer } from '@arco-design/web-react';
import { IconArrowLeft, IconApps } from '@arco-design/web-react/icon';
import { CanvasEditor } from './components/CanvasEditor';
import { CanvasLibrary } from './components/CanvasLibrary'; // Canvas V2: Horizontal library
import { CanvasList } from './components/CanvasList';
import { getCanvas, getConnections } from './services/canvas.service';

export function CanvasDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isListDrawerVisible, setIsListDrawerVisible] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['canvas', id],
    queryFn: () => getCanvas(id!),
    enabled: !!id,
  });

  const { data: connectionsData } = useQuery({
    queryKey: ['canvas-connections', id],
    queryFn: () => getConnections(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-slate-950 fixed inset-0 z-50">
        <Spin size={40} />
      </div>
    );
  }

  if (error || !data) {
    Message.error('加载画布失败');
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-900">
        <p className="text-slate-400">无法加载画布</p>
        <Button onClick={() => navigate('/canvas')}>返回画布列表</Button>
      </div>
    );
  }

  const canvas = data.data;
  const connections = connectionsData?.data || [];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
      {/* Header with Integrated Library */}
      <div className="flex items-center px-4 h-16 bg-slate-900 border-b border-slate-800 z-10">
        <Button
          type="text"
          icon={<IconArrowLeft />}
          onClick={() => navigate('/canvas')}
          className="text-slate-400 hover:text-white"
        >
          返回
        </Button>
        <div className="h-6 w-[1px] bg-slate-700 mx-2" />
        <Button
          type="text"
          icon={<IconApps />}
          onClick={() => setIsListDrawerVisible(true)}
          className="text-slate-400 hover:text-white mr-4"
          title="切换画布"
        />
        <div className="flex flex-col min-w-[120px] max-w-[240px]">
          <h1 className="text-sm font-bold text-white truncate">{canvas.name}</h1>
          <span className="text-[10px] text-slate-500 font-mono">CANVAS v2</span>
        </div>

        {/* Horizontal Library Shelf */}
        <CanvasLibrary />

        {/* Canvas V2: Toolbar Portal Target */}
        <div id="canvas-toolbar-portal" className="flex items-center ml-auto" />
      </div>

      <div className="flex-1 relative bg-slate-950">
        <Drawer
          title="切换画布"
          width={360}
          visible={isListDrawerVisible}
          onCancel={() => setIsListDrawerVisible(false)}
          footer={null}
          className="canvas-list-drawer"
        >
          <CanvasList
            hideCreate={true}
            currentCanvasId={id}
            onSelect={(selectedCanvas) => {
              navigate(`/canvas/${selectedCanvas.id}`);
              setIsListDrawerVisible(false);
            }}
          />
        </Drawer>
        <CanvasEditor
          key={id}
          canvas={canvas}
          initialNodes={canvas.nodes || []}
          initialConnections={connections}
        />
      </div>
    </div>
  );
}
