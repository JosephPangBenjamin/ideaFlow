import { api } from './api';

/**
 * 团队成员角色枚举
 */
export enum MemberRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

/**
 * 团队成员信息
 */
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string | null;
  canvasId: string | null;
  shareId: string | null;
  role: MemberRole;
  joinedAt: string;
  user: {
    id: string;
    username: string;
  };
}

/**
 * 团队信息
 */
export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 画布团队信息
 */
export interface CanvasTeamInfo {
  canvas: {
    id: string;
    name: string;
    owner: {
      id: string;
    };
  };
  memberCount: number;
  members: TeamMember[];
}

/**
 * Teams API Service
 * Story 8.2: 协作者注册加入
 */

// 通过邀请链接加入团队（已登录用户）
export const joinByShareToken = async (shareToken: string): Promise<{ data: TeamMember }> => {
  const response = await api.post(`/teams/join/${shareToken}`);
  return response.data;
};

// 列出团队成员
export const getTeamMembers = async (teamId: string): Promise<{ data: TeamMember[] }> => {
  const response = await api.get(`/teams/${teamId}/members`);
  return response.data;
};

// 列出画布成员（包含通过分享链接加入的）
export const getCanvasMembers = async (canvasId: string): Promise<{ data: TeamMember[] }> => {
  const response = await api.get(`/canvases/${canvasId}/members`);
  return response.data;
};

// 获取画布关联团队信息
export const getCanvasTeamInfo = async (canvasId: string): Promise<{ data: CanvasTeamInfo }> => {
  const response = await api.get(`/canvases/${canvasId}/team`);
  return response.data;
};
