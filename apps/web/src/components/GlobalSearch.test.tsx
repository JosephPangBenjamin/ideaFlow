import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, createStore } from 'jotai';
import { BrowserRouter } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';
import { globalSearchOpenAtom } from '@/store/ui';
import { searchService } from '@/services/search.service';

// Mock searchService
vi.mock('@/services/search.service', () => ({
  searchService: {
    search: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 禁用 framer-motion 动画以便测试
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
        <div {...props}>{children}</div>
      ),
    },
  };
});

/**
 * GlobalSearch 组件测试
 * 验证全局搜索功能的核心交互
 */
describe('GlobalSearch', () => {
  const createTestStore = (initialOpen: boolean) => {
    const store = createStore();
    store.set(globalSearchOpenAtom, initialOpen);
    return store;
  };

  const TestWrapper = ({
    children,
    store,
  }: {
    children: React.ReactNode;
    store: ReturnType<typeof createStore>;
  }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应在 isOpen 为 true 时渲染搜索面板', () => {
    const store = createTestStore(true);
    render(
      <TestWrapper store={store}>
        <GlobalSearch />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('搜索想法和任务...')).toBeInTheDocument();
  });

  it('应在 isOpen 为 false 时不渲染搜索面板', () => {
    const store = createTestStore(false);
    render(
      <TestWrapper store={store}>
        <GlobalSearch />
      </TestWrapper>
    );

    expect(screen.queryByPlaceholderText('搜索想法和任务...')).not.toBeInTheDocument();
  });

  it('应在输入少于 2 字符时不调用搜索', async () => {
    const user = userEvent.setup();
    const store = createTestStore(true);
    render(
      <TestWrapper store={store}>
        <GlobalSearch />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('搜索想法和任务...');
    await user.type(input, 'a');

    // 等待防抖
    await waitFor(
      () => {
        expect(searchService.search).not.toHaveBeenCalled();
      },
      { timeout: 500 }
    );
  });

  it('应在输入 2 个以上字符时调用搜索（防抖）', async () => {
    const user = userEvent.setup();
    const store = createTestStore(true);
    vi.mocked(searchService.search).mockResolvedValue({
      ideas: [],
      tasks: [],
    });

    render(
      <TestWrapper store={store}>
        <GlobalSearch />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('搜索想法和任务...');
    await user.type(input, 'test');

    await waitFor(
      () => {
        expect(searchService.search).toHaveBeenCalledWith('test');
      },
      { timeout: 500 }
    );
  });

  it('应显示搜索结果', async () => {
    const user = userEvent.setup();
    const store = createTestStore(true);
    vi.mocked(searchService.search).mockResolvedValue({
      ideas: [{ id: '1', content: '测试想法内容', createdAt: new Date().toISOString() }],
      tasks: [
        {
          id: '2',
          title: '测试任务',
          description: '任务描述',
          status: 'todo',
          createdAt: new Date().toISOString(),
        },
      ],
    });

    render(
      <TestWrapper store={store}>
        <GlobalSearch />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('搜索想法和任务...');
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText(/测试想法内容/)).toBeInTheDocument();
      expect(screen.getByText(/测试任务/)).toBeInTheDocument();
    });
  });

  it('应显示空结果提示', async () => {
    const user = userEvent.setup();
    const store = createTestStore(true);
    vi.mocked(searchService.search).mockResolvedValue({
      ideas: [],
      tasks: [],
    });

    render(
      <TestWrapper store={store}>
        <GlobalSearch />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('搜索想法和任务...');
    await user.type(input, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('未找到相关内容')).toBeInTheDocument();
    });
  });

  it('应按 ESC 关闭搜索面板', async () => {
    const user = userEvent.setup();
    const store = createTestStore(true);
    render(
      <TestWrapper store={store}>
        <GlobalSearch />
      </TestWrapper>
    );

    await user.keyboard('{Escape}');

    // 搜索面板应该关闭
    await waitFor(
      () => {
        expect(screen.queryByPlaceholderText('搜索想法和任务...')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });
});
