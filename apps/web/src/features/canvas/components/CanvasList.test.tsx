import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CanvasList } from './CanvasList';
import * as canvasService from '../services/canvas.service';

// Mock canvas service
vi.mock('../services/canvas.service', () => ({
  getCanvases: vi.fn(),
  createCanvas: vi.fn(),
  updateCanvas: vi.fn(),
  deleteCanvas: vi.fn(),
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCanvases = [
  {
    id: 'canvas-1',
    name: '我的第一个画布',
    userId: 'user-1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-08T12:00:00Z',
    _count: { nodes: 5 },
  },
  {
    id: 'canvas-2',
    name: '项目规划',
    userId: 'user-1',
    createdAt: '2026-01-02T00:00:00Z',
    updatedAt: '2026-01-07T10:00:00Z',
    _count: { nodes: 3 },
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CanvasList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('加载状态', () => {
    it('应该在加载时显示骨架屏', () => {
      vi.mocked(canvasService.getCanvases).mockImplementation(
        () => new Promise(() => {}) // 永远 pending
      );
      render(<CanvasList />, { wrapper: createWrapper() });
      expect(screen.getByTestId('canvas-list-loading')).toBeInTheDocument();
    });
  });

  describe('列表显示 (AC #1)', () => {
    it('应该显示画布列表', async () => {
      vi.mocked(canvasService.getCanvases).mockResolvedValue({
        data: mockCanvases,
        meta: { total: 2, page: 1, limit: 20, totalPages: 1 },
      });

      render(<CanvasList />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('我的第一个画布')).toBeInTheDocument();
        expect(screen.getByText('项目规划')).toBeInTheDocument();
      });
    });

    it('应该显示每个画布的节点数量', async () => {
      vi.mocked(canvasService.getCanvases).mockResolvedValue({
        data: mockCanvases,
        meta: { total: 2, page: 1, limit: 20, totalPages: 1 },
      });

      render(<CanvasList />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/5 个节点/)).toBeInTheDocument();
        expect(screen.getByText(/3 个节点/)).toBeInTheDocument();
      });
    });

    it('应该高亮当前激活的画布', async () => {
      vi.mocked(canvasService.getCanvases).mockResolvedValue({
        data: mockCanvases,
        meta: { total: 2, page: 1, limit: 20, totalPages: 1 },
      });

      render(<CanvasList currentCanvasId="canvas-1" />, { wrapper: createWrapper() });

      await waitFor(() => {
        const activeItem = screen.getByTestId('canvas-item-canvas-1');
        expect(activeItem).toHaveClass('active');
      });
    });
  });

  describe('画布切换 (AC #2)', () => {
    it('点击画布项应该触发 onSelect 回调', async () => {
      vi.mocked(canvasService.getCanvases).mockResolvedValue({
        data: mockCanvases,
        meta: { total: 2, page: 1, limit: 20, totalPages: 1 },
      });
      const onSelect = vi.fn();

      render(<CanvasList onSelect={onSelect} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('项目规划')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('canvas-item-canvas-2'));
      expect(onSelect).toHaveBeenCalledWith(mockCanvases[1]);
    });
  });

  describe('创建新画布 (AC #3)', () => {
    it('点击新建按钮应该创建新画布', async () => {
      const newCanvas = {
        id: 'canvas-new',
        name: '未命名画布',
        userId: 'user-1',
        createdAt: '2026-01-08T23:00:00Z',
        updatedAt: '2026-01-08T23:00:00Z',
        _count: { nodes: 0 },
      };
      vi.mocked(canvasService.getCanvases).mockResolvedValue({
        data: mockCanvases,
        meta: { total: 2, page: 1, limit: 20, totalPages: 1 },
      });
      vi.mocked(canvasService.createCanvas).mockResolvedValue({ data: newCanvas });

      const onCreate = vi.fn();
      render(<CanvasList onCreate={onCreate} />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('我的第一个画布')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('create-canvas-button'));

      await waitFor(() => {
        expect(canvasService.createCanvas).toHaveBeenCalledWith({});
        expect(onCreate).toHaveBeenCalledWith(newCanvas);
      });
    });
  });

  describe('空状态', () => {
    it('没有画布时应该显示空状态提示', async () => {
      vi.mocked(canvasService.getCanvases).mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      render(<CanvasList />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/还没有画布/)).toBeInTheDocument();
        expect(screen.getByTestId('create-first-canvas-button')).toBeInTheDocument();
      });
    });
  });
});
