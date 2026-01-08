import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CanvasDetailPage } from './CanvasDetailPage';
import { DEFAULT_REGION_COLOR } from './utils/constants';
import * as canvasService from './services/canvas.service';
import * as apiService from '@/services/api';

// Mock services
vi.mock('./services/canvas.service');
vi.mock('@/services/api');

// Mock react-konva
vi.mock('react-konva', async () => {
  const React = await import('react');
  const stageMock = {
    getStage: () => stageMock,
    getPointerPosition: () => ({ x: 0, y: 0 }),
    width: () => 800,
    height: () => 600,
    findOne: () => null,
  };

  return {
    Stage: React.forwardRef(
      ({ children, onClick, onMouseDown, onMouseMove, onMouseUp }: any, ref: any) => {
        React.useImperativeHandle(ref, () => stageMock);

        const wrap = (e: any, on: any) => {
          stageMock.getPointerPosition = () => ({ x: e.clientX, y: e.clientY });
          on?.({ ...e, target: stageMock, evt: e });
        };

        return (
          <div
            data-testid="stage"
            onClick={(e) => wrap(e, onClick)}
            onMouseDown={(e) => wrap(e, onMouseDown)}
            onMouseMove={(e) => wrap(e, onMouseMove)}
            onMouseUp={(e) => wrap(e, onMouseUp)}
          >
            {children}
          </div>
        );
      }
    ),
    Layer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="layer">{children}</div>
    ),
    Group: ({ children, id, x, y, onClick, onDragEnd }: any) => (
      <div
        data-testid="canvas-node-group"
        data-id={id}
        data-x={x}
        data-y={y}
        onClick={onClick}
        // Trigger dragEnd with the target provided in the test event
        onBlur={(e: any) => onDragEnd?.(e)}
      >
        {children}
      </div>
    ),
    Rect: (props: any) => <div data-testid="rect" data-fill={props.fill} />,
    Text: ({ text }: { text: string }) => <div data-testid="text">{text}</div>,
    Circle: (props: any) => <div data-testid="circle" data-x={props.x} data-y={props.y} />,
    Line: (props: any) => <div data-testid="line" />,
    Transformer: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        nodes: () => [],
        getLayer: () => ({ batchDraw: () => {} }),
      }));
      return <div data-testid="transformer" />;
    }),
  };
});

// Mock data-transfer for drag and drop
class MockDataTransfer {
  data: Record<string, string> = {};
  setData(key: string, value: string) {
    this.data[key] = value;
  }
  getData(key: string) {
    return this.data[key];
  }
  effectAllowed: string = 'all';
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/canvas/canvas-1']}>
        <Routes>
          <Route path="/canvas/:id" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Canvas 拖拽集成测试', () => {
  const mockCanvas = {
    id: 'canvas-1',
    name: '测试画布',
    userId: 'user-1',
    nodes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockIdeas = {
    data: [
      { id: 'idea-1', content: '测试想法1', userId: 'user-1', createdAt: new Date().toISOString() },
    ],
    meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock getCanvas
    (canvasService.getCanvas as any).mockResolvedValue({ data: mockCanvas });

    // Mock getConnections
    (canvasService.getConnections as any).mockResolvedValue({ data: [] });

    // Mock api.get for ideas sidebar
    (apiService.api.get as any).mockResolvedValue({ data: mockIdeas });
  });

  it('应该能从侧边栏拖拽想法并在画布上创建节点', async () => {
    // Mock addNode
    const mockNewNode = {
      id: 'node-1',
      canvasId: 'canvas-1',
      ideaId: 'idea-1',
      x: 100,
      y: 100,
      width: 180,
      height: 80,
      idea: { id: 'idea-1', content: '测试想法1' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (canvasService.addNode as any).mockResolvedValue({ data: mockNewNode });

    render(<CanvasDetailPage />, { wrapper: createWrapper() });

    // 1. 等待画布和侧边栏加载
    try {
      await waitFor(
        () => {
          expect(screen.queryByText('测试想法1')).toBeTruthy();
          expect(screen.queryByText('测试画布')).toBeTruthy();
        },
        { timeout: 2000 }
      );
    } catch (e) {
      screen.debug();
      throw e;
    }

    // 2. 模拟拖拽开始
    const ideaItem = screen.getByText('测试想法1').closest('div[draggable="true"]');
    expect(ideaItem).toBeTruthy();

    const dataTransfer = new MockDataTransfer();
    fireEvent.dragStart(ideaItem!, { dataTransfer });
    expect(dataTransfer.getData('ideaId')).toBe('idea-1');

    // 3. 模拟在容器上放置
    const editorContainer = screen.getByTestId('canvas-editor-container');
    expect(editorContainer).toBeTruthy();

    // 模拟 getBoundingClientRect
    editorContainer.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
    });

    fireEvent.dragOver(editorContainer, {
      dataTransfer,
      clientX: 100,
      clientY: 100,
    });

    fireEvent.drop(editorContainer, {
      dataTransfer,
      clientX: 100,
      clientY: 100,
    });

    // 4. 验证是否成功渲染（验证副作用）
    // 使用 findByText 自动等待
    expect(await screen.findByText('节点已添加')).toBeTruthy();

    // 验证新节点是否出现在画布上
    const newNode = await screen.findByTestId('canvas-node-group');
    expect(newNode).toBeTruthy();

    // 在新节点内部查找文本，避免与侧边栏冲突
    const nodeText = newNode.querySelector('[data-testid="text"]');
    // 如果 content 为空，CanvasNode 会显示“双击编辑”或节点类型标签
    expect(nodeText?.textContent).toMatch(/测试想法1|双击编辑/);

    // 5. 验证节点位置
    expect(newNode.getAttribute('data-x')).toBe('100');
    expect(newNode.getAttribute('data-y')).toBe('100');
  });

  describe('Region 交互与分组测试', () => {
    it('应该能进入区域创建模式并绘制区域', async () => {
      const mockRegionNode = {
        id: 'region-1',
        canvasId: 'canvas-1',
        type: 'region',
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        content: '新建区域',
        color: DEFAULT_REGION_COLOR,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (canvasService.addNode as any).mockResolvedValue({ data: mockRegionNode });

      render(<CanvasDetailPage />, { wrapper: createWrapper() });

      const toolbarBtn = await screen.findByRole('button', { name: '创建区域' });
      fireEvent.click(toolbarBtn);
      expect(screen.getByText('请在画布上拖拽创建区域')).toBeTruthy();

      const stage = screen.getByTestId('stage');
      fireEvent.mouseDown(stage, { button: 0, clientX: 50, clientY: 50 });

      // 等待状态更新
      await waitFor(() => {}, { timeout: 0 });

      fireEvent.mouseMove(stage, { clientX: 250, clientY: 250 });

      // 等待 Ghost Region 渲染 (验证 mouseMove 生效)
      await waitFor(() => {
        const rects = screen.getAllByTestId('rect');
        // Ghost region has specific fill
        const ghost = rects.find((r) => r.getAttribute('data-fill') === 'rgba(139, 92, 246, 0.1)');
        expect(ghost).toBeTruthy();
      });

      fireEvent.mouseUp(stage, { clientX: 250, clientY: 250 });

      await waitFor(() => {
        expect(canvasService.addNode).toHaveBeenCalledWith(
          'canvas-1',
          expect.objectContaining({
            type: 'region',
            x: 50,
            y: 50,
            width: 200,
            height: 200,
          })
        );
      });

      expect(await screen.findByText('区域已创建')).toBeTruthy();
    });

    it('将节点拖入区域时应更新 parentId', async () => {
      const regionNode = {
        id: 'region-1',
        type: 'region',
        x: 0,
        y: 0,
        width: 500,
        height: 500,
        content: '大区域',
      };
      const ideaNode = {
        id: 'node-1',
        type: 'sub_idea',
        x: 600,
        y: 600,
        width: 100,
        height: 100,
        content: '独立节点',
      };

      (canvasService.getCanvas as any).mockResolvedValue({
        data: { ...mockCanvas, nodes: [regionNode, ideaNode] },
      });
      (canvasService.updateNode as any).mockResolvedValue({
        data: { ...ideaNode, parentId: 'region-1' },
      });

      render(<CanvasDetailPage />, { wrapper: createWrapper() });

      const nodeGroup = await screen.findByText('独立节点');
      const nodeEl = nodeGroup.closest('[data-testid="canvas-node-group"]');

      // 模拟移动到 (100, 100)，位于区域内
      fireEvent.blur(nodeEl!, { target: { x: () => 100, y: () => 100 } });

      await waitFor(() => {
        expect(canvasService.updateNode).toHaveBeenCalledWith(
          'node-1',
          expect.objectContaining({
            parentId: 'region-1',
          })
        );
      });
    });

    it('移动区域时应联动更新子节点位置', async () => {
      const region = {
        id: 'region-1',
        type: 'region',
        x: 100,
        y: 100,
        width: 300,
        height: 300,
        content: '大区域',
      };
      const child = {
        id: 'node-2',
        type: 'sub_idea',
        parentId: 'region-1',
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        content: '子节点',
      };

      (canvasService.getCanvas as any).mockResolvedValue({
        data: { ...mockCanvas, nodes: [region, child] },
      });
      (canvasService.updateNode as any).mockResolvedValue({ data: { ...region, x: 200, y: 200 } });

      render(<CanvasDetailPage />, { wrapper: createWrapper() });

      const regionText = await screen.findByText('大区域');
      const regionEl = regionText.closest('[data-testid="canvas-node-group"]');

      // 区域向右下方移动 100, 100
      fireEvent.blur(regionEl!, { target: { x: () => 200, y: () => 200 } });

      await waitFor(() => {
        const childGroup = screen.getByText('子节点').closest('[data-testid="canvas-node-group"]');
        expect(childGroup?.getAttribute('data-x')).toBe('250');
        expect(childGroup?.getAttribute('data-y')).toBe('250');
      });
    });
  });
});
