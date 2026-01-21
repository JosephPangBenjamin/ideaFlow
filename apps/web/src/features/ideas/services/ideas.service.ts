import { api } from '../../../services/api';
import { CreateIdeaDto, Idea, UpdateIdeaDto } from '../types';

export const ideasService = {
  createIdea: async (data: CreateIdeaDto): Promise<Idea> => {
    const response = await api.post<Idea>('/ideas', data);
    return response.data;
  },

  getIdeas: async (filters: any = {}) => {
    const response = await api.get<{ data: Idea[]; meta: any }>('/ideas', {
      params: filters,
    });
    return response.data;
  },

  getIdea: async (id: string): Promise<Idea> => {
    const response = await api.get<{ data: Idea }>(`/ideas/${id}`);
    return response.data.data;
  },

  updateIdea: async (id: string, data: UpdateIdeaDto): Promise<Idea> => {
    const response = await api.patch<{ data: Idea }>(`/ideas/${id}`, data);
    return response.data.data;
  },

  deleteIdea: async (id: string): Promise<void> => {
    await api.delete(`/ideas/${id}`);
  },

  // 获取沉底点子数量 (AC4)
  getStaleCount: async (): Promise<number> => {
    const response = await api.get<{ data: Idea[]; meta: { total: number } }>('/ideas', {
      params: { isStale: true, limit: 1 },
    });
    return response.data.meta.total;
  },
};
