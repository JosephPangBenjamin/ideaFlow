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

      // Snapshot the previous value
      const previousTask = queryClient.getQueryData(['task', taskId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['task', taskId], (old: any) => ({
        ...old,
        data: { ...old.data, status: newStatus },
      }));

      return { previousTask };
    },
    onError: (_err, _newStatus, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTask) {
        queryClient.setQueryData(['task', taskId], context.previousTask);
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
