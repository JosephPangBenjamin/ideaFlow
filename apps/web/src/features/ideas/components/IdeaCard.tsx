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
      className="group relative bg-slate-800/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl cursor-pointer shadow-xl shadow-black/5 transition-all duration-300"
      onClick={handleCardClick}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />

      {/* Action Buttons - visible on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-1">
        {/* Canvas V2: 进入画布按钮 */}
        <Button
          type="text"
          size="small"
          icon={<IconEye />}
          onClick={(e) => {
            e.stopPropagation();
            setPreviewVisible(true);
          }}
          className="text-slate-400 hover:text-teal-500 hover:bg-teal-500/10 rounded-lg"
          aria-label="预览画布"
        />
        <Button
          type="text"
          size="small"
          icon={<IconApps />}
          onClick={handleCanvasClick}
          loading={canvasMutation.isPending}
          className="text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg"
          aria-label="进入画布"
        />
        <Button
          type="text"
          size="small"
          icon={<IconDelete />}
          onClick={handleDeleteClick}
          loading={deleteMutation.isPending}
          className="text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
          aria-label="删除想法"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="text-white text-base font-medium leading-relaxed line-clamp-3 mb-4 min-h-[1.5rem] whitespace-pre-wrap group-hover:text-blue-50 transition-colors">
          {idea.content}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
            {formatRelativeTime(idea.createdAt)}
          </span>
          {idea.source && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 text-slate-400 group-hover:text-blue-400 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 transition-all duration-300">
              {getSourceIcon()}
            </div>
          )}
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
