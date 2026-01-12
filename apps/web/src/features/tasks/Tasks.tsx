import { Skeleton } from '@arco-design/web-react';
import { useTaskFilters } from './hooks/useTaskFilters';
import { TaskTabs } from './components/TaskTabs';
import { TaskFilterPanel } from './components/TaskFilterPanel';
import { TaskCard } from './components/TaskCard';
import { TaskEmptyState } from './components/TaskEmptyState';

export function Tasks() {
  const { tasks, isLoading } = useTaskFilters();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">任务管理</h2>
          <p className="text-slate-400 text-sm">管理你的灵感转化而来的每一个任务</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <TaskFilterPanel />
        </div>
      </div>

      <div className="mb-8 overflow-x-auto pb-2">
        <TaskTabs />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border border-slate-700/50 rounded-2xl glass-dark h-48">
              <Skeleton animation />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <TaskEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
