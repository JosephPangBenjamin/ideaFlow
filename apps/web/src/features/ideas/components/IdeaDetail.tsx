import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, Button, Message, Modal, Tag } from '@arco-design/web-react';
import {
  IconEdit,
  IconCheck,
  IconClose,
  IconLoading,
  IconDelete,
  IconApps,
  IconCheckCircle,
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import { findOrCreateCanvasByIdeaId } from '@/features/canvas/services/canvas.service';
import { CreateTaskModal } from '@/features/tasks/components/CreateTaskModal';
import { formatFullTime } from '../../../utils/date';
import { Idea } from '../types';
import { SourcePreview } from './SourcePreview';
import { ideasService } from '../services/ideas.service';

interface Props {
  idea: Idea;
  onUpdate?: (idea: Idea) => void;
  onDelete?: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const IdeaDetail: React.FC<Props> = ({ idea, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(idea.content);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  const hasTask = (idea.tasks?.length ?? 0) > 0;
  const taskStatus = hasTask ? idea.tasks?.[0]?.status : null;

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
    setSaveStatus('idle');
  }, [idea.id, idea.content]);

  const updateMutation = useMutation({
    mutationFn: (content: string) => ideasService.updateIdea(idea.id, { content }),
    onMutate: () => {
      setSaveStatus('saving');
    },
    onSuccess: (updatedIdea) => {
      setSaveStatus('saved');
      // Invalidate and refetch ideas list
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      onUpdate?.(updatedIdea);

      // Reset saved status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    },
    onError: () => {
      setSaveStatus('error');
      Message.error('保存失败，请重试');
    },
  });

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
      onDelete?.();
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

  // Debounced auto-save
  const debouncedSave = useCallback(
    (content: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (content !== idea.content && content.trim()) {
          updateMutation.mutate(content);
        }
      }, 300);
    },
    [idea.content, updateMutation]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleContentChange = (value: string) => {
    setEditContent(value);
    debouncedSave(value);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (editContent !== idea.content && editContent.trim()) {
      updateMutation.mutate(editContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setEditContent(idea.content);
    setIsEditing(false);
    setSaveStatus('idle');
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

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="flex items-center text-sm text-slate-400">
            <IconLoading className="animate-spin mr-1" />
            保存中...
          </span>
        );
      case 'saved':
        return (
          <span className="flex items-center text-sm text-green-500">
            <IconCheck className="mr-1" />
            已保存
          </span>
        );
      case 'error':
        return <span className="flex items-center text-sm text-red-500">保存失败</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button and Save Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-slate-400 text-sm space-x-4">
          <span>{formatFullTime(idea.createdAt)}</span>
          {idea.source && (
            <span className="px-2 py-0.5 bg-white/5 rounded text-xs border border-white/5 text-slate-300">
              {idea.source.type === 'link'
                ? '链接'
                : idea.source.type === 'image'
                  ? '图片'
                  : '备注'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {renderSaveStatus()}
          {!isEditing && (
            <>
              {hasTask ? (
                <Tag
                  color={taskStatus === 'done' ? 'green' : 'arcoblue'}
                  icon={<IconCheckCircle />}
                  className="mr-2 cursor-pointer hover:opacity-80"
                  onClick={() => navigate(`/tasks/${idea.tasks?.[0]?.id}`)}
                >
                  已转任务 {taskStatus === 'done' ? '(已完成)' : ''}
                </Tag>
              ) : (
                <Button
                  type="text"
                  icon={<IconCheckCircle />}
                  onClick={() => setIsTaskModalVisible(true)}
                  className="text-slate-400 hover:text-purple-500"
                >
                  转为任务
                </Button>
              )}
              <Button
                type="text"
                icon={<IconApps />}
                onClick={() => canvasMutation.mutate()}
                className="text-slate-400 hover:text-blue-500"
                loading={canvasMutation.isPending}
              >
                进入画布
              </Button>
              <Button
                type="text"
                icon={<IconEdit />}
                onClick={handleStartEdit}
                className="text-slate-400 hover:text-white"
              >
                编辑
              </Button>
              <Button
                type="text"
                icon={<IconDelete />}
                onClick={handleDelete}
                className="text-slate-400 hover:text-red-500"
                loading={deleteMutation.isPending}
              >
                删除
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content - View or Edit Mode */}
      {isEditing ? (
        <div className="space-y-3">
          <Input.TextArea
            value={editContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            autoFocus
            autoSize={{ minRows: 3, maxRows: 20 }}
            className="bg-slate-800 border-slate-600 text-slate-200"
            style={{ backgroundColor: '#1e293b', color: '#e2e8f0', borderColor: '#475569' }}
            placeholder="输入想法内容..."
          />
          <div className="flex justify-end space-x-2">
            <Button type="secondary" icon={<IconClose />} onClick={handleCancel}>
              取消
            </Button>
            <Button
              type="primary"
              icon={<IconCheck />}
              onClick={handleSave}
              loading={saveStatus === 'saving'}
            >
              保存
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="text-white text-base leading-relaxed whitespace-pre-wrap cursor-pointer hover:bg-white/5 p-4 -m-4 rounded-xl transition-colors"
          onDoubleClick={handleStartEdit}
          title="双击编辑"
        >
          {idea.content}
        </div>
      )}

      {/* Source */}
      {idea.source && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <SourcePreview source={idea.source} />
        </div>
      )}

      <CreateTaskModal
        visible={isTaskModalVisible}
        ideaId={idea.id}
        initialTitle={idea.content.length > 50 ? idea.content.slice(0, 47) + '...' : idea.content}
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
