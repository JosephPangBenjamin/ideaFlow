import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../services/categoriesService';
import { CategoryBadge } from './CategoryBadge';
import { IconDown, IconSettings } from '@arco-design/web-react/icon';

interface CategorySelectProps {
  categories: Category[];
  value?: string | null;
  onChange: (id: string | null) => void;
  onManageClick?: () => void;
  placeholder?: string;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  onManageClick,
  placeholder = '选择分类',
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <div className="relative inline-block text-left w-full group">
      <button
        type="button"
        role="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full glass-dark border-slate-700/50 rounded-xl shadow-lg pl-3 pr-10 py-2.5 text-left cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
      >
        <span className="block truncate">
          {selectedCategory ? (
            <CategoryBadge category={selectedCategory} />
          ) : (
            <span className="text-slate-400 font-medium">{placeholder}</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500 group-hover:text-blue-400 transition-colors">
          <IconDown
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="origin-top-right absolute z-50 mt-2 w-full glass-dark border-slate-700/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="py-1 max-h-60 overflow-auto" role="menu">
              <button
                onClick={() => {
                  onManageClick?.();
                  setIsOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-blue-400 font-semibold hover:bg-white/5 transition-colors"
              >
                <IconSettings className="mr-2" />
                管理分类...
              </button>
              <div className="border-t border-slate-700/50 my-1"></div>
              <button
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors"
              >
                <div className="w-3 h-3 rounded-full border border-slate-600 mr-2"></div>
                未分类
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onChange(cat.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <CategoryBadge category={cat} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
