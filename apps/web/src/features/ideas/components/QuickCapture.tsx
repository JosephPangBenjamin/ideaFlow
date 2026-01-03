import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@arco-design/web-react';
import { quickCaptureOpenAtom, ideasAtom } from '../stores/ideas';
import { ideasService } from '../services/ideas.service';
import { useAnalytics } from '@/hooks/useAnalytics';
import { IconSend, IconClose, IconPlus } from '@arco-design/web-react/icon';
import { SourceInput } from './SourceInput';
import { IdeaSource } from '../types';

export const QuickCapture = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useAtom(quickCaptureOpenAtom);
  const { track } = useAnalytics();
  const setIdeas = useSetAtom(ideasAtom);
  const [content, setContent] = useState('');
  const [source, setSource] = useState<IdeaSource | undefined>();
  const [showSource, setShowSource] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setContent('');
      setSource(undefined);
      setShowSource(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const newIdea = await ideasService.createIdea({
        content,
        source,
      });

      track('idea_created');

      Message.success({
        content: '已保存 ✓',
        duration: 1500,
      });

      setIdeas((prev) => [newIdea, ...prev]);

      // Invalidate query to refresh list
      queryClient.invalidateQueries({ queryKey: ['ideas'] });

      setIsOpen(false);
      setContent('');
      setSource(undefined);
      setShowSource(false);
    } catch (error) {
      Message.error('保存失败，请重试');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-colors"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-1">
              <textarea
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="记录一个想法..."
                className="w-full h-32 p-4 bg-transparent text-lg text-slate-100 placeholder:text-slate-500 border-none focus:ring-0 resize-none outline-none"
                disabled={isSubmitting}
              />

              <AnimatePresence>
                {showSource && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-4 mb-2"
                  >
                    <SourceInput value={source} onChange={setSource} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-slate-900/50 border-t border-slate-700/50">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 mr-2 hidden sm:inline">
                  按 Enter 保存, Esc 关闭
                </span>
                <button
                  onClick={() => setShowSource(!showSource)}
                  className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
                    showSource || source
                      ? 'bg-slate-700 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <IconPlus />
                  <span>{source ? '已添加来源' : '添加来源'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <IconClose />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isSubmitting ? (
                    '保存中...'
                  ) : (
                    <>
                      <IconSend />
                      <span>保存</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
