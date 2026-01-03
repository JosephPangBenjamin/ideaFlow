import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { quickCaptureOpenAtom } from '../stores/ideas';

export const useQuickCaptureHotkey = () => {
  const setIsOpen = useSetAtom(quickCaptureOpenAtom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+N (Mac) or Ctrl+N (Windows/Linux)
      // Note: Cmd+N usually opens new window in browsers, so we MUST prevent default
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);
};
