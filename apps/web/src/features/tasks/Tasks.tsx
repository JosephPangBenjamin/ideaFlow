import React from 'react';
import { Card, Tag, Space, Empty, Skeleton } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { tasksService } from './services/tasks.service';
import { TaskDueDateBadge } from './components/task-due-date-badge';
import { TaskStatusSelect } from './components/task-status-select';
import { STATUS_CONFIG } from './components/task-status-badge';
import { IconLink, IconImage, IconFile, IconFilter } from '@arco-design/web-react/icon';
import { CategoryBadge } from './components/CategoryBadge';
import { categoriesService, Category } from './services/categoriesService';
import { CategorySelect } from './components/CategorySelect';
import { CategoryManager } from './components/CategoryManager';
import { Modal } from '@arco-design/web-react';

export function Tasks() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);
  const [isManageOpen, setIsManageOpen] = React.useState(false);

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const {
    data: tasksResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['tasks', selectedCategoryId],
    queryFn: () => tasksService.getTasks({ categoryId: selectedCategoryId || undefined }),
  });

  const categories = categoriesResponse?.data || [];

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">任务列表</h2>
        <div className="flex items-center gap-4 w-64">
          <IconFilter className="text-slate-400" />
          <CategorySelect
            categories={categories}
            value={selectedCategoryId}
            onChange={setSelectedCategoryId}
            onManageClick={() => setIsManageOpen(true)}
          />
        </div>
      </div>

      <Modal
        title={null}
        visible={isManageOpen}
        onCancel={() => setIsManageOpen(false)}
        footer={null}
        className="category-manager-modal"
        style={{ width: 400, padding: 0 }}
      >
        <CategoryManager
          onClose={() => setIsManageOpen(false)}
          onUpdate={() => {
            // Refetch categories and tasks if needed
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            refetch();
          }}
        />
      </Modal>

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
                      <CategoryBadge category={task.category as any} />
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
        ))}
      </div>
    </div>
  );
}
