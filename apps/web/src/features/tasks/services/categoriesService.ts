import { api } from '@/services/api';

export interface Category {
  id: string;
  name: string;
  color?: string | null;
}

export const categoriesService = {
  async getAll(): Promise<{ data: Category[] }> {
    const response = await api.get('/categories');
    return response.data;
  },

  async create(data: { name: string; color?: string }): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<{ name: string; color: string }>
  ): Promise<{ data: Category }> {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
