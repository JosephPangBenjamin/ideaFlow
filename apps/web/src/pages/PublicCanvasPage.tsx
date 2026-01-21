import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Stage, Layer } from 'react-konva';
import { Spin, Empty, Typography, Tag, Button } from '@arco-design/web-react';
import { IconApps, IconMinus, IconPlus, IconExpand, IconShrink } from '@arco-design/web-react/icon';
import { api } from '@/services/api';
import { CanvasNode } from '@/features/canvas/components/CanvasNode';
import { ConnectionLine } from '@/features/canvas/components/ConnectionLine';
import {
  CanvasNode as CanvasNodeType,
  CanvasConnection,
} from '@/features/canvas/services/canvas.service';

interface PublicCanvas {
  id: string;
  name: string;
  createdAt: string;
  nodes: CanvasNodeType[];
  connections: CanvasConnection[];
}

// 简单的缩放控制 Hook
function useZoom() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    // Limit scale
    if (newScale < 0.1) newScale = 0.1;
    if (newScale > 5) newScale = 5;

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return { scale, setScale, position, setPosition, handleWheel };
}

export function PublicCanvasPage() {
  const { token } = useParams<{ token: string }>();
  // 简化处理 DOM 尺寸，后续可优化
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { scale, setScale, position, setPosition, handleWheel } = useZoom();

  // 更新窗口大小
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-canvas', token],
    queryFn: async () => {
      const response = await api.get<{ data: PublicCanvas }>(`/canvases/public/${token}`);
      return response.data.data;
    },
    enabled: !!token,
    retry: false,
  });

  // 自动居中逻辑
  useEffect(() => {
    if (data && data.nodes.length > 0) {
      // 计算边界
      const bounds = data.nodes.reduce(
        (acc, node) => ({
          minX: Math.min(acc.minX, node.x),
          minY: Math.min(acc.minY, node.y),
          maxX: Math.max(acc.maxX, node.x + node.width),
          maxY: Math.max(acc.maxY, node.y + node.height),
        }),
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      );

      const contentWidth = bounds.maxX - bounds.minX;
      const contentHeight = bounds.maxY - bounds.minY;
      const padding = 100;

      // 计算适合屏幕的缩放比例
      const scaleX = (dimensions.width - padding * 2) / contentWidth;
      const scaleY = (dimensions.height - padding * 2) / contentHeight;
      const newScale = Math.min(Math.min(scaleX, scaleY), 1); // 不超过 100%

      setScale(newScale);

      // 居中位置
      setPosition({
        x: (dimensions.width - contentWidth * newScale) / 2 - bounds.minX * newScale,
        y: (dimensions.height - contentHeight * newScale) / 2 - bounds.minY * newScale,
      });
    }
  }, [data, dimensions.width, dimensions.height, setScale, setPosition]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spin size={40} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Empty
          icon={<IconApps style={{ fontSize: 48, color: '#64748b' }} />}
          description={
            <div className="text-center">
              <Typography.Title heading={4} className="text-white">
                页面不存在
              </Typography.Title>
              <Typography.Text className="text-slate-400">
                该画布已设为私密或链接已失效
              </Typography.Text>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex items-center pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-2xl p-2 px-4 flex items-center gap-3 shadow-xl pointer-events-auto">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-500/30">
            <IconApps style={{ fontSize: 16, color: '#3b82f6' }} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              公开画布
            </div>
            <h1 className="text-sm font-bold text-white leading-none mt-0.5">{data.name}</h1>
          </div>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <Tag color="blue" size="small">
            只读
          </Tag>
        </div>
      </div>

      {/* Canvas */}
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        draggable
        onWheel={handleWheel}
        scale={{ x: scale, y: scale }}
        x={position.x}
        y={position.y}
        onDragEnd={(e) => {
          setPosition({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
          {/* Grid Background (Optional, kept simple for now) */}

          {/* Connections - Render first to be behind nodes */}
          {data.connections.map((conn) => {
            const fromNode = data.nodes.find((n) => n.id === conn.fromNodeId);
            const toNode = data.nodes.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;

            // Simple center-to-center logic for now, or reuse logic
            // Since CanvasNode logic is complex for handles, we use node centers + offset if needed
            // But ConnectionLine needs absolute coords.
            // Let's use center of nodes for simplicity in read-only mode,
            // OR ideally we should calculate handle positions.
            // For now, center-to-center is safe fallback.

            const fromX = fromNode.x + fromNode.width / 2;
            const fromY = fromNode.y + fromNode.height / 2;
            const toX = toNode.x + toNode.width / 2;
            const toY = toNode.y + toNode.height / 2;

            return (
              <ConnectionLine
                key={conn.id}
                fromX={fromX}
                fromY={fromY}
                toX={toX}
                toY={toY}
                label={conn.label}
                selected={false}
              />
            );
          })}

          {/* Nodes */}
          {data.nodes.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              isSelected={false}
              isHovered={false}
              isConnectionTarget={false}
              // Disable interactions
              onSelect={() => {}}
              onDragEnd={() => {}}
              // Ensure custom style readonly is handled by component
            />
          ))}
        </Layer>
      </Stage>

      {/* Footer / Controls */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-xl p-1 shadow-xl flex flex-col gap-1">
          <Button
            icon={<IconPlus />}
            type="text"
            className="text-slate-400 hover:text-white"
            onClick={() => setScale((s) => Math.min(s * 1.2, 5))}
          />
          <Button
            icon={<IconMinus />}
            type="text"
            className="text-slate-400 hover:text-white"
            onClick={() => setScale((s) => Math.max(s / 1.2, 0.1))}
          />
          <div className="w-full h-px bg-white/10 my-0.5" />
          <Button
            icon={<IconExpand />}
            type="text"
            className="text-slate-400 hover:text-white"
            onClick={() => {
              // Reset (simplified)
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs pointer-events-none bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-sm">
        由 <span className="text-blue-400 font-bold">IdeaFlow</span> 提供技术支持
      </div>
    </div>
  );
}

export default PublicCanvasPage;
