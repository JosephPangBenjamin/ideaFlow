import React from 'react';
import { Popover, Button, Divider, Select, Tag, DatePicker } from '@arco-design/web-react';
import { IconFilter, IconDelete } from '@arco-design/web-react/icon';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { STATUS_CONFIG } from './task-status-badge';
import { TaskStatus } from '../services/tasks.service';
import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../services/categoriesService';
import { CategoryBadge } from './CategoryBadge';

export function TaskFilterPanel() {
  const { status, setStatus, categoryId, setCategoryId, dateRange, setDateRange, resetFilters } =
    useTaskFilters();

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];

  const hasFilters = status !== null || categoryId !== null;

  const content = (
    <div className="w-72 p-4 glass-dark rounded-2xl border border-slate-700/50 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-white">筛选器</span>
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
        {/* Status Filter */}
        <div>
          <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider font-bold">
            状态
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TaskStatus).map((s) => {
              const config = STATUS_CONFIG[s];
              const isActive = status === s;
              return (
                <Tag
                  key={s}
                  className={`
                    px-3 py-1.5 rounded-lg border transition-all cursor-pointer capitalize select-none
                    ${
                      isActive
                        ? 'bg-purple-600 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                    }
                  `}
                  onClick={() => setStatus(isActive ? null : s)}
                >
                  <span className="flex items-center gap-2">
                    {React.cloneElement(config.icon as React.ReactElement, {
                      className: 'text-sm',
                    })}
                    {config.label}
                  </span>
                </Tag>
              );
            })}
          </div>
        </div>

        <Divider className="border-slate-800/50 my-0" />

        {/* Category Filter */}
        <div>
          <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider font-bold">
            分类
          </label>
          <Select
            placeholder="全部分类"
            value={categoryId || undefined}
            onChange={setCategoryId}
            allowClear
            className="w-full filter-select"
            dropdownMenuClassName="glass-dark border border-slate-700/50 shadow-2xl rounded-xl"
            triggerElement={
              <div className="w-full glass-dark border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-300 cursor-pointer flex justify-between items-center hover:border-purple-500/50 transition-all font-medium">
                {categoryId ? (
                  <CategoryBadge category={categories.find((c) => c.id === categoryId) as any} />
                ) : (
                  <span className="text-slate-500">所有分类</span>
                )}
                <IconFilter className="text-slate-500 text-xs" />
              </div>
            }
          >
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                <CategoryBadge category={cat} />
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <Divider className="border-slate-800/50 my-0" />

      {/* Time Filter */}
      <div>
        <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider font-bold">
          时间范围 (截止日期)
        </label>
        <DatePicker.RangePicker
          style={{ width: '100%' }}
          className="glass-dark border border-slate-700/50 rounded-xl"
          value={
            dateRange.startDate && dateRange.endDate ? [dateRange.startDate, dateRange.endDate] : []
          }
          onChange={(dateString, _) => {
            setDateRange({
              startDate: dateString[0],
              endDate: dateString[1],
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
        <span>筛选</span>
        {hasFilters && (
          <span className="ml-1 px-1.5 py-0.5 bg-purple-500 text-white text-[10px] rounded-full leading-none font-bold">
            !
          </span>
        )}
      </Button>
    </Popover>
  );
}
