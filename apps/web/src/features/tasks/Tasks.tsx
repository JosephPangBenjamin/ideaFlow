import React from 'react';
import { Card, Tag, Space, Empty, Skeleton } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { tasksService } from './services/tasks.service';
import { TaskDueDateBadge } from './components/task-due-date-badge';
import { TaskStatusSelect } from './components/task-status-select';
import { STATUS_CONFIG } from './components/task-status-badge';

export function Tasks() {
  const navigate = useNavigate();
  const { data: tasksResponse, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksService.getTasks(),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton animation />
      </div>
    );
  }

  const tasks = tasksResponse?.data || [];

  if (tasks.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[60vh]">
        <Empty description="暂无任务" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="cursor-pointer"
          >
            <Card
              className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              bordered={false}
              onClick={() => navigate(`/tasks/${task.id}`)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${STATUS_CONFIG[task.status].bgSubtle}`}
                >
                  {React.cloneElement(STATUS_CONFIG[task.status].icon as React.ReactElement, {
                    className: `${STATUS_CONFIG[task.status].textSubtle} text-xl`,
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-lg font-semibold text-white truncate">{task.title}</h3>
                    <div onClick={(e) => e.stopPropagation()}>
                      <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-3 line-clamp-2 min-h-[3rem]">
                    {task.description || '暂无描述'}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <Space size={8}>
                      {task.category && (
                        <Tag size="small" className="bg-slate-700/50 border-slate-600">
                          {task.category}
                        </Tag>
                      )}
                    </Space>
                    <TaskDueDateBadge dueDate={task.dueDate} status={task.status} />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
