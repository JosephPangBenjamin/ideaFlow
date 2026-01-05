import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { Canvas } from './Canvas';

// Mock canvas service
vi.mock('./services/canvas.service', () => ({
  getCanvases: vi.fn(),
  createCanvas: vi.fn(),
  deleteCanvas: vi.fn(),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { getCanvases, createCanvas, deleteCanvas } from './services/canvas.service';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Canvas 列表页面', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('加载状态', () => {
    it('应该在加载时显示 Spin 组件', () => {
      // 模拟正在加载
      (getCanvases as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

      render(<Canvas />, { wrapper: createWrapper() });

      // Spin 组件存在（通过查找 arco-spin 类）
      expect(document.querySelector('.arco-spin')).toBeTruthy();
    });
  });

  describe('空状态', () => {
    it('应该在没有画布时显示空状态提示', async () => {
      (getCanvases as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
      });

      render(<Canvas />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('还没有画布，点击新建画布开始')).toBeTruthy();
      });
    });
  });

  describe('画布列表', () => {
    const mockCanvases = [
      {
        id: 'canvas-1',
        name: '我的第一个画布',
        userId: 'user-1',
        createdAt: '2026-01-04T12:00:00Z',
        updatedAt: '2026-01-04T13:00:00Z',
        _count: { nodes: 3 },
      },
      {
        id: 'canvas-2',
        name: '项目规划',
        userId: 'user-1',
        createdAt: '2026-01-03T10:00:00Z',
        updatedAt: '2026-01-03T11:00:00Z',
        _count: { nodes: 0 },
      },
    ];

    it('应该显示画布列表', async () => {
      (getCanvases as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockCanvases,
        meta: { total: 2, page: 1, limit: 50, totalPages: 1 },
      });

      render(<Canvas />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('我的第一个画布')).toBeTruthy();
        expect(screen.getByText('项目规划')).toBeTruthy();
      });
    });

    it('应该显示节点数量', async () => {
      (getCanvases as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockCanvases,
        meta: { total: 2, page: 1, limit: 50, totalPages: 1 },
      });

      render(<Canvas />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('3 个节点')).toBeTruthy();
        expect(screen.getByText('0 个节点')).toBeTruthy();
      });
    });

    it('点击画布卡片应该导航到画布详情页', async () => {
      (getCanvases as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockCanvases,
        meta: { total: 2, page: 1, limit: 50, totalPages: 1 },
      });

      render(<Canvas />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('我的第一个画布')).toBeTruthy();
      });

      fireEvent.click(screen.getByText('我的第一个画布'));
      expect(mockNavigate).toHaveBeenCalledWith('/canvas/canvas-1');
    });
  });

  describe('新建画布', () => {
    it('应该显示新建画布按钮', async () => {
      (getCanvases as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
      });

      render(<Canvas />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('新建画布')).toBeTruthy();
      });
    });

    it('点击新建画布按钮应该打开对话框', async () => {
      (getCanvases as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
      });

      render(<Canvas />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('新建画布')).toBeTruthy();
      });

      fireEvent.click(screen.getByText('新建画布'));

      await waitFor(() => {
        // 对话框标题
        expect(screen.getAllByText('新建画布').length).toBeGreaterThan(1);
      });
    });

    it('创建画布成功后应该导航到新画布', async () => {
      (getCanvases as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
      });

      (createCanvas as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { id: 'new-canvas-id', name: '测试画布' },
      });

      render(<Canvas />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('新建画布')).toBeTruthy();
      });

      // 点击新建
      fireEvent.click(screen.getByText('新建画布'));

      await waitFor(() => {
        expect(screen.getByText('创建')).toBeTruthy();
      });

      // 点击创建按钮
      fireEvent.click(screen.getByText('创建'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/canvas/new-canvas-id');
      });
    });
  });
});
