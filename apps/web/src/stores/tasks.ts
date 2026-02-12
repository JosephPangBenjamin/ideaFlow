import { atom } from 'jotai';
import { TaskStatus } from '../features/tasks/services/tasks.service';

export enum TaskView {
  today = 'today',
  upcoming = 'upcoming',
  personal = 'personal',
  project = 'project',
  // Story 8.3: 新增分配相关视图
  assignedToMe = 'assigned-to-me', // 分配给我的
  createdByMe = 'created-by-me', // 我创建的
  assignedByMe = 'assigned-by-me', // 我分配的
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

// Story 8.3: 分配筛选 atoms
export const taskAssigneeIdAtom = atom<string | null>(null); // 分配给谁
export const taskCreatedByAtom = atom<string | null>(null); // 谁创建的
// Story 8.3: "我分配的" 需要排除自己的标记（前端筛选用）
export const taskExcludeAssigneeMeAtom = atom<boolean>(false);

// Derived combined filters atom
export const taskFiltersAtom = atom((get) => {
  const sort = get(taskSortAtom);
  const view = get(taskViewAtom);

  // Story 8.3: 根据视图自动设置分配筛选
  let assigneeId: string | undefined = undefined;
  let createdBy: string | undefined = undefined;
  let excludeAssigneeMe = false;

  if (view === TaskView.assignedToMe) {
    assigneeId = 'me';
  } else if (view === TaskView.createdByMe) {
    createdBy = 'me';
  } else if (view === TaskView.assignedByMe) {
    // "我分配的" = 我创建的 AND 分配给别人（不包括自己）
    createdBy = 'me';
    excludeAssigneeMe = true;
  }

  return {
    view,
    status: get(taskStatusAtom) || undefined,
    categoryId: get(taskCategoryAtom) || undefined,
    ...get(taskDateRangeAtom),
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    // Story 8.3: 分配筛选
    assigneeId: assigneeId || get(taskAssigneeIdAtom) || undefined,
    createdBy: createdBy || get(taskCreatedByAtom) || undefined,
    // Story 8.3: 前端排除标记
    _excludeAssigneeMe: excludeAssigneeMe || get(taskExcludeAssigneeMeAtom),
  };
});

// Actions
export const resetFiltersAtom = atom(null, (_get, set) => {
  set(taskViewAtom, TaskView.today);
  set(taskStatusAtom, null);
  set(taskCategoryAtom, null);
  set(taskDateRangeAtom, {});
  set(taskSortAtom, { sortBy: 'createdAt', sortOrder: 'desc' });
  // Story 8.3: 重置分配筛选
  set(taskAssigneeIdAtom, null);
  set(taskCreatedByAtom, null);
  set(taskExcludeAssigneeMeAtom, false);
});
