import { atom } from 'jotai';
import { TaskStatus } from '../features/tasks/services/tasks.service';

export enum TaskView {
  today = 'today',
  upcoming = 'upcoming',
  personal = 'personal',
  project = 'project',
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

// Atomic filters
export const taskViewAtom = atom<TaskView>(TaskView.today);
export const taskStatusAtom = atom<TaskStatus | null>(null);
export const taskCategoryAtom = atom<string | null>(null);
export const taskDateRangeAtom = atom<DateRange>({});
export const taskSortAtom = atom<{ sortBy: string; sortOrder: 'asc' | 'desc' }>({
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

// Derived combined filters atom
export const taskFiltersAtom = atom((get) => {
  const sort = get(taskSortAtom);
  return {
    view: get(taskViewAtom),
    status: get(taskStatusAtom) || undefined,
    categoryId: get(taskCategoryAtom) || undefined,
    ...get(taskDateRangeAtom),
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
  };
});

// Actions
export const resetFiltersAtom = atom(null, (_get, set) => {
  set(taskViewAtom, TaskView.today);
  set(taskStatusAtom, null);
  set(taskCategoryAtom, null);
  set(taskDateRangeAtom, {});
  set(taskSortAtom, { sortBy: 'createdAt', sortOrder: 'desc' });
});
