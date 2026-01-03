import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuickCapture } from './QuickCapture';
import { useAtom } from 'jotai';
import { quickCaptureOpenAtom } from '../stores/ideas';
import { ideasService } from '../services/ideas.service';
import { Provider } from 'jotai';
import userEvent from '@testing-library/user-event';

// Mock ideasService
vi.mock('../services/ideas.service', () => ({
  ideasService: {
    createIdea: vi.fn(),
  },
}));

// Mock @arco-design/web-react
vi.mock('@arco-design/web-react', () => ({
  Message: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useAnalytics
const mockTrack = vi.fn();
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}));

// Helper component to control atom state from outside
const TestController = ({ defaultOpen = false }) => {
  const [, setIsOpen] = useAtom(quickCaptureOpenAtom);
  useEffect(() => {
    if (defaultOpen) setIsOpen(true);
  }, [defaultOpen, setIsOpen]);
  return null;
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('QuickCapture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not be visible by default', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Provider>
          <QuickCapture />
        </Provider>
      </QueryClientProvider>
    );
    expect(screen.queryByPlaceholderText(/记录一个想法/i)).toBeNull();
  });

  it('should be visible when open', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Provider>
          <TestController defaultOpen={true} />
          <QuickCapture />
        </Provider>
      </QueryClientProvider>
    );
    expect(screen.getByPlaceholderText(/记录一个想法/i)).toBeTruthy();
  });

  it('should submit an idea on Enter', async () => {
    (ideasService.createIdea as any).mockResolvedValue({ id: '1', content: 'New Idea' });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <Provider>
          <TestController defaultOpen={true} />
          <QuickCapture />
        </Provider>
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText(/记录一个想法/i);
    await user.type(input, 'New Idea');
    await user.keyboard('{Enter}');

    expect(ideasService.createIdea).toHaveBeenCalledWith({ content: 'New Idea' });
    expect(mockTrack).toHaveBeenCalledWith('idea_created');

    // Should close after submit
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/记录一个想法/i)).toBeNull();
    });
  });

  it('should close on Escape', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <Provider>
          <TestController defaultOpen={true} />
          <QuickCapture />
        </Provider>
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText(/记录一个想法/i);
    await user.click(input);
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/记录一个想法/i)).toBeNull();
    });
  });
});
