import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { globalSearchOpenAtom } from '@/store/ui';

/**
 * 全局搜索快捷键 Hook
 * 监听 ⌘+K (Mac) / Ctrl+K (Windows) 打开搜索面板
 */
export function useGlobalSearchHotkey() {
  const setSearchOpen = useSetAtom(globalSearchOpenAtom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘+K (Mac) 或 Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);
}
