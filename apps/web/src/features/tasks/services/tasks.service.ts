import { api } from '@/services/api';
import { PaginatedResponse } from '../../canvas/services/canvas.service';
import { IdeaSource } from '../../ideas/types';

export enum TaskStatus {
  todo = 'todo',
  in_progress = 'in_progress',
  done = 'done',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category?: string;
  dueDate?: string;
  ideaId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  idea?: {
    id: string;
    content: string;
    sources?: IdeaSource[];
  };
  sources?: IdeaSource[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  category?: string;
  dueDate?: string;
  ideaId?: string;
  sources?: IdeaSource[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  category?: string;
  dueDate?: string | null;
}

class TasksService {
  private readonly baseUrl = '/tasks';

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const response = await api.post(this.baseUrl, dto);
    return response.data;
  }

  async getTasks(page = 1, limit = 20): Promise<PaginatedResponse<Task>> {
    const response = await api.get(this.baseUrl, {
      params: { page, limit },
    });
    return response.data;
  }

  async getTask(id: string): Promise<{ data: Task }> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<{ data: Task }> {
    const response = await api.patch(`${this.baseUrl}/${id}`, dto);
    return response.data;
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const tasksService = new TasksService();
