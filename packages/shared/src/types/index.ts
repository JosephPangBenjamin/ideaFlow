/**
 * API Response Types
 */

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: FieldError[];
  timestamp: string;
}

export interface FieldError {
  field: string;
  message: string;
}

/**
 * User Types
 */

export interface User {
  id: string;
  username: string;
  phone?: string;
  nickname?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

/**
 * Idea Types
 */

export interface Idea {
  id: string;
  content: string;
  sources?: IdeaSource[]; // 数组形式，与 Prisma schema 一致
  userId: string;
  isStale?: boolean; // 沉底状态：7天未操作
  createdAt: string;
  updatedAt: string;
}

export interface IdeaSource {
  type: 'link' | 'image' | 'text';
  url?: string;
  title?: string;
  thumbnail?: string;
  note?: string;
}

/**
 * Task Types
 */

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
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

/**
 * Canvas Types
 */

export interface Canvas {
  id: string;
  name: string;
  userId: string;
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  createdAt: string;
  updatedAt: string;
}

export interface CanvasNode {
  id: string;
  ideaId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
}

export interface CanvasConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

/**
 * Notification Types
 */

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 'stale_reminder' | 'system';
