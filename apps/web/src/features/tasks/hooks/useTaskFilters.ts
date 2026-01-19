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
} from '../../../stores/tasks';
import { tasksService } from '../services/tasks.service';

export function useTaskFilters() {
  const [view, setView] = useAtom(taskViewAtom);
  const [status, setStatus] = useAtom(taskStatusAtom);
  const [categoryId, setCategoryId] = useAtom(taskCategoryAtom);
  const [dateRange, setDateRange] = useAtom(taskDateRangeAtom);
  const [taskSort, setTaskSort] = useAtom(taskSortAtom);
  const [filters] = useAtom(taskFiltersAtom);
  const [, resetFilters] = useAtom(resetFiltersAtom);

  const {
    data: tasksResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksService.getTasks(filters),
  });

  return {
    // States
    view,
    status,
    categoryId,
    dateRange,
    sort: taskSort,
    filters,

    // Actions
    setView,
    setStatus,
    setCategoryId,
    setDateRange,
    setSort: setTaskSort,
    resetFilters,

    // Data
    tasks: tasksResponse?.data || [],
    meta: tasksResponse?.meta,
    isLoading: isLoading || isRefetching,
    refetch,
  };
}
