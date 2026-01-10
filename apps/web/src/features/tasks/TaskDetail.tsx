import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Tag,
  Typography,
  Space,
  Skeleton,
  Empty,
  Breadcrumb,
  DatePicker,
  Message,
} from '@arco-design/web-react';
import { IconArrowLeft, IconClockCircle, IconTag, IconCalendar } from '@arco-design/web-react/icon';
import { tasksService, TaskStatus } from './services/tasks.service';
import { formatFullTime } from '../../utils/date';
import { TaskDueDateBadge } from './components/task-due-date-badge';
import { TaskStatusSelect } from './components/task-status-select';
import dayjs from 'dayjs';
import { getDueDateStatus } from './utils/task-utils';

const { Title, Paragraph, Text } = Typography;

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: taskResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksService.getTask(id!),
    enabled: !!id,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updates: { status?: TaskStatus; dueDate?: string | null }) =>
      tasksService.updateTask(id!, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      if (variables.dueDate === null) {
        Message.success('截止日期已清除');
      } else if (variables.dueDate) {
        Message.success('截止日期已更新');
      }
    },
    onError: () => {
      Message.error('更新失败，请重试');
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton animation />
      </div>
    );
  }

  const task = taskResponse?.data;

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
          <Title
            heading={3}
            style={{ margin: 0 }}
            className={isDone ? 'line-through text-slate-500 opacity-60' : ''}
          >
            {task.title}
          </Title>
        </Space>

        <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card bordered={false} className="shadow-sm mb-6 bg-slate-800/20 backdrop-blur-md">
            <div className="mb-6">
              <Text type="secondary" className="block mb-2">
                任务描述
              </Text>
              <Paragraph className={`text-slate-300 ${isDone ? 'opacity-60' : ''}`}>
                {task.description || '暂无描述'}
              </Paragraph>
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
                <Text type="secondary" className="block mb-2">
                  <IconTag className="mr-2" />
                  分类
                </Text>
                <Tag className={isDone ? 'opacity-60' : ''}>{task.category || '未分类'}</Tag>
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
