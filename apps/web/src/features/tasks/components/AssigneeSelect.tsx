import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { IconUser, IconDown, IconSearch } from '@arco-design/web-react/icon';
import { getCanvasMembers, TeamMember } from '../../../services/teams.api';
import { useAuth } from '../../../hooks/useAuth';

interface AssigneeSelectProps {
  canvasId?: string | null;
  value?: string | null;
  onChange: (assigneeId: string | null) => void;
  placeholder?: string;
}

/**
 * Story 8.3: 成员选择器组件
 * 用于将任务分配给团队成员
 */
export function AssigneeSelect({
  canvasId,
  value,
  onChange,
  placeholder = '未分配',
}: AssigneeSelectProps) {
  const [user] = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // 获取画布成员
  const { data: membersData, isLoading } = useQuery({
    queryKey: ['canvasMembers', canvasId],
    queryFn: () => getCanvasMembers(canvasId!),
    enabled: !!canvasId,
  });

  const members = membersData?.data || [];

  // 客户端过滤：排除自己，并支持搜索
  const filteredMembers = members
    .filter((m) => m.userId !== user?.id)
    .filter((m) => m.user.username?.toLowerCase().includes(search.toLowerCase()) || search === '');

  const selectedMember = members.find((m) => m.userId === value);

  // 生成用户头像（用户名首字母）
  const getAvatar = (username?: string) => {
    return username?.[0]?.toUpperCase() || '?';
  };

  return (
    <div className="relative inline-block text-left w-full group">
      <button
        type="button"
        role="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full glass-dark border-slate-700/50 rounded-xl shadow-lg pl-3 pr-10 py-2.5 text-left cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
      >
        <span className="flex items-center gap-2">
          {selectedMember ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {getAvatar(selectedMember.user.username)}
              </div>
              <span className="text-slate-200 font-medium truncate">
                {selectedMember.user.username || '未知用户'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <IconUser className="h-4 w-4 text-slate-500" />
              <span className="text-slate-400 font-medium">{placeholder}</span>
            </div>
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
            {/* 搜索框 */}
            <div className="p-3 border-b border-slate-700/50">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="搜索成员..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* 成员列表 */}
            <div className="py-1 max-h-60 overflow-auto" role="menu">
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">加载中...</div>
              ) : filteredMembers.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  {search ? '未找到匹配的成员' : canvasId ? '暂无团队成员' : '请先选择画布'}
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      onChange(member.userId);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className="flex items-center w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold mr-2">
                      {getAvatar(member.user.username)}
                    </div>
                    <span className="truncate">{member.user.username || '未知用户'}</span>
                  </button>
                ))
              )}
            </div>

            {/* 清除分配按钮 */}
            {value && (
              <>
                <div className="border-t border-slate-700/50"></div>
                <button
                  onClick={() => {
                    onChange(null);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
                >
                  <IconUser className="mr-2 h-4 w-4" />
                  清除分配
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
