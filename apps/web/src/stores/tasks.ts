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

// Derived combined filters atom
export const taskFiltersAtom = atom((get) => ({
  view: get(taskViewAtom),
  status: get(taskStatusAtom) || undefined,
  categoryId: get(taskCategoryAtom) || undefined,
  ...get(taskDateRangeAtom),
}));

// Actions
export const resetFiltersAtom = atom(null, (get, set) => {
  set(taskViewAtom, TaskView.today);
  set(taskStatusAtom, null);
  set(taskCategoryAtom, null);
  set(taskDateRangeAtom, {});
});
