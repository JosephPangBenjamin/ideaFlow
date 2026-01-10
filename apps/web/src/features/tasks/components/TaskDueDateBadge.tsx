import React, { useMemo } from 'react';
import { Tag, Tooltip } from '@arco-design/web-react';
import { IconClockCircle, IconExclamationCircle, IconHistory } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { formatFullTime } from '../../../utils/date';

export type DueDateStatus = 'none' | 'normal' | 'approaching' | 'overdue';

const APPROACHING_THRESHOLD_DAYS = 3;

interface TaskDueDateBadgeProps {
  dueDate: string | null | undefined;
  showIcon?: boolean;
}

const getDueDateStatus = (dueDate: string | null | undefined): DueDateStatus => {
  if (!dueDate) return 'none';
  const due = dayjs(dueDate);
  const now = dayjs();

  if (due.isBefore(now, 'day')) {
    return 'overdue';
  }

  const diffDays = due.diff(now, 'day');
  if (diffDays <= APPROACHING_THRESHOLD_DAYS) {
    return 'approaching';
  }

  return 'normal';
};

export const TaskDueDateBadge: React.FC<TaskDueDateBadgeProps> = React.memo(
  ({ dueDate, showIcon = true }) => {
    const status = useMemo(() => getDueDateStatus(dueDate), [dueDate]);

    if (status === 'none') return null;

    const config = {
      normal: {
        color: 'gray',
        icon: <IconClockCircle />,
        text: '截止',
        className: 'text-slate-400',
      },
      approaching: {
        color: 'orange',
        icon: <IconExclamationCircle />,
        text: '即将截止',
        className: 'text-orange-500 font-medium',
      },
      overdue: {
        color: 'red',
        icon: <IconHistory />,
        text: '已逾期',
        className: 'text-red-500 font-bold',
      },
    }[status as Exclude<DueDateStatus, 'none'>];

    return (
      <Tooltip content={formatFullTime(dueDate!)}>
        <Tag
          size="small"
          bordered
          color={config.color}
          icon={showIcon ? config.icon : null}
          className={`bg-transparent ${config.className}`}
        >
          {dayjs(dueDate).format('MM-DD')}
        </Tag>
      </Tooltip>
    );
  }
);
