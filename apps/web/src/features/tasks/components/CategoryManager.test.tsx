import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategoryManager } from './CategoryManager';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { categoriesService } from '../services/categoriesService';

vi.mock('../services/categoriesService');

describe('CategoryManager', () => {
  const mockCategories = [{ id: '1', name: 'Work', color: '#ff0000' }];

  beforeEach(() => {
    vi.clearAllMocks();
    (categoriesService.getAll as any).mockResolvedValue({ data: mockCategories });
  });

  it('should render the list of categories', async () => {
    render(<CategoryManager onUpdate={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Work')).toBeDefined();
    });
  });

  it('should call create service when adding a new category', async () => {
    (categoriesService.create as any).mockResolvedValue({
      id: '2',
      name: 'NewCat',
      color: '#0000ff',
    });

    render(<CategoryManager onUpdate={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('新分类名称'), { target: { value: 'NewCat' } });
    fireEvent.click(screen.getByText('添加'));

    await waitFor(() => {
      expect(categoriesService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'NewCat',
        })
      );
    });
  });
});
