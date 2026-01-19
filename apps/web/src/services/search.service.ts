import { api } from './api';

/**
 * 搜索结果项 - 想法
 */
export interface SearchIdea {
  id: string;
  content: string;
  createdAt: string;
}

/**
 * 搜索结果项 - 任务
 */
export interface SearchTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
}

/**
 * 搜索结果响应
 */
export interface SearchResult {
  ideas: SearchIdea[];
  tasks: SearchTask[];
}

/**
 * 搜索服务
 * 提供全局搜索 API 调用
 */
export const searchService = {
  /**
   * 执行全局搜索
   * @param query 搜索关键词（至少 2 个字符）
   * @returns 搜索结果（想法和任务分组）
   */
  async search(query: string): Promise<SearchResult> {
    const response = await api.get<SearchResult>('/search', {
      params: { q: query },
    });
    return response.data;
  },
};
