import { useState, useCallback } from 'react';
import {
  createShare,
  updateShare,
  deleteShare,
  getShares,
  getSharedCanvas,
  CanvasShare,
  CreateShareDto,
  UpdateShareDto,
  SharedCanvasResponse,
  Permission,
} from '../services/canvas-share.service';
import { Message } from '@arco-design/web-react';

/**
 * Canvas Share Hook
 * Story 8.1: 画布分享链接
 */
export const useCanvasShare = (canvasId: string) => {
  const [shares, setShares] = useState<CanvasShare[]>([]);
  const [loading, setLoading] = useState(false);
  const [sharedCanvas, setSharedCanvas] = useState<SharedCanvasResponse['data'] | null>(null);

  /**
   * 创建分享链接
   */
  const createShareLink = useCallback(
    async (data: CreateShareDto) => {
      setLoading(true);
      try {
        const response = await createShare(canvasId, data);
        Message.success('分享链接已创建');
        // 刷新列表
        await loadShares();
        return response.data;
      } catch (error: any) {
        Message.error(error.response?.data?.message || '创建失败');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canvasId]
  );

  /**
   * 更新分享链接
   */
  const updateShareLink = useCallback(
    async (shareToken: string, data: UpdateShareDto) => {
      setLoading(true);
      try {
        const response = await updateShare(canvasId, shareToken, data);
        Message.success('分享链接已更新');
        // 刷新列表
        await loadShares();
        return response.data;
      } catch (error: any) {
        Message.error(error.response?.data?.message || '更新失败');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canvasId]
  );

  /**
   * 删除分享链接
   */
  const removeShareLink = useCallback(
    async (shareToken: string) => {
      setLoading(true);
      try {
        await deleteShare(canvasId, shareToken);
        Message.success('分享链接已删除');
        // 刷新列表
        await loadShares();
      } catch (error: any) {
        Message.error(error.response?.data?.message || '删除失败');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canvasId]
  );

  /**
   * 加载所有分享链接
   */
  const loadShares = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getShares(canvasId);
      setShares(response.data);
    } catch (error: any) {
      Message.error(error.response?.data?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [canvasId]);

  /**
   * 访问分享画布（用于公开访问）
   */
  const loadSharedCanvas = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const response = await getSharedCanvas(token);
      setSharedCanvas(response.data);
      return response.data;
    } catch (error: any) {
      Message.error(error.response?.data?.message || '加载失败');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    shares,
    loading,
    sharedCanvas,
    createShareLink,
    updateShareLink,
    removeShareLink,
    loadShares,
    loadSharedCanvas,
  };
};
