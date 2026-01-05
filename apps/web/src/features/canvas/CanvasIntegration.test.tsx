import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CanvasDetailPage } from './CanvasDetailPage';
import * as canvasService from './services/canvas.service';
import * as apiService from '@/services/api';

// Mock services
vi.mock('./services/canvas.service');
vi.mock('@/services/api');

// Mock react-konva
vi.mock('react-konva', () => ({
  Stage: ({ children, onClick }: { children: React.ReactNode; onClick?: any }) => (
    <div data-testid="stage" onClick={onClick}>
      {children}
    </div>
  ),
  Layer: ({ children }: { children: React.ReactNode }) => <div data-testid="layer">{children}</div>,
  Group: ({ children, x, y, onClick }: any) => (
    <div data-testid="canvas-node-group" data-x={x} data-y={y} onClick={onClick}>
      {children}
    </div>
  ),
  Rect: (props: any) => <div data-testid="rect" data-fill={props.fill} />,
  Text: ({ text }: { text: string }) => <div data-testid="text">{text}</div>,
}));

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
    expect(nodeText?.textContent).toBe('测试想法1');

    // 5. 验证节点位置
    expect(newNode.getAttribute('data-x')).toBe('100');
    expect(newNode.getAttribute('data-y')).toBe('100');
  });
});
