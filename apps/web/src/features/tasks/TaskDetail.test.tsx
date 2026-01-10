import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskDetail from './TaskDetail';
import { tasksService, TaskStatus } from './services/tasks.service';
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

describe('TaskDetail', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
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
    // Return a promise that never resolves to keep it loading
    (tasksService.getTask as any).mockReturnValue(new Promise(() => {}));

    const { container } = renderComponent();
    // Check for skeleton class or structure (Arco's skeleton uses specific classes)
    expect(container.querySelector('.arco-skeleton')).toBeInTheDocument();
  });

  it('renders task details when loaded', async () => {
    const mockTask = {
      id: '123',
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      category: 'Work',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      userId: 'user1',
      idea: {
        id: 'idea1',
        content: 'Original Idea Content',
      },
    };

    (tasksService.getTask as any).mockResolvedValue({ data: mockTask });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('待办')).toBeInTheDocument(); // Tag content for 'todo'
      expect(screen.getByText('Original Idea Content')).toBeInTheDocument();
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

  it('renders error state', async () => {
    (tasksService.getTask as any).mockRejectedValue(new Error('Fetch failed'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('找不到该任务')).toBeInTheDocument();
    });
  });
});
