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
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/50 text-slate-500 border border-slate-700/50">
        未分类
      </span>
    );
  }

  return (
    <span
      className="category-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm border border-white/10 tracking-wide uppercase"
      style={{ backgroundColor: category.color || '#94a3b8' }}
    >
      {category.name}
    </span>
  );
}
