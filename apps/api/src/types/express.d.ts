import { ShareStatus } from '@prisma/client';

/**
 * 分享画布请求扩展类型
 */
interface ShareCanvasRequest {
  id: string;
  canvasId: string;
  shareToken: string;
  permission: string;
  expiresAt: Date | null;
  status: ShareStatus;
  createdAt: Date;
  createdBy: string;
  canvas: {
    id: string;
    userId: string;
    title: string;
    nodes: any[];
    connections: any[];
  };
}

declare global {
  namespace Express {
    interface Request {
      canvasShare?: ShareCanvasRequest;
    }
  }
}

export {};
