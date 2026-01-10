import React, { useMemo } from 'react';
import { Tag, Tooltip } from '@arco-design/web-react';
import { IconClockCircle, IconExclamationCircle, IconHistory } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { formatFullTime } from '../../../utils/date';
import { DueDateStatus, getDueDateStatus } from '../utils/task-utils';
import { TaskStatus } from '../services/tasks.service';

interface TaskDueDateBadgeProps {
  dueDate: string | null | undefined;
  status?: TaskStatus;
  showIcon?: boolean;
}

export const TaskDueDateBadge: React.FC<TaskDueDateBadgeProps> = React.memo(
  ({ dueDate, status, showIcon = true }) => {
    const [now, setNow] = React.useState(() => dayjs());

    React.useEffect(() => {
      const timer = setInterval(() => {
        setNow(dayjs());
      }, 60000); // 每分钟更新一次
      return () => clearInterval(timer);
    }, []);

    const dueDateStatus = useMemo(() => getDueDateStatus(dueDate, now), [dueDate, now]);

    if (dueDateStatus === 'none') return null;

    const isDone = status === TaskStatus.done;

    const config = {
      normal: {
        color: isDone ? 'gray' : 'gray',
        icon: <IconClockCircle />,
        className: isDone ? 'text-slate-500 opacity-50' : 'text-slate-400',
      },
      approaching: {
        color: isDone ? 'gray' : 'orange',
        icon: <IconExclamationCircle />,
        className: isDone ? 'text-slate-500 opacity-50' : 'text-orange-500 font-medium',
      },
      overdue: {
        color: isDone ? 'gray' : 'red',
        icon: <IconHistory />,
        className: isDone ? 'text-slate-500 opacity-50' : 'text-red-500 font-bold',
      },
    }[dueDateStatus as Exclude<DueDateStatus, 'none'>];

    const displayDate = useMemo(() => {
      const due = dayjs(dueDate);
      const isThisYear = due.isSame(now, 'year');
      return isThisYear ? due.format('MM-DD HH:mm') : due.format('YYYY-MM-DD');
    }, [dueDate, now]);

    return (
      <Tooltip content={formatFullTime(dueDate!)}>
        <Tag
          size="small"
          bordered
          color={config.color}
          icon={showIcon ? config.icon : null}
          className={`bg-transparent ${config.className}`}
        >
          {displayDate}
        </Tag>
      </Tooltip>
    );
  }
);
