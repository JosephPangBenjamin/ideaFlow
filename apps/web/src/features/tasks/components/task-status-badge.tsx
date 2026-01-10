import React from 'react';
import { Tag } from '@arco-design/web-react';
import { IconCheckCircle, IconClockCircle, IconSync } from '@arco-design/web-react/icon';
import { TaskStatus } from '../services/tasks.service';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
  onClick?: () => void;
}

export const STATUS_CONFIG = {
  [TaskStatus.todo]: {
    color: 'gray',
    icon: <IconClockCircle />,
    label: '待办',
    bgSubtle: 'bg-gray-500/20',
    textSubtle: 'text-gray-400',
  },
  [TaskStatus.in_progress]: {
    color: 'arcoblue',
    icon: <IconSync />,
    label: '进行中',
    bgSubtle: 'bg-blue-500/20',
    textSubtle: 'text-blue-400',
  },
  [TaskStatus.done]: {
    color: 'green',
    icon: <IconCheckCircle />,
    label: '已完成',
    bgSubtle: 'bg-green-500/20',
    textSubtle: 'text-green-400',
  },
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, className, onClick }) => {
  const { color, icon, label } = STATUS_CONFIG[status] || STATUS_CONFIG[TaskStatus.todo];

  return (
    <Tag
      color={color}
      icon={icon}
      className={`cursor-pointer transition-all hover:opacity-80 ${className || ''}`}
      onClick={onClick}
      bordered
    >
      {label}
    </Tag>
  );
};
