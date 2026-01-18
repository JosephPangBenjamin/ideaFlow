import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Typography,
  Space,
  Skeleton,
  Empty,
  Breadcrumb,
  DatePicker,
  Message,
  Input,
  Modal,
} from '@arco-design/web-react';
import type { RefInputType } from '@arco-design/web-react/es/Input/interface';
import {
  IconArrowLeft,
  IconClockCircle,
  IconCalendar,
  IconDelete,
} from '@arco-design/web-react/icon';
import { tasksService, TaskStatus } from './services/tasks.service';
import { formatFullTime } from '../../utils/date';
import { TaskDueDateBadge } from './components/task-due-date-badge';
import { TaskStatusSelect } from './components/task-status-select';
import { SourceList } from '../ideas/components/SourceList';
import { CategoryManager } from './components/CategoryManager';
import { categoriesService } from './services/categoriesService';
import dayjs from 'dayjs';
import { getDueDateStatus } from './utils/task-utils';
import { CategorySelect } from './components/CategorySelect';

const { Title, Text } = Typography;

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ============================================
  // 状态管理：标题编辑
  // ============================================
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const titleInputRef = useRef<RefInputType>(null);

  // ============================================
  // 状态管理：描述编辑
  // ============================================
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const descriptionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: taskResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksService.getTask(id!),
    enabled: !!id,
  });

  const [isManageOpen, setIsManageOpen] = React.useState(false);

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const task = taskResponse?.data;

  // 当 task 数据变化时，同步本地状态
  useEffect(() => {
    if (task) {
      setTitleValue(task.title);
      setDescriptionValue(task.description || '');
      setIsEditingTitle(false);
      setIsEditingDescription(false);
    }
  }, [task?.id, task?.title, task?.description]);

  // 聚焦标题输入框（Arco Design Input 使用 dom 属性访问原生输入元素）
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      // 使用 setTimeout 确保 DOM 已渲染
      setTimeout(() => {
        const inputEl = titleInputRef.current?.dom;
        if (inputEl) {
          inputEl.focus();
          inputEl.select();
        }
      }, 0);
    }
  }, [isEditingTitle]);

  // ============================================
  // Mutations
  // ============================================
  const updateTaskMutation = useMutation({
    mutationFn: (updates: {
      status?: TaskStatus;
      dueDate?: string | null;
      categoryId?: string | null;
      title?: string;
      description?: string;
    }) => tasksService.updateTask(id!, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (variables.dueDate === null) {
        Message.success('截止日期已清除');
      } else if (variables.dueDate) {
        Message.success('截止日期已更新');
      } else if (variables.categoryId !== undefined) {
        Message.success('分类已更新');
      } else if (variables.title !== undefined) {
        Message.success('已保存 ✓');
      } else if (variables.description !== undefined) {
        Message.success('已保存 ✓');
        setIsSavingDescription(false);
      }
    },
    onError: () => {
      Message.error('更新失败，请重试');
      setIsSavingDescription(false);
    },
  });

  // 删除任务 mutation
  const deleteTaskMutation = useMutation({
    mutationFn: () => tasksService.deleteTask(id!),
    onSuccess: () => {
      Message.success('已删除');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/tasks');
    },
    onError: (error: Error) => {
      // 提供更具体的错误信息
      const errorMessage = error?.message || '删除失败';
      Message.error(`删除任务失败：${errorMessage}。请稍后重试`);
    },
  });

  // ============================================
  // 标题编辑处理
  // ============================================
  const handleTitleDoubleClick = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleSaveTitle = useCallback(() => {
    const trimmed = titleValue.trim();
    // 如果标题为空，不保存，恢复原值
    if (!trimmed) {
      Message.warning('标题不能为空');
      setTitleValue(task?.title || '');
      setIsEditingTitle(false);
      return;
    }
    // 只有内容变化时才保存
    if (trimmed !== task?.title) {
      updateTaskMutation.mutate({ title: trimmed });
    }
    setIsEditingTitle(false);
  }, [titleValue, task?.title, updateTaskMutation]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveTitle();
      } else if (e.key === 'Escape') {
        setTitleValue(task?.title || '');
        setIsEditingTitle(false);
      }
    },
    [handleSaveTitle, task?.title]
  );

  // ============================================
  // 描述编辑处理（带 Debounce）
  // ============================================
  const handleDescriptionDoubleClick = useCallback(() => {
    setIsEditingDescription(true);
  }, []);

  const handleDescriptionChange = useCallback(
    (value: string) => {
      setDescriptionValue(value);
      setIsSavingDescription(true);

      // 清除之前的定时器
      if (descriptionDebounceRef.current) {
        clearTimeout(descriptionDebounceRef.current);
      }

      // 设置 300ms debounce
      descriptionDebounceRef.current = setTimeout(() => {
        // 只有内容变化时才保存
        if (value !== task?.description) {
          updateTaskMutation.mutate({ description: value });
        } else {
          setIsSavingDescription(false);
        }
      }, 300);
    },
    [task?.description, updateTaskMutation]
  );

  const handleDescriptionBlur = useCallback(() => {
    // 清除 debounce 定时器，立即保存
    if (descriptionDebounceRef.current) {
      clearTimeout(descriptionDebounceRef.current);
    }
    if (descriptionValue !== task?.description) {
      updateTaskMutation.mutate({ description: descriptionValue });
    }
    setIsEditingDescription(false);
  }, [descriptionValue, task?.description, updateTaskMutation]);

  // ============================================
  // 删除处理
  // ============================================
  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: '确定删除这个任务吗？',
      content: '删除后无法恢复',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { status: 'danger' },
      onOk: () => {
        deleteTaskMutation.mutate();
      },
    });
  }, [deleteTaskMutation]);

  // 清理 debounce 定时器
  useEffect(() => {
    return () => {
      if (descriptionDebounceRef.current) {
        clearTimeout(descriptionDebounceRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton animation />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[60vh]">
        <Empty description="找不到该任务" />
        <Button type="primary" className="mt-4" onClick={() => navigate('/tasks')}>
          返回任务列表
        </Button>
      </div>
    );
  }

  const handleDateChange = (dateStr: string | null) => {
    updateTaskMutation.mutate({ dueDate: dateStr || null });
  };

  const isDone = task.status === TaskStatus.done;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item onClick={() => navigate('/tasks')} className="cursor-pointer">
          任务列表
        </Breadcrumb.Item>
        <Breadcrumb.Item>任务详情</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-8">
        <Space size={16}>
          <Button type="text" icon={<IconArrowLeft />} onClick={() => navigate(-1)} />
          {/* 标题：支持双击编辑 */}
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={titleValue}
              onChange={(value) => setTitleValue(value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleTitleKeyDown}
              style={{ width: 300, fontSize: 20, fontWeight: 'bold' }}
              className={isDone ? 'line-through opacity-60' : ''}
            />
          ) : (
            <Title
              heading={3}
              style={{ margin: 0, cursor: 'pointer' }}
              className={isDone ? 'line-through text-slate-500 opacity-60' : ''}
              onDoubleClick={handleTitleDoubleClick}
              title="双击编辑标题"
            >
              {task.title}
            </Title>
          )}
        </Space>

        <Space size={8}>
          <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
          <Button
            type="text"
            status="danger"
            icon={<IconDelete />}
            onClick={handleDelete}
            loading={deleteTaskMutation.isPending}
            aria-label="删除任务"
          >
            删除
          </Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card bordered={false} className="shadow-sm mb-6 bg-slate-800/20 backdrop-blur-md">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Text type="secondary" className="block">
                  任务描述
                </Text>
                {isSavingDescription && <Text className="text-xs text-blue-400">正在保存...</Text>}
              </div>
              {/* 描述：支持双击编辑 */}
              {isEditingDescription ? (
                <Input.TextArea
                  value={descriptionValue}
                  onChange={handleDescriptionChange}
                  onBlur={handleDescriptionBlur}
                  autoFocus
                  autoSize={{ minRows: 3, maxRows: 10 }}
                  className={`text-slate-300 ${isDone ? 'opacity-60' : ''}`}
                  placeholder="添加任务描述..."
                />
              ) : (
                <div
                  className={`text-slate-300 cursor-pointer min-h-[60px] p-2 rounded hover:bg-slate-700/30 transition-colors ${isDone ? 'opacity-60' : ''}`}
                  onDoubleClick={handleDescriptionDoubleClick}
                  title="双击编辑描述"
                >
                  {task.description || (
                    <span className="text-slate-500 italic">暂无描述，双击添加</span>
                  )}
                </div>
              )}
            </div>

            {task.idea && (
              <div className="pt-6 border-t border-slate-700">
                <Text type="secondary" className="block mb-2">
                  源自想法
                </Text>
                <Card
                  className="bg-purple-900/10 border-purple-500/20 cursor-pointer hover:bg-purple-900/20"
                  onClick={() => navigate(`/dashboard?ideaId=${task.idea?.id}`)}
                >
                  <Text className="text-purple-300">{task.idea.content}</Text>
                </Card>
              </div>
            )}
          </Card>

          {task.sources && task.sources.length > 0 && (
            <Card bordered={false} className="shadow-sm mb-6 bg-slate-800/20 backdrop-blur-md">
              <SourceList sources={task.sources} />
            </Card>
          )}
        </div>

        <div>
          <Card bordered={false} className="shadow-sm bg-slate-800/20 backdrop-blur-md">
            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Text type="secondary" className="block mb-2">
                  <IconClockCircle className="mr-2" />
                  截止日期
                </Text>
                <div className="flex flex-col gap-2">
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    value={task.dueDate}
                    onChange={handleDateChange}
                    triggerElement={
                      <Button
                        size="small"
                        type="secondary"
                        icon={<IconCalendar />}
                        className={`w-full text-left justify-start ${(() => {
                          const status = getDueDateStatus(task.dueDate);
                          if (status === 'overdue' && !isDone) return 'text-red-500 font-medium';
                          if (status === 'approaching' && !isDone)
                            return 'text-orange-500 font-medium';
                          if (isDone) return 'opacity-50 text-slate-500';
                          return '';
                        })()}`}
                      >
                        {task.dueDate
                          ? dayjs(task.dueDate).format('YYYY-MM-DD HH:mm')
                          : '设置截止日期'}
                      </Button>
                    }
                  />
                  {task.dueDate && (
                    <div className="flex items-center gap-2">
                      <TaskDueDateBadge dueDate={task.dueDate} status={task.status} />
                      <Button
                        size="mini"
                        type="text"
                        status="danger"
                        onClick={() => handleDateChange(null)}
                        className="text-xs"
                      >
                        清除
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div>
                  <div className={isDone ? 'opacity-60' : ''}>
                    <CategorySelect
                      categories={categoriesResponse?.data || []}
                      value={task.categoryId}
                      onChange={(catId) => updateTaskMutation.mutate({ categoryId: catId })}
                      onManageClick={() => setIsManageOpen(true)}
                    />
                  </div>

                  <Modal
                    title={null}
                    visible={isManageOpen}
                    onCancel={() => setIsManageOpen(false)}
                    footer={null}
                    closable={false}
                    className="category-manager-modal"
                    style={{ width: 420, padding: 0 }}
                  >
                    <CategoryManager
                      onClose={() => setIsManageOpen(false)}
                      onUpdate={() => {
                        queryClient.invalidateQueries({ queryKey: ['categories'] });
                        queryClient.invalidateQueries({ queryKey: ['task', id] });
                      }}
                    />
                  </Modal>
                </div>
              </div>

              <div>
                <Text type="secondary" className="block mb-2">
                  创建时间
                </Text>
                <Text className="text-xs text-slate-400">{formatFullTime(task.createdAt)}</Text>
              </div>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
