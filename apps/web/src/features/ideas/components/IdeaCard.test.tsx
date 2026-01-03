import { render, screen, fireEvent } from '@testing-library/react';
import { IdeaCard } from './IdeaCard';
import { Idea } from '../types';
import { vi, describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the ideas service
vi.mock('../services/ideas.service', () => ({
  ideasService: {
    deleteIdea: vi.fn().mockResolvedValue(undefined),
  },
}));

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

describe('IdeaCard', () => {
  const mockIdea: Idea = {
    id: '1',
    content: 'Test content for idea card',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: {
      type: 'link',
      url: 'https://example.com',
    },
  };

  it('should render content summary', () => {
    render(<IdeaCard idea={mockIdea} onClick={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByText('Test content for idea card')).toBeTruthy();
  });

  it('should render relative time', () => {
    render(<IdeaCard idea={mockIdea} onClick={vi.fn()} />, { wrapper: createWrapper() });
    // Since it's created "now", it should show "刚刚"
    expect(screen.getByText('刚刚')).toBeTruthy();
  });

  it('should show source icon for link type', () => {
    const { container } = render(<IdeaCard idea={mockIdea} onClick={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    // IconLink should be present
    expect(container.querySelector('.arco-icon-link')).toBeTruthy();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<IdeaCard idea={mockIdea} onClick={handleClick} />, { wrapper: createWrapper() });
    fireEvent.click(screen.getByText('Test content for idea card'));
    expect(handleClick).toHaveBeenCalledWith(mockIdea);
  });

  it('should show delete button on hover', () => {
    const { container } = render(<IdeaCard idea={mockIdea} onClick={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    // Delete button should exist (even if opacity is 0 initially)
    expect(container.querySelector('[aria-label="删除想法"]')).toBeTruthy();
  });
});
