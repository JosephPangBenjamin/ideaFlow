import React from 'react';
import { Select } from '@arco-design/web-react';
import { IconSort } from '@arco-design/web-react/icon';

interface SortSelectProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  options: { value: string; label: string }[];
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

export function SortSelect({
  sortBy,
  sortOrder,
  options,
  onSortByChange,
  onSortOrderChange,
}: SortSelectProps) {
  return (
    <div className="flex gap-2 w-full">
      <div className="flex-1">
        <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider font-bold">
          排序依据
        </label>
        <Select
          value={sortBy}
          onChange={onSortByChange}
          className="w-full filter-select"
          dropdownMenuClassName="glass-dark border border-slate-700/50 shadow-2xl rounded-xl"
          triggerElement={
            <div className="w-full glass-dark border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-300 cursor-pointer flex justify-between items-center hover:border-purple-500/50 transition-all font-medium">
              <span>{options.find((o) => o.value === sortBy)?.label || sortBy}</span>
              <IconSort className="text-slate-500 text-xs" />
            </div>
          }
        >
          {options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="w-24">
        <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider font-bold">
          顺序
        </label>
        <Select
          value={sortOrder}
          onChange={(val) => onSortOrderChange(val as 'asc' | 'desc')}
          className="w-full filter-select"
          dropdownMenuClassName="glass-dark border border-slate-700/50 shadow-2xl rounded-xl"
          triggerElement={
            <div className="w-full glass-dark border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-300 cursor-pointer flex justify-between items-center hover:border-purple-500/50 transition-all font-medium">
              <span>{sortOrder === 'desc' ? '降序' : '升序'}</span>
              <IconSort className="text-slate-500 text-xs" />
            </div>
          }
        >
          <Select.Option value="desc">降序</Select.Option>
          <Select.Option value="asc">升序</Select.Option>
        </Select>
      </div>
    </div>
  );
}
