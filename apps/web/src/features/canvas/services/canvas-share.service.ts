import { api } from '@/services/api';

/**
 * 权限枚举
 * Story 8.1: 画布分享链接
 */
export enum Permission {
  VIEW_ONLY = 'VIEW_ONLY',
  EDITABLE = 'EDITABLE',
}

/**
 * 分享状态枚举
 */
export enum ShareStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
}

/**
 * 分享链接数据结构
 */
export interface CanvasShare {
  id: string;
  canvasId: string;
  shareToken: string;
  shareUrl: string;
  permission: Permission;
  expiresAt: string | null;
  status: ShareStatus;
  createdAt: string;
  createdBy: string;
}

/**
 * 创建分享链接 DTO
 */
export interface CreateShareDto {
  permission?: Permission;
  expiresAt?: string;
}

/**
 * 更新分享链接 DTO
 */
export interface UpdateShareDto {
  permission?: Permission;
  expiresAt?: string | null;
  status?: ShareStatus;
}

/**
 * 分享画布响应
 */
export interface SharedCanvasResponse {
  data: {
    canvas: any;
    permission: Permission;
    isAuthenticated: boolean;
  };
}

/**
 * Canvas Share API Service
 * Story 8.1: 画布分享链接
 */

// 生成分享链接
export const createShare = async (
  canvasId: string,
  data: CreateShareDto
): Promise<{ data: CanvasShare }> => {
  const response = await api.post(`/canvases/${canvasId}/share`, data);
  return response.data;
};

// 访问分享画布（无需 JWT）
export const getSharedCanvas = async (token: string): Promise<SharedCanvasResponse> => {
  const response = await api.get(`/shared/canvases/${token}`, {
    // 不需要认证，使用基础 URL
    baseURL: window.location.origin,
  });
  return response.data;
};

// 更新分享链接
export const updateShare = async (
  canvasId: string,
  shareToken: string,
  data: UpdateShareDto
): Promise<{ data: CanvasShare }> => {
  const response = await api.patch(`/canvases/${canvasId}/share/${shareToken}`, data);
  return response.data;
};

// 删除分享链接
export const deleteShare = async (
  canvasId: string,
  shareToken: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/canvases/${canvasId}/share/${shareToken}`);
  return response.data;
};

// 列出所有分享链接
export const getShares = async (canvasId: string): Promise<{ data: CanvasShare[] }> => {
  const response = await api.get(`/canvases/${canvasId}/shares`);
  return response.data;
};
