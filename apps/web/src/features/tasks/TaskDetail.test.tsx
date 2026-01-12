import { render, screen, waitFor } from '@testing-library/react';
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

describe('TaskDetail', () => {
  let queryClient: QueryClient;

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
    const mockTask = {
      id: '123',
      title: 'Done Task',
      status: 'done',
      userId: 'user1',
    };
    (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
    renderComponent();
    await waitFor(() => {
      const title = screen.getByText('Done Task');
      expect(title).toHaveClass('line-through');
    });
  });

  it('renders category with reduced opacity for done tasks', async () => {
    const mockTask = {
      id: '123',
      title: 'Done Task',
      status: 'done',
      categoryId: 'cat1',
      userId: 'user1',
      category: { id: 'cat1', name: 'Work', color: '#ff0000' },
    };
    (tasksService.getTask as any).mockResolvedValue({ data: mockTask });
    renderComponent();
    await waitFor(async () => {
      const categoryTag = (await screen.findByText('Work')).closest('.arco-tag');
      expect(categoryTag?.parentElement).toHaveClass('opacity-60');
    });
  });
});
