import { render, screen } from '@testing-library/react';
import { CategoryBadge } from './CategoryBadge';
import { describe, it, expect } from 'vitest';

describe('CategoryBadge', () => {
  it('should render the category name', () => {
    const category = { id: '1', name: 'Work', color: '#ff0000' };
    render(<CategoryBadge category={category} />);
    expect(screen.getByText('Work')).toBeDefined();
  });

  it('should apply the background color', () => {
    const category = { id: '1', name: 'Work', color: '#ff0000' };
    const { container } = render(<CategoryBadge category={category} />);
    const badge = container.querySelector('.category-badge');
    expect(badge?.getAttribute('style')).toContain('background-color: rgb(255, 0, 0)');
  });

  it('should render "Uncategorized" if category is null', () => {
    render(<CategoryBadge category={null} />);
    expect(screen.getByText('未分类')).toBeDefined();
  });
});
