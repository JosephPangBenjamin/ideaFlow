import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import {
  taskViewAtom,
  taskStatusAtom,
  taskCategoryAtom,
  taskDateRangeAtom,
  taskSortAtom,
  taskFiltersAtom,
  resetFiltersAtom,
  taskAssigneeIdAtom,
  taskCreatedByAtom,
} from '../../../stores/tasks';
import { tasksService } from '../services/tasks.service';
import { useAuth } from '@/hooks/useAuth';

export function useTaskFilters() {
  const [user] = useAuth();
  const [view, setView] = useAtom(taskViewAtom);
  const [status, setStatus] = useAtom(taskStatusAtom);
  const [categoryId, setCategoryId] = useAtom(taskCategoryAtom);
  const [dateRange, setDateRange] = useAtom(taskDateRangeAtom);
  const [taskSort, setTaskSort] = useAtom(taskSortAtom);
  const [filters] = useAtom(taskFiltersAtom);
  const [, resetFilters] = useAtom(resetFiltersAtom);
  // Story 8.3: 分配筛选
  const [assigneeId, setAssigneeId] = useAtom(taskAssigneeIdAtom);
  const [createdBy, setCreatedBy] = useAtom(taskCreatedByAtom);

  const {
    data: tasksResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksService.getTasks(filters),
  });

  // Story 8.3: 前端筛选 - "我分配的" 需要排除分配给自己的任务
  let tasks = tasksResponse?.data || [];
  if (filters._excludeAssigneeMe && user?.id) {
    tasks = tasks.filter((task) => task.assigneeId !== user.id);
  }

  return {
    // States
    view,
    status,
    categoryId,
    dateRange,
    sort: taskSort,
    filters,
    // Story 8.3: 分配筛选
    assigneeId,
    createdBy,

    // Actions
    setView,
    setStatus,
    setCategoryId,
    setDateRange,
    setSort: setTaskSort,
    resetFilters,
    // Story 8.3: 分配筛选 actions
    setAssigneeId,
    setCreatedBy,

    // Data
    tasks,
    meta: tasksResponse?.meta,
    isLoading: isLoading || isRefetching,
    refetch,
  };
}
