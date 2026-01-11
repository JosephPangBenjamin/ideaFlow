import React from 'react';
import { Dropdown, Menu, Message } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import { TaskStatus, tasksService } from '../services/tasks.service';
import { TaskStatusBadge } from './task-status-badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TaskStatusSelectProps {
  taskId: string;
  currentStatus: TaskStatus;
  onSuccess?: (newStatus: TaskStatus) => void;
}

export const TaskStatusSelect: React.FC<TaskStatusSelectProps> = ({
  taskId,
  currentStatus,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: TaskStatus) => tasksService.updateTask(taskId, { status: newStatus }),
    onMutate: async (newStatus) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['task', taskId] });
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous values
      const previousTask = queryClient.getQueryData(['task', taskId]);
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update the single task query
      queryClient.setQueryData(['task', taskId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, status: newStatus },
        };
      });

      // Optimistically update the tasks list query
      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((task: any) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          ),
        };
      });

      return { previousTask, previousTasks };
    },
    onError: (_err, _newStatus, context) => {
      // If the mutation fails, roll back both queries
      if (context?.previousTask) {
        queryClient.setQueryData(['task', taskId], context.previousTask);
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      Message.error('更新失败，请重试');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (onSuccess) {
        onSuccess(data.data.status);
      }
      Message.success('状态已更新');
    },
  });

  const handleStatusChange = (status: TaskStatus) => {
    if (status === currentStatus) return;
    updateStatusMutation.mutate(status);
  };

  const menu = (
    <Menu
      onClickMenuItem={(key) => handleStatusChange(key as TaskStatus)}
      selectedKeys={[currentStatus]}
    >
      <Menu.Item key={TaskStatus.todo}>
        <TaskStatusBadge status={TaskStatus.todo} />
      </Menu.Item>
      <Menu.Item key={TaskStatus.in_progress}>
        <TaskStatusBadge status={TaskStatus.in_progress} />
      </Menu.Item>
      <Menu.Item key={TaskStatus.done}>
        <TaskStatusBadge status={TaskStatus.done} />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown droplist={menu} trigger="click" position="bl">
      <div className="inline-flex items-center gap-1 group cursor-pointer">
        <TaskStatusBadge status={currentStatus} />
        <IconDown className="text-slate-500 group-hover:text-white transition-colors" />
      </div>
    </Dropdown>
  );
};
