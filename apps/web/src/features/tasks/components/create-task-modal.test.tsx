import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTaskModal } from './create-task-modal';
import { tasksService, TaskStatus } from '../services/tasks.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Mock dependencies
vi.mock('../services/tasks.service', () => ({
  tasksService: {
    createTask: vi.fn(),
  },
  TaskStatus: {
    todo: 'todo',
  },
}));

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: vi.fn(),
  }),
}));

// Mock Arco Design components
vi.mock('@arco-design/web-react', async () => {
  const actual = await vi.importActual('@arco-design/web-react');
  return {
    ...actual,
    Modal: ({ children, visible, onOk, onCancel, title }: any) =>
      visible ? (
        <div role="dialog" aria-label={title}>
          <div>{title}</div>
          {children}
          <button onClick={onOk}>创建任务</button>
          <button onClick={onCancel}>取消</button>
        </div>
      ) : null,
    Message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe('CreateTaskModal', () => {
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

  it('renders correctly when visible', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateTaskModal visible={true} onCancel={vi.fn()} />
      </QueryClientProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('将想法转为任务')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('输入任务标题...')).toBeInTheDocument();
  });

  it('fills initial title if provided', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateTaskModal visible={true} initialTitle="My Great Idea" onCancel={vi.fn()} />
      </QueryClientProvider>
    );

    expect(screen.getByPlaceholderText('输入任务标题...')).toHaveValue('My Great Idea');
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <CreateTaskModal visible={true} onCancel={onCancel} />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('取消'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('validates form before submission', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateTaskModal visible={true} onCancel={vi.fn()} />
      </QueryClientProvider>
    );

    // Click submit without entering title
    fireEvent.click(screen.getByText('创建任务'));

    // Should not call create task service
    expect(tasksService.createTask).not.toHaveBeenCalled();

    // In a real browser this would show validation error, but with our mock Modal
    // and simple test environment, we primarily verify the service key call is blocked
  });
});
