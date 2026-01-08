import React from 'react';
import { Drawer, Spin, Empty, Button, Timeline, Tag, Space } from '@arco-design/web-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  IconApps,
  IconArrowRight,
  IconMessage,
  IconImage,
  IconBulb,
} from '@arco-design/web-react/icon';
import { getCanvasByIdeaId, getNodes, CanvasNodeType } from '../services/canvas.service';
import { formatRelativeTime } from '@/utils/date';

interface CanvasPreviewDrawerProps {
  ideaId: string | null;
  visible: boolean;
  onClose: () => void;
}

export const CanvasPreviewDrawer: React.FC<CanvasPreviewDrawerProps> = ({
  ideaId,
  visible,
  onClose,
}) => {
  const navigate = useNavigate();

  const { data: canvas, isLoading: canvasLoading } = useQuery({
    queryKey: ['canvas-by-idea', ideaId],
    queryFn: () => (ideaId ? getCanvasByIdeaId(ideaId) : Promise.resolve(null)),
    enabled: !!ideaId && visible,
  });

  const canvasId = canvas?.data?.id;

  const { data: nodes, isLoading: nodesLoading } = useQuery({
    queryKey: ['canvas-nodes-preview', canvasId],
    queryFn: () => (canvasId ? getNodes(canvasId) : Promise.resolve({ data: [] })),
    enabled: !!canvasId && visible,
  });

  const isLoading = canvasLoading || nodesLoading;
  const canvasData = canvas?.data;
  const nodesData = nodes?.data || [];

  const handleGoToCanvas = () => {
    if (canvasId) {
      navigate(`/canvas/${canvasId}`);
      onClose();
    }
  };

  const getNodeIcon = (type: CanvasNodeType) => {
    switch (type) {
      case CanvasNodeType.sub_idea:
        return <IconBulb className="text-blue-400" />;
      case CanvasNodeType.annotation:
        return <IconMessage className="text-teal-400" />;
      case CanvasNodeType.image:
        return <IconImage className="text-indigo-400" />;
      case CanvasNodeType.master_idea:
        return <IconBulb className="text-orange-400" />;
      default:
        return <IconBulb />;
    }
  };

  const getNodeLabel = (type: CanvasNodeType) => {
    switch (type) {
      case CanvasNodeType.sub_idea:
        return '子想法';
      case CanvasNodeType.annotation:
        return '批注';
      case CanvasNodeType.image:
        return '图片';
      case CanvasNodeType.master_idea:
        return '主想法';
      default:
        return '节点';
    }
  };

  return (
    <Drawer
      width={400}
      title={
        <Space>
          <IconApps className="text-blue-500" />
          <span className="font-bold">画布摘要预览</span>
        </Space>
      }
      visible={visible}
      onCancel={onClose}
      footer={
        canvasData ? (
          <Button type="primary" long icon={<IconArrowRight />} onClick={handleGoToCanvas}>
            进入完整画布
          </Button>
        ) : null
      }
      className="canvas-preview-drawer"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spin size={30} />
          <span className="text-slate-500 text-sm">正在加载画布背景内容...</span>
        </div>
      ) : !canvasData ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Empty description="该想法暂无关联画布" />
          <p className="text-slate-500 text-xs px-10 text-center leading-relaxed">
            您可以点击卡片上的“进入画布”图标来创建第一个深度编辑画布。
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 shadow-inner">
            <h3 className="text-white text-lg font-bold mb-2 truncate">{canvasData.name}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 font-mono">
                V2
              </span>
              <span>最后更新: {formatRelativeTime(canvasData.updatedAt)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                内容构成
              </h4>
              <Tag color="arcoblue" size="small">
                {nodesData.length}个节点
              </Tag>
            </div>

            <Timeline>
              {nodesData.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-slate-600 text-sm italic">画布目前是空的</p>
                </div>
              ) : (
                nodesData.slice(0, 8).map((node) => (
                  <Timeline.Item
                    key={node.id}
                    label={
                      <span className="text-[10px] text-slate-500">
                        {formatRelativeTime(node.updatedAt)}
                      </span>
                    }
                    dot={getNodeIcon(node.type)}
                  >
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-between">
                        <span>{getNodeLabel(node.type)}</span>
                      </div>
                      <div className="text-slate-300 text-sm line-clamp-2 leading-relaxed">
                        {node.type === CanvasNodeType.image
                          ? '[图片节点]'
                          : node.content || '无内容描述'}
                      </div>
                    </div>
                  </Timeline.Item>
                ))
              )}
              {nodesData.length > 8 && (
                <Timeline.Item dot={<div className="w-2 h-2 bg-slate-700 rounded-full" />}>
                  <div className="pt-2">
                    <span className="text-slate-500 text-xs bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                      ... 还有 {nodesData.length - 8} 个节点未显示
                    </span>
                  </div>
                </Timeline.Item>
              )}
            </Timeline>
          </div>

          <div className="pt-4">
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <p className="text-orange-400/80 text-[11px] leading-relaxed">
                提示：预览模式仅展示部分摘要。点击下方按钮可进入完整画布进行拖拽、连线和多节点编辑。
              </p>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
