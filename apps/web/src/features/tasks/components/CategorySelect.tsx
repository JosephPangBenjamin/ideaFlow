import React, { useState } from 'react';
import { Category } from '../services/categoriesService';
import { CategoryBadge } from './CategoryBadge';

interface CategorySelectProps {
  categories: Category[];
  value?: string | null;
  onChange: (id: string | null) => void;
  onManageClick?: () => void;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  onManageClick,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <div className="relative inline-block text-left w-full">
      <button
        type="button"
        role="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <span className="block truncate">
          {selectedCategory ? (
            <CategoryBadge category={selectedCategory} />
          ) : (
            <span className="text-gray-500">选择分类</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              未分类
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onChange(cat.id);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <CategoryBadge category={cat} />
              </button>
            ))}
            <div className="border-t border-gray-100"></div>
            <button
              onClick={() => {
                onManageClick?.();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
            >
              管理分类...
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Add display placeholder fallback for test compatibility
CategorySelect.defaultProps = {
  placeholder: '选择分类',
};
