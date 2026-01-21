import { atom, useAtom } from 'jotai';
import { useMemo } from 'react';

// Atom definitions
export const ideaDateRangeAtom = atom<{ startDate: string | null; endDate: string | null }>({
  startDate: null,
  endDate: null,
});

export const ideaSortAtom = atom<{ sortBy: string; sortOrder: 'asc' | 'desc' }>({
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

// 沉底筛选 atom
export const ideaIsStaleAtom = atom<boolean | null>(null);

// Derived atom to combine all filters
export const ideaFiltersAtom = atom((get) => {
  const dateRange = get(ideaDateRangeAtom);
  const sort = get(ideaSortAtom);
  const isStale = get(ideaIsStaleAtom);

  return {
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    isStale: isStale ?? undefined, // 沉底筛选
  };
});

// Resetter atom
export const resetIdeaFiltersAtom = atom(null, (_get, set) => {
  set(ideaDateRangeAtom, { startDate: null, endDate: null });
  set(ideaSortAtom, { sortBy: 'createdAt', sortOrder: 'desc' });
  set(ideaIsStaleAtom, null); // 重置沉底筛选
});

export function useIdeaFilters() {
  const [dateRange, setDateRange] = useAtom(ideaDateRangeAtom);
  const [sort, setSort] = useAtom(ideaSortAtom);
  const [isStale, setIsStale] = useAtom(ideaIsStaleAtom);
  const [filters] = useAtom(ideaFiltersAtom);
  const [, resetFilters] = useAtom(resetIdeaFiltersAtom);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateRange.startDate) count++;
    if (isStale !== null) count++; // 沉底筛选计数
    return count;
  }, [dateRange, isStale]);

  return {
    // State
    dateRange,
    sort,
    isStale,
    filters,
    activeFilterCount,

    // Actions
    setDateRange,
    setSort,
    setIsStale,
    resetFilters,
  };
}
