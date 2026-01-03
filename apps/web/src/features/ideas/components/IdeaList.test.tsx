import { render, screen } from '@testing-library/react';
import { IdeaList } from './IdeaList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { vi, describe, it, expect, beforeAll } from 'vitest';

// Mock api
vi.mock('../../../services/api');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

beforeAll(() => {
  (global as any).IntersectionObserver = class IntersectionObserver {
    constructor(private callback: any) {}
    observe() {
      return null;
    }
    disconnect() {
      return null;
    }
    unobserve() {
      return null;
    }
  };
});

describe('IdeaList', () => {
  it('should show loading state', () => {
    (api.get as any).mockReturnValue(new Promise(() => {}));
    render(
      <QueryClientProvider client={queryClient}>
        <IdeaList onItemClick={vi.fn()} />
      </QueryClientProvider>
    );
    expect(screen.getByText('加载中...')).toBeTruthy();
  });

  // More tests for data rendering, empty state, etc.
});
