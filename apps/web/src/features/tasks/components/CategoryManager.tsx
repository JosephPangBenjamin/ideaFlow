import React, { useState, useEffect } from 'react';
import { categoriesService, Category } from '../services/categoriesService';

interface CategoryManagerProps {
  onUpdate?: () => void;
  onClose?: () => void;
}

export function CategoryManager({ onUpdate, onClose }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3B82F6');

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoriesService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await categoriesService.create({ name: newName, color: newColor });
      setNewName('');
      loadCategories();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to add category', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除此分类吗？关联的任务将变为未分类。')) return;
    try {
      await categoriesService.remove(id);
      loadCategories();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">管理分类</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="新分类名称"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 border-0 p-0 cursor-pointer rounded-md"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            添加
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-gray-500">加载中...</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {categories.map((cat) => (
            <li key={cat.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color || '#94a3b8' }}
                ></span>
                <span className="text-sm text-gray-900">{cat.name}</span>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                删除
              </button>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="py-4 text-center text-gray-500 text-sm">暂无分类</li>
          )}
        </ul>
      )}
    </div>
  );
}
