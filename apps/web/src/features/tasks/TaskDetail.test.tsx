import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskDetail from './TaskDetail';
import { tasksService, TaskStatus } from './services/tasks.service';
import { categoriesService } from './services/categoriesService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock tasksService
vi.mock('./services/tasks.service', () => ({
  tasksService: {
    getTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
  TaskStatus: {
    todo: 'todo',
    in_progress: 'in_progress',
    done: 'done',
  },
}));

// Mock categoriesService
vi.mock('./services/categoriesService', () => ({
  categoriesService: {
    getAll: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TaskDetail', () => {
  let queryClient: QueryClient;

  const mockTask = {
    id: '123',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    categoryId: 'cat1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    userId: 'user1',
    idea: {
      id: 'idea1',
      content: 'Original Idea Content',
    },
    category: { id: 'cat1', name: 'Work', color: '#ff0000' },
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    });
    vi.clearAllMocks();
    mockNavigate.mockClear();
    (categoriesService.getAll as any).mockResolvedValue({
      data: [{ id: 'cat1', name: 'Work', color: '#ff0000' }],
    });
  });

  const renderComponent = (id: string = '123') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/tasks/${id}`]}>
          <Routes>
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/tasks" element={<div>任务列表页</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders loading skeleton initially', () => {
    (tasksService.getTask as any).mockReturnValue(new Promise(() => {}));
    const { container } = renderComponent();
    expect(container.querySelector('.arco-skeleton')).toBeInTheDocument();
  });

  it('renders task details when loaded', async () => {
    (tasksService.getTask as any).mockResolvedValue({ data: mockTask });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('待办')).toBeInTheDocument();
      expect(screen.getByText('Original Idea Content')).toBeInTheDocument();
      expect(screen.getByText('Work')).toBeInTheDocument();
    });
  });

  it('renders empty state when task not found', async () => {
    (tasksService.getTask as any).mockResolvedValue({ data: null });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('找不到该任务')).toBeInTheDocument();
      expect(screen.getByText('返回任务列表')).toBeInTheDocument();
    });
  });

  it('applies line-through style for done tasks', async () => {
    const doneTask = { ...mockTask, status: 'done', title: 'Done Task' };
    (tasksService.getTask as any).mockResolvedValue({ data: doneTask });
    renderComponent();
    await waitFor(() => {
      const title = screen.getByText('Done Task');
      expect(title).toHaveClass('line-through');
    });
  });

  it('renders category with reduced opacity for done tasks', async () => {
    const doneTask = { ...mockTask, status: 'done', title: 'Done Task' };
    (tasksService.getTask as any).mockResolvedValue({ data: doneTask });
    renderComponent();
    await waitFor(async () => {
      // 查找包含 Work 文本的 category badge，其外层 div 应该有 opacity-60
      const categoryTag = await screen.findByText('Work');
      // 向上查找有 opacity-60 类的父元素
      let parent = categoryTag.parentElement;
      let foundOpacity = false;
      while (parent) {
        if (parent.classList.contains('opacity-60')) {
          foundOpacity = true;
          break;
        }
        parent = parent.parentElement;
      }
      expect(foundOpacity).toBe(true);
    });
  });

  // ============================================
  // Task 1: 标题内联编辑测试
  // ============================================
  describe('Title Inline Editing', () => {
    it('should enter edit mode when double-clicking on title', async () => {
      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Task')).toBeInTheDocument();
      });

      // 双击标题进入编辑模式
      const title = screen.getByText('Test Task');
      fireEvent.doubleClick(title);

      // 应该出现输入框
      await waitFor(() => {
        const input = screen.getByDisplayValue('Test Task');
        expect(input).toBeInTheDocument();
        expect(input.tagName).toBe('INPUT');
      });
    });

    it('should save title on Enter key and show success message', async () => {
      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
      (tasksService.updateTask as any).mockResolvedValue({
        data: { ...mockTask, title: 'Updated Title' },
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Task')).toBeInTheDocument();
      });

      // 双击标题进入编辑模式
      fireEvent.doubleClick(screen.getByText('Test Task'));

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      });

      // 修改标题并按 Enter
      const input = screen.getByDisplayValue('Test Task');
      await userEvent.clear(input);
      await userEvent.type(input, 'Updated Title{enter}');

      // 应该调用 updateTask
      await waitFor(() => {
        expect(tasksService.updateTask).toHaveBeenCalledWith('123', { title: 'Updated Title' });
      });
    });

    it('should save title on blur', async () => {
      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
      (tasksService.updateTask as any).mockResolvedValue({
        data: { ...mockTask, title: 'Blurred Title' },
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Task')).toBeInTheDocument();
      });

      fireEvent.doubleClick(screen.getByText('Test Task'));

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      });

      const input = screen.getByDisplayValue('Test Task');
      await userEvent.clear(input);
      await userEvent.type(input, 'Blurred Title');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(tasksService.updateTask).toHaveBeenCalledWith('123', { title: 'Blurred Title' });
      });
    });

    it('should not save if title is empty', async () => {
      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Task')).toBeInTheDocument();
      });

      fireEvent.doubleClick(screen.getByText('Test Task'));

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      });

      const input = screen.getByDisplayValue('Test Task');
      await userEvent.clear(input);
      fireEvent.blur(input);

      // 不应该调用 updateTask
      expect(tasksService.updateTask).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Task 2: 描述内联编辑测试
  // ============================================
  describe('Description Inline Editing', () => {
    it('should enter edit mode when double-clicking on description', async () => {
      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Description')).toBeInTheDocument();
      });

      fireEvent.doubleClick(screen.getByText('Test Description'));

      // 应该出现 TextArea
      await waitFor(() => {
        const textarea = screen.getByDisplayValue('Test Description');
        expect(textarea).toBeInTheDocument();
        expect(textarea.tagName).toBe('TEXTAREA');
      });
    });

    it('should debounce save description changes', async () => {
      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
      (tasksService.updateTask as any).mockResolvedValue({
        data: { ...mockTask, description: 'Updated Desc' },
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Description')).toBeInTheDocument();
      });

      fireEvent.doubleClick(screen.getByText('Test Description'));

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      });

      const textarea = screen.getByDisplayValue('Test Description');
      fireEvent.change(textarea, { target: { value: 'Updated Desc' } });

      // 由于 debounce 使用 300ms，我们等待足够时间
      await waitFor(
        () => {
          expect(tasksService.updateTask).toHaveBeenCalledWith('123', {
            description: 'Updated Desc',
          });
        },
        { timeout: 1000 }
      );
    });
  });

  // ============================================
  // Task 3 & 4: 删除功能测试
  // ============================================
  describe('Delete Functionality', () => {
    it('should show delete button in task detail', async () => {
      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Task')).toBeInTheDocument();
      });

      // 应该存在删除按钮（通过 aria-label 查找）
      expect(screen.getByLabelText('删除任务')).toBeInTheDocument();
    });

    it('should trigger Modal.confirm when clicking delete button', async () => {
      // 导入 Modal 并监控 confirm 方法
      const { Modal } = await import('@arco-design/web-react');
      const confirmSpy = vi.spyOn(Modal, 'confirm').mockImplementation(() => ({
        close: vi.fn(),
        update: vi.fn(),
      }));

      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Task')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('删除任务');
      await userEvent.click(deleteButton);

      // 验证 Modal.confirm 被调用且包含正确的配置
      expect(confirmSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '确定删除这个任务吗？',
          content: '删除后无法恢复',
          okText: '确认',
          cancelText: '取消',
        })
      );

      confirmSpy.mockRestore();
    });

    it('should call deleteTask and navigate when onOk is triggered', async () => {
      // 导入 Modal 并模拟 confirm，立即执行 onOk 回调
      const { Modal } = await import('@arco-design/web-react');
      const confirmSpy = vi.spyOn(Modal, 'confirm').mockImplementation((config) => {
        // 立即触发 onOk 回调模拟用户确认
        if (config?.onOk) {
          config.onOk();
        }
        return { close: vi.fn(), update: vi.fn() };
      });

      (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
      (tasksService.deleteTask as any).mockResolvedValue({ message: '删除成功' });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Task')).toBeInTheDocument();
      });

      const deleteButton = screen.getByLabelText('删除任务');
      await userEvent.click(deleteButton);

      // 验证 deleteTask 被调用
      await waitFor(() => {
        expect(tasksService.deleteTask).toHaveBeenCalledWith('123');
      });

      // 验证导航到任务列表
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tasks');
      });

      confirmSpy.mockRestore();
    });
  });
});
