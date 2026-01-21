import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, Button, Message, Modal } from '@arco-design/web-react';
import {
  IconEdit,
  IconDelete,
  IconApps,
  IconCheckCircle,
  IconBulb,
  IconShareExternal,
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import { ShareSettingsModal } from '@/components/ShareSettingsModal';
import { findOrCreateCanvasByIdeaId } from '@/features/canvas/services/canvas.service';
import { CreateTaskModal } from '@/features/tasks/components/create-task-modal';
import { formatFullTime } from '../../../utils/date';
import { Idea, IdeaSource } from '../types';
import { SourceInput } from './SourceInput';
import { SourceList } from './SourceList';
import { MemoryRecoveryCard } from './MemoryRecoveryCard';
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
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const hasTask = (idea.tasks?.length ?? 0) > 0;
  const hasCanvas = !!idea.canvas;

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

  // Visibility mutation
  const visibilityMutation = useMutation({
    mutationFn: (isPublic: boolean) => ideasService.updateVisibility(idea.id, isPublic),
    onSuccess: (updatedIdea) => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      onUpdate?.(updatedIdea);
      Message.success(updatedIdea.isPublic ? '已设为公开' : '已设为私密');
    },
    onError: () => {
      Message.error('更新可见性失败');
    },
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
    <div className="flex flex-col h-full text-slate-200 relative overflow-hidden">
      {/* Dashboard-style dynamic glow effects */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Fixed Header Area */}
      <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-xl shadow-black/10">
              <IconBulb style={{ fontSize: 20, color: '#a855f7' }} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-0.5">
                灵感详情
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-none">
                Idea Detail
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="text"
              size="mini"
              icon={<IconEdit />}
              onClick={handleStartEdit}
              className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
              title="编辑想法"
            />
            <Button
              type="text"
              size="mini"
              icon={<IconShareExternal />}
              onClick={() => setIsShareModalVisible(true)}
              className="text-slate-400 hover:text-green-400 hover:bg-green-400/10"
              title="分享想法"
            />
            <Button
              type="text"
              size="mini"
              icon={<IconDelete />}
              onClick={handleDelete}
              className="text-slate-500 hover:text-red-400 hover:bg-red-400/10"
              loading={deleteMutation.isPending}
              title="删除想法"
            />
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5">
          <span className="text-slate-500 text-[10px] uppercase tracking-wider pl-2">
            {formatFullTime(idea.createdAt)}
          </span>
          <div className="flex items-center gap-2">
            {hasTask ? (
              <Button
                size="mini"
                className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 rounded-lg text-[11px]"
                icon={<IconCheckCircle />}
                onClick={() => navigate(`/tasks/${idea.tasks?.[0]?.id}`)}
              >
                查看任务
              </Button>
            ) : (
              <Button
                size="mini"
                className="bg-slate-800 text-slate-400 border-slate-700 hover:border-purple-500/50 hover:text-purple-400 rounded-lg text-[11px]"
                icon={<IconCheckCircle />}
                onClick={() => setIsTaskModalVisible(true)}
              >
                转为任务
              </Button>
            )}
            {hasCanvas ? (
              <Button
                size="mini"
                className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 rounded-lg text-[11px]"
                icon={<IconApps />}
                onClick={() => canvasMutation.mutate()}
                loading={canvasMutation.isPending}
              >
                查看画布
              </Button>
            ) : (
              <Button
                size="mini"
                className="bg-slate-800 text-slate-400 border-slate-700 hover:border-blue-500/50 hover:text-blue-400 rounded-lg text-[11px]"
                icon={<IconApps />}
                onClick={() => canvasMutation.mutate()}
                loading={canvasMutation.isPending}
              >
                开启画布
              </Button>
            )}
          </div>
        </div>

        {/* Sticky Section Title */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {currentSection === 'sources' && idea.sources && idea.sources.length > 0
                ? `想法来源 (${idea.sources.length})`
                : '想法内容'}
            </span>
          </div>
          {!isEditing && (
            <div className="flex gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${currentSection === 'content' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-slate-700'}`}
              />
              <div
                className={`w-1.5 h-1.5 rounded-full ${currentSection === 'sources' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-8"
      >
        {/* 记忆恢复卡片 - 仅在沉底点子时显示 */}
        {idea.isStale && <MemoryRecoveryCard idea={idea} />}

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
      <ShareSettingsModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        type="idea"
        isPublic={!!idea.isPublic}
        publicToken={idea.publicToken || null}
        onVisibilityChange={async (checked) => {
          await visibilityMutation.mutateAsync(checked);
        }}
      />
    </div>
  );
};
