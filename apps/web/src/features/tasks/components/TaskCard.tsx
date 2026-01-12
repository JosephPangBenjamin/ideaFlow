import React from 'react';
import { Card, Space } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Task } from '../services/tasks.service';
import { TaskDueDateBadge } from './task-due-date-badge';
import { TaskStatusSelect } from './task-status-select';
import { STATUS_CONFIG } from './task-status-badge';
import { IconLink, IconImage, IconFile } from '@arco-design/web-react/icon';
import { CategoryBadge } from './CategoryBadge';

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="cursor-pointer"
    >
      <Card
        className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 h-full"
        bordered={false}
        onClick={() => navigate(`/tasks/${task.id}`)}
      >
        <div className="flex items-start gap-4 h-full">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${STATUS_CONFIG[task.status].bgSubtle}`}
          >
            {React.cloneElement(STATUS_CONFIG[task.status].icon as React.ReactElement, {
              className: `${STATUS_CONFIG[task.status].textSubtle} text-xl`,
            })}
          </div>
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <div className="flex justify-between items-start mb-1 gap-2">
              <h3 className="text-lg font-semibold text-white truncate">{task.title}</h3>
              <div onClick={(e) => e.stopPropagation()}>
                <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {task.description || '暂无描述'}
            </p>

            <div className="flex items-center justify-between mt-auto pt-2">
              <Space size={8}>
                <CategoryBadge category={task.category} />
                {task.idea?.sources && task.idea.sources.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {task.idea.sources[0]?.type === 'link' ? (
                      <IconLink />
                    ) : task.idea.sources[0]?.type === 'image' ? (
                      <IconImage />
                    ) : (
                      <IconFile />
                    )}
                    <span>
                      {task.idea.sources.length > 1
                        ? `${task.idea.sources.length}个来源`
                        : task.idea.sources[0]?.type === 'link'
                          ? '链接'
                          : task.idea.sources[0]?.type === 'image'
                            ? '图片'
                            : '来源'}
                    </span>
                  </div>
                )}
              </Space>
              <TaskDueDateBadge dueDate={task.dueDate} status={task.status} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
