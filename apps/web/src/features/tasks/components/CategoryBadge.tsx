import React from 'react';

interface Category {
  id: string;
  name: string;
  color?: string | null;
}

interface CategoryBadgeProps {
  category?: Category | null;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
        未分类
      </span>
    );
  }

  return (
    <span
      className="category-badge inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white shadow-sm"
      style={{ backgroundColor: category.color || '#94a3b8' }}
    >
      {category.name}
    </span>
  );
}
