import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton, Empty, Typography, Space } from '@arco-design/web-react';
import { IconPlus, IconFile } from '@arco-design/web-react/icon';
import { Canvas, getCanvases, createCanvas as createCanvasApi } from '../services/canvas.service';
import { CanvasListItem } from './CanvasListItem';
import './CanvasList.css';

import { useAtomValue } from 'jotai';
import { isSidebarOpenAtom } from '@/store/ui';

const { Text } = Typography;

export interface CanvasListProps {
  /** 当前选中的画布 ID，用于高亮显示 */
  currentCanvasId?: string | null;
  /** 选择画布时的回调 */
  onSelect?: (canvas: Canvas) => void;
  /** 创建新画布后的回调 */
  onCreate?: (canvas: Canvas) => void;
  /** 是否隐藏创建按钮 */
  hideCreate?: boolean;
}

/**
 * 画布列表组件
 * 显示用户的所有画布，支持切换、新建等操作
 * AC: #1 查看画布列表、#2 切换画布、#3 创建新画布
 */
export function CanvasList({
  currentCanvasId,
  onSelect,
  onCreate,
  hideCreate = false,
}: CanvasListProps) {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 获取画布列表
  const { data, isLoading } = useQuery({
    queryKey: ['canvases'],
    queryFn: () => getCanvases(1, 100), // 获取所有画布，最多 100 个
    staleTime: 1000 * 60, // 1 分钟内不重新请求
  });

  // 新建画布 mutation
  const createCanvasMutation = useMutation({
    mutationFn: () => createCanvasApi({}),
    onSuccess: (response) => {
      // 刷新画布列表
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
      // 触发回调
      onCreate?.(response.data);
    },
  });

  // 处理创建新画布
  const handleCreateCanvas = () => {
    createCanvasMutation.mutate();
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="canvas-list-container" data-testid="canvas-list-loading">
        {!hideCreate && (
          <div className="canvas-list-header">
            <Typography.Title heading={6}>画布列表</Typography.Title>
          </div>
        )}
        <div className="canvas-list-skeleton">
          <Skeleton animation text={{ rows: 3 }} />
          <Skeleton animation text={{ rows: 3 }} />
          <Skeleton animation text={{ rows: 3 }} />
        </div>
      </div>
    );
  }

  const canvases = data?.data || [];

  // 空状态
  if (canvases.length === 0) {
    return (
      <div className="canvas-list-container" data-testid="canvas-list-empty">
        {!hideCreate && (
          <div className="canvas-list-header">
            <Typography.Title heading={6}>画布列表</Typography.Title>
          </div>
        )}
        <Empty
          icon={<IconFile style={{ fontSize: 48 }} />}
          description={
            <Space direction="vertical" align="center">
              <Text type="secondary">还没有画布，创建一个开始吧</Text>
              <Button
                type="primary"
                icon={<IconPlus />}
                onClick={handleCreateCanvas}
                loading={createCanvasMutation.isPending}
                data-testid="create-first-canvas-button"
              >
                创建画布
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div className="canvas-list-container">
      {!hideCreate && (
        <div className="canvas-list-header">
          <Typography.Title heading={6}>画布列表</Typography.Title>
          <Button
            type="primary"
            size="small"
            icon={<IconPlus />}
            onClick={handleCreateCanvas}
            loading={createCanvasMutation.isPending}
            data-testid="create-canvas-button"
          >
            新建
          </Button>
        </div>
      )}

      <div className="canvas-list-scroll-area">
        {canvases.length > 0 ? (
          <div
            className={`grid gap-6 transition-all duration-500 ease-spring ${
              isSidebarOpen
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {canvases.map((item: Canvas) => (
              <CanvasListItem
                key={item.id}
                canvas={item}
                isActive={item.id === currentCanvasId}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="canvas-list-empty">
            <Empty
              icon={<IconFile style={{ fontSize: 48, color: 'var(--color-text-4)' }} />}
              description={
                <Space direction="vertical" align="center">
                  <Text type="secondary">还没有画布，创建一个开始吧</Text>
                  {!hideCreate && (
                    <Button
                      type="primary"
                      icon={<IconPlus />}
                      onClick={handleCreateCanvas}
                      loading={createCanvasMutation.isPending}
                      data-testid="create-first-canvas-button"
                    >
                      创建画布
                    </Button>
                  )}
                </Space>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
