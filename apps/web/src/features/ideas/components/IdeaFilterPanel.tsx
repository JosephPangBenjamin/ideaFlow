import React from 'react';
import { Popover, Button, Divider, DatePicker } from '@arco-design/web-react';
import { IconFilter, IconDelete } from '@arco-design/web-react/icon';
import { useIdeaFilters } from '../hooks/useIdeaFilters';
import { SortSelect } from '../../../components/SortSelect';

export function IdeaFilterPanel() {
  const { dateRange, setDateRange, sort, setSort, resetFilters, activeFilterCount } =
    useIdeaFilters();

  const hasFilters = activeFilterCount > 0;

  const content = (
    <div className="w-72 p-4 glass-dark rounded-2xl border border-slate-700/50 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-white">筛选与排序</span>
        {hasFilters && (
          <Button
            type="text"
            size="mini"
            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            onClick={resetFilters}
          >
            <IconDelete /> 重置
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Sort Options */}
        <SortSelect
          sortBy={sort.sortBy}
          sortOrder={sort.sortOrder}
          options={[
            { value: 'createdAt', label: '创建时间' },
            { value: 'updatedAt', label: '更新时间' },
          ]}
          onSortByChange={(val) => setSort({ ...sort, sortBy: val })}
          onSortOrderChange={(val) => setSort({ ...sort, sortOrder: val })}
        />

        <Divider className="border-slate-800/50 my-0" />

        {/* Time Filter */}
        <div>
          <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider font-bold">
            时间范围 (创建时间)
          </label>
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            className="glass-dark border border-slate-700/50 rounded-xl"
            value={
              dateRange.startDate && dateRange.endDate
                ? [dateRange.startDate, dateRange.endDate]
                : []
            }
            onChange={(dateString, _) => {
              setDateRange({
                startDate: dateString[0] || null,
                endDate: dateString[1] || null,
              });
            }}
            triggerElement={
              <div className="w-full glass-dark border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-300 cursor-pointer flex justify-between items-center hover:border-purple-500/50 transition-all font-medium">
                <span className={dateRange.startDate ? 'text-slate-200' : 'text-slate-500'}>
                  {dateRange.startDate
                    ? `${dateRange.startDate} ~ ${dateRange.endDate}`
                    : '选择日期范围'}
                </span>
                <IconFilter className="text-slate-500 text-xs" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      position="br"
      className="filter-popover"
      triggerProps={{ className: 'inline-block' }}
    >
      <Button
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300
          ${
            hasFilters
              ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
              : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }
        `}
      >
        <IconFilter className={hasFilters ? 'text-purple-400' : ''} />
        <span>筛选 / 排序</span>
        {hasFilters && (
          <span className="ml-1 px-1.5 py-0.5 bg-purple-500 text-white text-[10px] rounded-full leading-none font-bold">
            {activeFilterCount}
          </span>
        )}
      </Button>
    </Popover>
  );
}
