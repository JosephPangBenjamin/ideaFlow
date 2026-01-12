import React from 'react';
import { motion } from 'framer-motion';
import { TaskView } from '../../../stores/tasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { IconCalendar, IconApps, IconUser, IconThunderbolt } from '@arco-design/web-react/icon';

const tabs = [
  { key: TaskView.today, label: '今天', icon: <IconThunderbolt /> },
  { key: TaskView.upcoming, label: '即将到期', icon: <IconCalendar /> },
  { key: TaskView.personal, label: '收集箱', icon: <IconUser /> },
  { key: TaskView.project, label: '已整理', icon: <IconApps /> },
];

export function TaskTabs() {
  const { view, setView } = useTaskFilters();

  return (
    <div className="flex p-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-700/30 w-fit">
      {tabs.map((tab) => {
        const isActive = view === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`
              relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
              ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-xl shadow-lg shadow-purple-500/20"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {React.cloneElement(tab.icon as React.ReactElement, { className: 'text-lg' })}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
