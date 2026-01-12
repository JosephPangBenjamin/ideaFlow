import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import {
  taskViewAtom,
  taskStatusAtom,
  taskCategoryAtom,
  taskDateRangeAtom,
  taskFiltersAtom,
  resetFiltersAtom,
} from '../../../stores/tasks';
import { tasksService } from '../services/tasks.service';

export function useTaskFilters() {
  const [view, setView] = useAtom(taskViewAtom);
  const [status, setStatus] = useAtom(taskStatusAtom);
  const [categoryId, setCategoryId] = useAtom(taskCategoryAtom);
  const [dateRange, setDateRange] = useAtom(taskDateRangeAtom);
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
    filters,

    // Actions
    setView,
    setStatus,
    setCategoryId,
    setDateRange,
    resetFilters,

    // Data
    tasks: tasksResponse?.data || [],
    meta: tasksResponse?.meta,
    isLoading: isLoading || isRefetching,
    refetch,
  };
}
