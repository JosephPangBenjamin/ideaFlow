import React from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconLink, IconImage, IconFile, IconDelete } from '@arco-design/web-react/icon';
import { Button, Message, Modal } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '../../../utils/date';
import { Idea } from '../types';
import { fadeInUp, hoverAnimation, tapAnimation } from '@/utils/motion';
import { ideasService } from '../services/ideas.service';
import { findOrCreateCanvasByIdeaId } from '@/features/canvas/services/canvas.service';
import { CanvasPreviewDrawer } from '@/features/canvas/components/CanvasPreviewDrawer';
import { IconApps, IconEye } from '@arco-design/web-react/icon';

interface Props {
  idea: Idea;
  onClick?: (idea: Idea) => void;
}

export const IdeaCard: React.FC<Props> = ({ idea, onClick }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [previewVisible, setPreviewVisible] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => ideasService.deleteIdea(idea.id),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['ideas'] });

      // Snapshot current data for rollback
      const previousIdeas = queryClient.getQueryData(['ideas']);

      // Optimistically remove from cache
      queryClient.setQueryData(['ideas'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((i: Idea) => i.id !== idea.id) || [],
          meta: old.meta
            ? { ...old.meta, total: Math.max(0, (old.meta.total || 0) - 1) }
            : old.meta,
        };
      });

      return { previousIdeas };
    },
    onSuccess: () => {
      Message.success('已删除');
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousIdeas) {
        queryClient.setQueryData(['ideas'], context.previousIdeas);
      }
      Message.error('删除失败，请重试');
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });

  // Canvas V2: 进入画布
  const canvasMutation = useMutation({
    mutationFn: () => findOrCreateCanvasByIdeaId(idea.id),
    onSuccess: (response) => {
      navigate(`/canvas/${response.data.id}`);
    },
    onError: () => {
      Message.error('进入画布失败，请重试');
    },
  });

  const handleCardClick = () => {
    if (onClick) {
      onClick(idea);
    }
  };

  // Canvas V2: 进入画布处理
  const handleCanvasClick = (e: React.MouseEvent | Event) => {
    e.stopPropagation();
    canvasMutation.mutate();
  };

  const handleDeleteClick = (e: React.MouseEvent | Event) => {
    e.stopPropagation(); // Prevent card click
    Modal.confirm({
      title: '确定删除这个想法吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { status: 'danger' },
      onOk: () => {
        deleteMutation.mutate();
      },
    });
  };

  const getSourceIcon = () => {
    if (!idea.source) return null;
    switch (idea.source.type) {
      case 'link':
        return <IconLink className="w-3.5 h-3.5" />;
      case 'image':
        return <IconImage className="w-3.5 h-3.5" />;
      case 'text':
        return <IconFile className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ ...hoverAnimation, y: -4, backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
      whileTap={tapAnimation}
      className="rounded-2xl p-6 bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-xl shadow-black/5 cursor-pointer group overflow-hidden relative h-[200px]"
      onClick={handleCardClick}
    >
      {/* Dynamic Glow Effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 bg-blue-500 blur-2xl group-hover:opacity-20 transition-opacity" />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
            {getSourceIcon() || <IconFile />}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatRelativeTime(idea.createdAt)}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                type="text"
                size="small"
                icon={<IconEye />}
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewVisible(true);
                }}
                className="text-slate-400 hover:text-teal-500 hover:bg-teal-500/10 rounded-lg"
              />
              <Button
                type="text"
                size="small"
                icon={<IconApps />}
                onClick={handleCanvasClick}
                loading={canvasMutation.isPending}
                className="text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg"
              />
              <Button
                type="text"
                size="small"
                icon={<IconDelete />}
                onClick={handleDeleteClick}
                loading={deleteMutation.isPending}
                className="text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">灵感碎片</p>
          <div className="text-lg font-heading font-medium text-white mt-1 tracking-tight line-clamp-3 leading-snug group-hover:text-blue-50 transition-colors">
            {idea.content}
          </div>
        </div>
      </div>

      <CanvasPreviewDrawer
        ideaId={idea.id}
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />
    </motion.div>
  );
};
