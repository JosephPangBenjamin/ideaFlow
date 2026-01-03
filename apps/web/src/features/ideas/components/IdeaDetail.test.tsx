import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IdeaDetail } from './IdeaDetail';
import { Idea } from '../types';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the ideas service
vi.mock('../services/ideas.service', () => ({
  ideasService: {
    updateIdea: vi.fn().mockResolvedValue({
      id: '1',
      content: 'Updated content',
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    deleteIdea: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock Arco Modal.confirm
vi.mock('@arco-design/web-react', async () => {
  const actual =
    await vi.importActual<typeof import('@arco-design/web-react')>('@arco-design/web-react');
  return {
    ...actual,
    Modal: {
      ...(actual.Modal as object),
      confirm: vi.fn(({ onOk }: { onOk?: () => void }) => {
        // Store onOk for manual triggering in tests
        (global as any).__modalOnOk = onOk;
      }),
    },
  };
});

import { ideasService } from '../services/ideas.service';
import { Modal } from '@arco-design/web-react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('IdeaDetail', () => {
  const mockIdea: Idea = {
    id: '1',
    content: 'Detailed content of the idea with rich text or whatever.',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: {
      type: 'link',
      url: 'https://example.com',
      meta: { title: 'Test Link' },
    },
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show full content', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });
    expect(
      screen.getByText('Detailed content of the idea with rich text or whatever.')
    ).toBeTruthy();
  });

  it('should show source preview', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });
    expect(screen.getByText('Test Link')).toBeTruthy();
  });

  it('should show edit button', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });
    expect(screen.getByText('编辑')).toBeTruthy();
  });

  it('should enter edit mode when clicking edit button', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByText('编辑'));

    // Should show textarea (by placeholder) and save/cancel buttons
    expect(screen.getByPlaceholderText('输入想法内容...')).toBeTruthy();
    expect(screen.getByText('保存')).toBeTruthy();
    expect(screen.getByText('取消')).toBeTruthy();
  });

  it('should exit edit mode when clicking cancel', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

    // Enter edit mode
    fireEvent.click(screen.getByText('编辑'));
    expect(screen.getByPlaceholderText('输入想法内容...')).toBeTruthy();

    // Click cancel
    fireEvent.click(screen.getByText('取消'));

    // Should be back in view mode
    expect(screen.queryByPlaceholderText('输入想法内容...')).toBeNull();
    expect(screen.getByText('编辑')).toBeTruthy();
  });

  it('should restore original content when canceling edit', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

    // Enter edit mode
    fireEvent.click(screen.getByText('编辑'));
    const textarea = screen.getByPlaceholderText('输入想法内容...') as HTMLTextAreaElement;

    // Change content
    fireEvent.change(textarea, { target: { value: 'Changed content' } });
    expect(textarea.value).toBe('Changed content');

    // Cancel
    fireEvent.click(screen.getByText('取消'));

    // Content should be original
    expect(
      screen.getByText('Detailed content of the idea with rich text or whatever.')
    ).toBeTruthy();
  });

  // Delete functionality tests
  describe('Delete functionality', () => {
    it('should show delete button', () => {
      render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });
      expect(screen.getByText('删除')).toBeTruthy();
    });

    it('should open confirmation modal when clicking delete', () => {
      render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByText('删除'));

      expect(Modal.confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '确定删除这个想法吗？',
          content: '删除后无法恢复',
          okText: '确定',
          cancelText: '取消',
        })
      );
    });

    it('should call deleteIdea when confirming deletion', async () => {
      vi.useRealTimers(); // Use real timers for this async test

      const onDelete = vi.fn();
      render(<IdeaDetail idea={mockIdea} onDelete={onDelete} />, { wrapper: createWrapper() });

      // Click delete button
      fireEvent.click(screen.getByText('删除'));

      // Simulate modal confirmation
      const modalOnOk = (global as any).__modalOnOk;
      expect(modalOnOk).toBeDefined();

      // Execute onOk callback (simulating user clicking confirm)
      modalOnOk();

      // Wait for mutation to complete
      await waitFor(
        () => {
          expect(ideasService.deleteIdea).toHaveBeenCalledWith('1');
        },
        { timeout: 2000 }
      );

      vi.useFakeTimers(); // Restore fake timers
    });
  });
});
