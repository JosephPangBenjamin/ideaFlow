import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskTabs } from './TaskTabs';
import { TaskView } from '../../../stores/tasks';

// Mock the hook
const setView = vi.fn();
vi.mock('../hooks/useTaskFilters', () => ({
  useTaskFilters: () => ({
    view: 'today',
    setView,
  }),
}));

describe('TaskTabs', () => {
  it('renders all tabs', () => {
    render(<TaskTabs />);
    expect(screen.getByText('今天')).toBeInTheDocument();
    expect(screen.getByText('即将到期')).toBeInTheDocument();
    expect(screen.getByText('收集箱')).toBeInTheDocument();
    expect(screen.getByText('已整理')).toBeInTheDocument();
  });

  it('calls setView when a tab is clicked', () => {
    render(<TaskTabs />);
    fireEvent.click(screen.getByText('即将到期'));
    expect(setView).toHaveBeenCalledWith(TaskView.upcoming);
  });
});
