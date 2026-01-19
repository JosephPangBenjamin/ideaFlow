import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSearch, IconBulb, IconCheckCircle, IconClose } from '@arco-design/web-react/icon';
import { Spin } from '@arco-design/web-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { globalSearchOpenAtom } from '@/store/ui';
import { searchService, SearchIdea, SearchTask } from '@/services/search.service';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;

/**
 * 搜索结果项联合类型
 */
type SearchResultItem = { type: 'idea'; data: SearchIdea } | { type: 'task'; data: SearchTask };

/**
 * 高亮搜索关键词
 */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query || query.length < MIN_SEARCH_LENGTH) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-blue-500/30 text-blue-300 rounded px-0.5">
        {part}
      </span>
    ) : (
      part
    )
  );
}

/**
 * 格式化时间 - 使用 dayjs
 */
function formatTime(dateString: string): string {
  const date = dayjs(dateString);
  const now = dayjs();

  if (date.isSame(now, 'day')) {
    return '今天';
  }

  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return '昨天';
  }

  if (dayjs().diff(date, 'day') < 7) {
    return date.fromNow();
  }

  return date.format('YYYY-MM-DD');
}

/**
 * 全局搜索面板组件
 * 支持 ⌘+K 快捷键打开，搜索想法和任务
 */
export function GlobalSearch() {
  const [isOpen, setIsOpen] = useAtom(globalSearchOpenAtom);
  const [query, setQuery] = useState('');
  const [ideas, setIdeas] = useState<SearchIdea[]>([]);
  const [tasks, setTasks] = useState<SearchTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  // 合并搜索结果为统一列表（用于键盘导航），使用 useMemo 优化
  const allResults: SearchResultItem[] = useMemo(
    () => [
      ...ideas.map((idea) => ({ type: 'idea' as const, data: idea })),
      ...tasks.map((task) => ({ type: 'task' as const, data: task })),
    ],
    [ideas, tasks]
  );

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setIdeas([]);
      setTasks([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // 防抖搜索
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < MIN_SEARCH_LENGTH) {
      setIdeas([]);
      setTasks([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await searchService.search(query);
        setIdeas(result.ideas);
        setTasks(result.tasks);
        setSelectedIndex(0);
      } catch (error) {
        console.error('搜索失败:', error);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // 处理结果点击/选择
  const handleSelect = useCallback(
    (item: SearchResultItem) => {
      setIsOpen(false);
      if (item.type === 'idea') {
        navigate(`/ideas?id=${item.data.id}`);
      } else {
        navigate(`/tasks?id=${item.data.id}`);
      }
    },
    [navigate, setIsOpen]
  );

  // 键盘导航处理
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allResults.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (allResults[selectedIndex]) {
            handleSelect(allResults[selectedIndex]);
          }
          break;
      }
    },
    [allResults, selectedIndex, handleSelect, setIsOpen]
  );

  // 无结果状态
  const showEmptyState = query.length >= MIN_SEARCH_LENGTH && !isLoading && allResults.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* 搜索面板 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div
              className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
              onKeyDown={handleKeyDown}
            >
              {/* 搜索输入框 */}
              <div className="flex items-center px-5 py-4 border-b border-white/10">
                <IconSearch className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索想法和任务..."
                  className="flex-1 bg-transparent text-lg text-white placeholder-slate-500 outline-none"
                />
                {isLoading && <Spin size={16} className="mr-2" />}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>

              {/* 搜索结果 */}
              <div className="max-h-[400px] overflow-y-auto">
                {/* 想法结果 */}
                {ideas.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      想法
                    </div>
                    {ideas.map((idea, i) => {
                      const globalIndex = i;
                      return (
                        <button
                          key={idea.id}
                          onClick={() => handleSelect({ type: 'idea', data: idea })}
                          className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            selectedIndex === globalIndex
                              ? 'bg-blue-500/20 text-white'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <IconBulb className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">
                              {highlightText(idea.content.slice(0, 100), query)}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {formatTime(idea.createdAt)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 任务结果 */}
                {tasks.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      任务
                    </div>
                    {tasks.map((task, i) => {
                      const globalIndex = ideas.length + i;
                      return (
                        <button
                          key={task.id}
                          onClick={() => handleSelect({ type: 'task', data: task })}
                          className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            selectedIndex === globalIndex
                              ? 'bg-blue-500/20 text-white'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <IconCheckCircle
                            className={`w-5 h-5 mt-0.5 shrink-0 ${
                              task.status === 'done' ? 'text-green-400' : 'text-blue-400'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{highlightText(task.title, query)}</div>
                            {task.description && (
                              <div className="text-xs text-slate-500 truncate mt-0.5">
                                {highlightText(task.description.slice(0, 50), query)}
                              </div>
                            )}
                            <div className="text-xs text-slate-500 mt-1">
                              {formatTime(task.createdAt)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 空结果状态 */}
                {showEmptyState && (
                  <div className="py-12 text-center">
                    <IconSearch className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">未找到相关内容</p>
                    <p className="text-sm text-slate-500 mt-1">尝试使用其他关键词</p>
                  </div>
                )}

                {/* 输入提示 */}
                {query.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-slate-500">输入关键词开始搜索</p>
                    <p className="text-xs text-slate-600 mt-2">至少 {MIN_SEARCH_LENGTH} 个字符</p>
                  </div>
                )}

                {query.length === 1 && (
                  <div className="py-8 text-center">
                    <p className="text-slate-500">继续输入...</p>
                    <p className="text-xs text-slate-600 mt-2">
                      至少需要 {MIN_SEARCH_LENGTH} 个字符
                    </p>
                  </div>
                )}
              </div>

              {/* 底部快捷键提示 */}
              <div className="px-4 py-2.5 border-t border-white/10 flex items-center gap-4 text-xs text-slate-500">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑↓</kbd> 导航
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↵</kbd> 选择
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">esc</kbd> 关闭
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
