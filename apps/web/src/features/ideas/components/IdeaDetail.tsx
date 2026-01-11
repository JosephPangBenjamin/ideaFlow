import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, Button, Message, Modal } from '@arco-design/web-react';
import { IconEdit, IconDelete, IconApps, IconCheckCircle } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import { findOrCreateCanvasByIdeaId } from '@/features/canvas/services/canvas.service';
import { CreateTaskModal } from '@/features/tasks/components/create-task-modal';
import { formatFullTime } from '../../../utils/date';
import { Idea, IdeaSource } from '../types';
import { SourceInput } from './SourceInput';
import { SourceList } from './SourceList';
import { ideasService } from '../services/ideas.service';

interface Props {
  idea: Idea;
  onUpdate?: (idea: Idea) => void;
  onDelete?: () => void;
}

export const IdeaDetail: React.FC<Props> = ({ idea, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(idea.content);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  const hasTask = (idea.tasks?.length ?? 0) > 0;

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

  // Reset edit content when idea changes
  useEffect(() => {
    setEditContent(idea.content);
    setIsEditing(false);
  }, [idea.id, idea.content]);

  // Save mutation
  const updateMutation = useMutation({
    mutationFn: (data: { content?: string; sources?: IdeaSource[] }) =>
      ideasService.updateIdea(idea.id, data),
    onSuccess: (updatedIdea) => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      onUpdate?.(updatedIdea);
      setIsEditing(false);
    },
    onError: () => {
      Message.error('保存失败，请重试');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => ideasService.deleteIdea(idea.id),
    onSuccess: () => {
      Message.success('已删除');
      onDelete?.(); // This should close the drawer in Ideas.tsx
    },
    onError: () => Message.error('删除失败，请重试'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['ideas'] }),
  });

  const handleContentChange = (value: string) => {
    setEditContent(value);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editContent !== idea.content && editContent.trim()) {
      updateMutation.mutate({ content: editContent });
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(idea.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDelete = () => {
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

  // Scroll tracking for sticky section headers
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const sourcesSectionRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState<'content' | 'sources'>('content');

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !sourcesSectionRef.current) return;
    const container = scrollContainerRef.current;
    const sourcesTop = sourcesSectionRef.current.offsetTop - container.offsetTop;
    // If scroll position is past sources section start, show sources header
    if (container.scrollTop >= sourcesTop - 60) {
      setCurrentSection('sources');
    } else {
      setCurrentSection('content');
    }
  }, []);

  return (
    <div className="flex flex-col h-full text-slate-200">
      {/* Fixed Header Area */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm px-6 py-2 border-b border-white/5">
        {/* Action Buttons Row - Single Line, Icons Only */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-xs whitespace-nowrap">
            创建于 {formatFullTime(idea.createdAt)}
          </span>
          <div className="flex items-center flex-shrink-0">
            <Button
              type="text"
              size="mini"
              icon={<IconEdit />}
              onClick={handleStartEdit}
              className="text-slate-400 hover:text-blue-400"
              title="编辑想法"
            />
            <Button
              type="text"
              size="mini"
              icon={<IconDelete />}
              onClick={handleDelete}
              className="text-slate-500 hover:text-red-400"
              loading={deleteMutation.isPending}
              title="删除想法"
            />
            {hasTask ? (
              <Button
                type="text"
                size="mini"
                icon={<IconCheckCircle className="text-green-400" />}
                onClick={() => navigate(`/tasks/${idea.tasks?.[0]?.id}`)}
                className="text-green-400"
                title="查看关联任务"
              />
            ) : (
              <Button
                type="text"
                size="mini"
                icon={<IconCheckCircle />}
                onClick={() => setIsTaskModalVisible(true)}
                className="text-slate-400 hover:text-purple-400"
                title="转为任务"
              />
            )}
            <Button
              type="text"
              size="mini"
              icon={<IconApps />}
              onClick={() => canvasMutation.mutate()}
              className="text-slate-400 hover:text-blue-400"
              loading={canvasMutation.isPending}
              title="进入画布"
            />
          </div>
        </div>

        {/* Sticky Section Title */}
        <div className="mt-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {currentSection === 'sources' && idea.sources && idea.sources.length > 0
              ? `想法来源 (${idea.sources.length})`
              : '想法内容'}
          </span>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-8"
      >
        {/* Content Section */}
        <div ref={contentSectionRef} className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            想法内容
          </span>
          <div className="relative group">
            {isEditing ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <Input.TextArea
                  value={editContent}
                  onChange={handleContentChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  autoSize={{ minRows: 6, maxRows: 25 }}
                  className="bg-slate-800/50 border-slate-700 text-slate-200 rounded-xl focus:border-purple-500/50"
                  placeholder="在此输入您的深刻见解..."
                />

                <div className="space-y-2">
                  <span className="text-xs text-slate-500">管理来源</span>
                  <SourceInput
                    value={idea.sources || []}
                    onChange={(newSources) => updateMutation.mutate({ sources: newSources })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    size="small"
                    type="secondary"
                    onClick={handleCancel}
                    className="px-6 rounded-lg"
                  >
                    取消
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={handleSave}
                    loading={updateMutation.isPending}
                    className="px-6 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    保存更改
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                {idea.content}
              </div>
            )}
          </div>
        </div>

        {/* Idea Sources Section */}
        {idea.sources && idea.sources.length > 0 && (
          <div ref={sourcesSectionRef}>
            <SourceList sources={idea.sources} className="space-y-4" />
          </div>
        )}
      </div>

      <CreateTaskModal
        visible={isTaskModalVisible}
        ideaId={idea.id}
        initialTitle={idea.content.length > 50 ? idea.content.slice(0, 47) + '...' : idea.content}
        initialSources={idea.sources || []}
        onCancel={() => setIsTaskModalVisible(false)}
        onSuccess={(taskId) => {
          setIsTaskModalVisible(false);
          if (taskId) {
            // Determine if we wait for confetti or navigate immediately -
            // Modal handles confetti delay before calling onSuccess, so we can navigate now
            navigate(`/tasks/${taskId}`);
          }
        }}
      />
    </div>
  );
};
