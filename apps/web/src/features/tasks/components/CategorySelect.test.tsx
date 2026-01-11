import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategorySelect } from './CategorySelect';
import { describe, it, expect, vi } from 'vitest';

describe('CategorySelect', () => {
  const categories = [
    { id: '1', name: 'Work', color: '#ff0000' },
    { id: '2', name: 'Personal', color: '#00ff00' },
  ];

  it('should render currently selected category name', () => {
    render(<CategorySelect categories={categories} value="1" onChange={() => {}} />);
    expect(screen.getByText('Work')).toBeDefined();
  });

  it('should render placeholder if no value', () => {
    render(<CategorySelect categories={categories} value={null} onChange={() => {}} />);
    expect(screen.getByText('选择分类')).toBeDefined();
  });

  it('should call onChange when a category is selected', () => {
    const onChange = vi.fn();
    render(<CategorySelect categories={categories} value={null} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Personal'));

    expect(onChange).toHaveBeenCalledWith('2');
  });
});
