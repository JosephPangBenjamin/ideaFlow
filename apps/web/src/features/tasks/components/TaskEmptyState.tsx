import React from 'react';
import { Empty, Button } from '@arco-design/web-react';
import { IconRefresh } from '@arco-design/web-react/icon';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { motion } from 'framer-motion';

export function TaskEmptyState() {
  const { filters, resetFilters, view } = useTaskFilters();

  const hasFilters = filters.status !== undefined || filters.categoryId !== undefined;

  const viewLabels = {
    today: '今天没有待办任务',
    upcoming: '没有即将到期的任务',
    personal: '收集箱是空的',
    project: '没有已整理的任务',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-12 flex flex-col items-center justify-center min-h-[400px] glass-dark rounded-3xl border border-slate-700/30"
    >
      <Empty
        description={
          <div className="text-center">
            <p className="text-slate-300 text-lg font-medium mb-1">
              {hasFilters ? '没有找到符合条件的任务' : viewLabels[view] || '暂无任务'}
            </p>
            <p className="text-slate-500 text-sm">
              {hasFilters ? '尝试调整筛选条件或重置' : '开始记录你的新想法吧'}
            </p>
          </div>
        }
      />
      {hasFilters && (
        <Button
          type="primary"
          icon={<IconRefresh />}
          onClick={resetFilters}
          className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 border-none rounded-xl px-8 h-10 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all font-medium"
        >
          重置并显示全部
        </Button>
      )}
    </motion.div>
  );
}
