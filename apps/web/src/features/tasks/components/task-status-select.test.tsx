import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskStatusSelect } from './task-status-select';
import { TaskStatus } from '../services/tasks.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tasksService } from '../services/tasks.service';

// Mock tasks service
vi.mock('../services/tasks.service', async () => {
  const actual = await vi.importActual<any>('../services/tasks.service');
  return {
    ...actual,
    tasksService: {
      updateTask: vi.fn().mockResolvedValue({ data: { id: 'task-1', status: TaskStatus.done } }),
    },
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  // Pre-seed the cache for optimistic update testing
  queryClient.setQueryData(['task', 'task-1'], { id: 'task-1', status: TaskStatus.todo });
  queryClient.setQueryData(['tasks'], {
    data: [{ id: 'task-1', status: TaskStatus.todo }],
    meta: { total: 1 },
  });

  return {
    queryClient,
    Wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
};

describe('TaskStatusSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render current status badge', () => {
    const { Wrapper } = createWrapper();
    render(<TaskStatusSelect taskId="task-1" currentStatus={TaskStatus.todo} />, {
      wrapper: Wrapper,
    });
    expect(screen.getByText('待处理')).toBeTruthy();
  });

  it('should open dropdown and show options', () => {
    const { Wrapper } = createWrapper();
    render(<TaskStatusSelect taskId="task-1" currentStatus={TaskStatus.todo} />, {
      wrapper: Wrapper,
    });

    fireEvent.click(screen.getByText('待处理'));

    expect(screen.getByText('进行中')).toBeTruthy();
    expect(screen.getByText('已完成')).toBeTruthy();
  });

  it('should call updateTask and update cache optimistically', async () => {
    const { Wrapper, queryClient } = createWrapper();
    render(<TaskStatusSelect taskId="task-1" currentStatus={TaskStatus.todo} />, {
      wrapper: Wrapper,
    });

    fireEvent.click(screen.getByText('待处理'));
    fireEvent.click(screen.getByText('已完成'));

    // Check if service was called
    expect(tasksService.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.done });

    // Check optimistic update in cache
    const taskData = queryClient.getQueryData(['task', 'task-1']) as any;
    expect(taskData.status).toBe(TaskStatus.done);

    const tasksListData = queryClient.getQueryData(['tasks']) as any;
    expect(tasksListData.data[0].status).toBe(TaskStatus.done);
  });

  it('should rollback on error', async () => {
    const { Wrapper, queryClient } = createWrapper();
    (tasksService.updateTask as any).mockRejectedValueOnce(new Error('Update failed'));

    render(<TaskStatusSelect taskId="task-1" currentStatus={TaskStatus.todo} />, {
      wrapper: Wrapper,
    });

    fireEvent.click(screen.getByText('待处理'));
    fireEvent.click(screen.getByText('已完成'));

    // Wait for mutation to fail and rollback
    await waitFor(() => {
      const taskData = queryClient.getQueryData(['task', 'task-1']) as any;
      expect(taskData.status).toBe(TaskStatus.todo);
    });
  });
});
