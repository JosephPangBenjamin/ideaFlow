import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IdeaDetail } from './IdeaDetail';
import { Idea } from '../types';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// Mock the ideas service
vi.mock('../services/ideas.service', () => ({
  ideasService: {
    updateIdea: vi.fn().mockResolvedValue({
      id: '1',
      content: 'Updated content',
      sources: [],
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

// Mock Canvas service
vi.mock('@/features/canvas/services/canvas.service', () => ({
  findOrCreateCanvasByIdeaId: vi.fn(),
  CanvasNodeType: {
    master_idea: 'master_idea',
    sub_idea: 'sub_idea',
    annotation: 'annotation',
    image: 'image',
    region: 'region',
  },
}));

vi.mock('./SourceInput', () => ({
  SourceInput: () => <div data-testid="source-input" />,
}));

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
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('IdeaDetail', () => {
  const mockIdea: Idea = {
    id: '1',
    content: 'Detailed content of the idea with rich text or whatever.',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sources: [
      {
        type: 'link',
        url: 'https://example.com',
        meta: { title: 'Test Link' },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // No-op
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

  it('should enter edit mode when double clicking content', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

    const content = screen.getByText('Detailed content of the idea with rich text or whatever.');
    fireEvent.doubleClick(content);

    // Should show textarea (by placeholder) and save/cancel buttons
    expect(screen.getByPlaceholderText('在此输入您的深刻见解...')).toBeTruthy();
    expect(screen.getByText('保存更改')).toBeTruthy();
    expect(screen.getByText('取消')).toBeTruthy();
  });

  it('should exit edit mode when clicking cancel', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

    // Enter edit mode
    const content = screen.getByText('Detailed content of the idea with rich text or whatever.');
    fireEvent.doubleClick(content);
    expect(screen.getByPlaceholderText('在此输入您的深刻见解...')).toBeTruthy();

    // Click cancel
    fireEvent.click(screen.getByText('取消'));

    // Should be back in view mode
    expect(screen.queryByPlaceholderText('在此输入您的深刻见解...')).toBeNull();
    expect(
      screen.getByText('Detailed content of the idea with rich text or whatever.')
    ).toBeTruthy();
  });

  it('should restore original content when canceling edit', () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

    // Enter edit mode
    const content = screen.getByText('Detailed content of the idea with rich text or whatever.');
    fireEvent.doubleClick(content);
    const textarea = screen.getByPlaceholderText('在此输入您的深刻见解...') as HTMLTextAreaElement;

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

  it('should call updateIdea when clicking save with changes', async () => {
    render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

    // Enter edit mode
    const content = screen.getByText('Detailed content of the idea with rich text or whatever.');
    fireEvent.doubleClick(content);
    const textarea = screen.getByPlaceholderText('在此输入您的深刻见解...') as HTMLTextAreaElement;

    // Change content
    fireEvent.change(textarea, { target: { value: 'Changed content' } });

    // Click save
    const saveBtn = screen.getByText('保存更改');
    console.log('Save button found');
    await userEvent.click(saveBtn);
    console.log('Save button clicked');

    await waitFor(
      () => {
        expect(ideasService.updateIdea).toHaveBeenCalled();
      },
      { timeout: 5000 }
    );

    expect(ideasService.updateIdea).toHaveBeenCalledWith('1', { content: 'Changed content' });
  });

  // Delete functionality tests
  describe('Delete functionality', () => {
    it('should open confirmation modal when clicking delete icon', () => {
      render(<IdeaDetail idea={mockIdea} />, { wrapper: createWrapper() });

      // Find delete button (icon button)
      const deleteBtn = document.querySelector('.arco-icon-delete')?.parentElement;
      expect(deleteBtn).toBeTruthy();

      fireEvent.click(deleteBtn!);

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
      const deleteBtn = document.querySelector('.arco-icon-delete')?.parentElement;
      fireEvent.click(deleteBtn!);

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
