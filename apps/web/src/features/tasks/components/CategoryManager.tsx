import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconClose, IconPlus, IconDelete } from '@arco-design/web-react/icon';
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
    <div className="p-6 glass-dark rounded-2xl border-0 shadow-2xl relative overflow-hidden w-full h-[520px] flex flex-col">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="flex justify-between items-center mb-6 relative shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">管理分类</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <IconClose className="text-lg" />
        </button>
      </div>

      <div className="mb-8 relative">
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="新分类名称"
              className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 group-hover:border-slate-600"
            />
          </div>
          <div className="relative shrink-0 flex items-center justify-center w-11 h-11 bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group hover:border-slate-600 transition-all">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="absolute inset-0 w-full h-full p-0 cursor-pointer opacity-0"
            />
            <div
              className="w-6 h-6 rounded-full shadow-inner border border-white/10"
              style={{ backgroundColor: newColor }}
            ></div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-30 flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <IconPlus />
            <span>添加</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden flex flex-col">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1 shrink-0">
          现有分类
        </h4>
        {isLoading ? (
          <div className="text-center py-8 text-slate-400 flex-1 flex flex-col justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            加载中...
          </div>
        ) : (
          <ul className="space-y-2 overflow-auto pr-1 flex-1 custom-scrollbar">
            <AnimatePresence>
              {categories.map((cat) => (
                <motion.li
                  key={cat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: cat.color || '#94a3b8' }}
                    ></div>
                    <span className="text-sm font-medium text-slate-200">{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <IconDelete />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
            {categories.length === 0 && (
              <li className="py-8 text-center text-slate-500 text-sm italic">暂无分类</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
