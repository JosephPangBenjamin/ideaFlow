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

// Derived atom to combine all filters
export const ideaFiltersAtom = atom((get) => {
  const dateRange = get(ideaDateRangeAtom);
  const sort = get(ideaSortAtom);

  return {
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
  };
});

// Resetter atom
export const resetIdeaFiltersAtom = atom(null, (_get, set) => {
  set(ideaDateRangeAtom, { startDate: null, endDate: null });
  set(ideaSortAtom, { sortBy: 'createdAt', sortOrder: 'desc' });
});

export function useIdeaFilters() {
  const [dateRange, setDateRange] = useAtom(ideaDateRangeAtom);
  const [sort, setSort] = useAtom(ideaSortAtom);
  const [filters] = useAtom(ideaFiltersAtom);
  const [, resetFilters] = useAtom(resetIdeaFiltersAtom);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateRange.startDate) count++;
    return count;
    // Sort is always active (default), so doesn't count as "filter" unless we want to highlight non-default
  }, [dateRange]);

  return {
    // State
    dateRange,
    sort,
    filters,
    activeFilterCount,

    // Actions
    setDateRange,
    setSort,
    resetFilters,
  };
}
