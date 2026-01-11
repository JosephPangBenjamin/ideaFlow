import { api } from '@/services/api';
import { IdeaSource } from '../../ideas/types';

// Canvas V2: 节点类型枚举
export enum CanvasNodeType {
  master_idea = 'master_idea',
  sub_idea = 'sub_idea',
  annotation = 'annotation',
  image = 'image',
  region = 'region',
}

export interface Canvas {
  id: string;
  name: string;
  userId: string;
  ideaId?: string | null; // Canvas V2
  idea?: {
    id: string;
    content: string;
    sources?: IdeaSource[];
    tasks?: Array<{ id: string; status: string }>;
  } | null;
  createdAt: string;
  updatedAt: string;
  nodes?: CanvasNode[];
  _count?: { nodes: number };
}

export interface CanvasNode {
  id: string;
  canvasId: string;
  type: CanvasNodeType; // Canvas V2
  ideaId: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string | null;
  imageUrl?: string | null; // Canvas V2
  color?: string | null;
  parentId?: string | null;
  idea?: {
    id: string;
    content: string;
    sources?: IdeaSource[];
    tasks?: Array<{ id: string; status: string }>;
  } | null;
  createdAt: string;
  updatedAt: string;
  style?: any;
}

export interface CanvasConnection {
  id: string;
  canvasId: string;
  fromNodeId: string;
  toNodeId: string;
  label: string | null;
  fromNode?: CanvasNode;
  toNode?: CanvasNode;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCanvasDto {
  name?: string;
  ideaId?: string; // Canvas V2
}

export interface UpdateCanvasDto {
  name?: string;
}

export interface CreateNodeDto {
  type?: CanvasNodeType; // Canvas V2
  ideaId?: string; // Canvas V2: 现在可选
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string; // Canvas V2
  imageUrl?: string; // Canvas V2
  color?: string;
  parentId?: string;
  style?: any; // Canvas V2
}

export interface UpdateNodeDto {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  content?: string; // Canvas V2
  imageUrl?: string; // Canvas V2
  color?: string;
  parentId?: string | null;
  style?: any; // Canvas V2
}

export interface CreateConnectionDto {
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

export interface UpdateConnectionDto {
  label?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Canvas CRUD
export const getCanvases = async (page = 1, limit = 20): Promise<PaginatedResponse<Canvas>> => {
  const response = await api.get('/canvases', { params: { page, limit } });
  return response.data;
};

export const getCanvas = async (id: string): Promise<{ data: Canvas }> => {
  const response = await api.get(`/canvases/${id}`);
  return response.data;
};

export const createCanvas = async (data: CreateCanvasDto): Promise<{ data: Canvas }> => {
  const response = await api.post('/canvases', data);
  return response.data;
};

// Canvas V2: 根据想法ID查找画布
export const getCanvasByIdeaId = async (ideaId: string): Promise<{ data: Canvas | null }> => {
  const response = await api.get(`/canvases/by-idea/${ideaId}`);
  return response.data;
};

// Canvas V2: 根据想法ID查找或创建画布
export const findOrCreateCanvasByIdeaId = async (ideaId: string): Promise<{ data: Canvas }> => {
  const response = await api.post(`/canvases/by-idea/${ideaId}`);
  return response.data;
};

export const updateCanvas = async (
  id: string,
  data: UpdateCanvasDto
): Promise<{ data: Canvas }> => {
  const response = await api.patch(`/canvases/${id}`, data);
  return response.data;
};

export const deleteCanvas = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/canvases/${id}`);
  return response.data;
};

// Node CRUD
export const addNode = async (
  canvasId: string,
  data: CreateNodeDto
): Promise<{ data: CanvasNode }> => {
  const response = await api.post(`/canvases/${canvasId}/nodes`, data);
  return response.data;
};

export const getNodes = async (canvasId: string): Promise<{ data: CanvasNode[] }> => {
  const response = await api.get(`/canvases/${canvasId}/nodes`);
  return response.data;
};

export const updateNode = async (
  nodeId: string,
  data: UpdateNodeDto
): Promise<{ data: CanvasNode }> => {
  const response = await api.patch(`/canvases/nodes/${nodeId}`, data);
  return response.data;
};

export const deleteNode = async (nodeId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/canvases/nodes/${nodeId}`);
  return response.data;
};

// Connection CRUD
export const addConnection = async (
  canvasId: string,
  data: CreateConnectionDto
): Promise<{ data: CanvasConnection }> => {
  const response = await api.post(`/canvases/${canvasId}/connections`, data);
  return response.data;
};

export const getConnections = async (canvasId: string): Promise<{ data: CanvasConnection[] }> => {
  const response = await api.get(`/canvases/${canvasId}/connections`);
  return response.data;
};

export const updateConnection = async (
  connectionId: string,
  data: UpdateConnectionDto
): Promise<{ data: CanvasConnection }> => {
  const response = await api.patch(`/canvases/connections/${connectionId}`, data);
  return response.data;
};

export const deleteConnection = async (connectionId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/canvases/connections/${connectionId}`);
  return response.data;
};
