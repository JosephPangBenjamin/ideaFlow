import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Idea } from '../types';
import { SourcePreview } from './SourcePreview';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatRelativeTime } from '@/utils/date';
import dayjs from 'dayjs';

interface MemoryRecoveryCardProps {
  idea: Idea;
}

/**
 * 记忆恢复卡片组件
 * 当用户打开一个沉底点子（isStale=true，7天+未操作）时显示，
 * 帮助用户回忆起当初记录这个想法的原因和上下文。
 */
export const MemoryRecoveryCard: React.FC<MemoryRecoveryCardProps> = ({ idea }) => {
  const { track } = useAnalytics();
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // 处理用户反馈（有帮助/没帮助）
  const handleFeedback = (helpful: boolean) => {
    const createdAt = dayjs(idea.createdAt);
    const daysStale = dayjs().diff(createdAt, 'day');

    track('memory_recovery_helpful', {
      ideaId: idea.id,
      helpful,
      daysStale,
    });
    setFeedbackGiven(true);
  };

  // 使用项目统一的日期工具库
  const timeAgo = formatRelativeTime(idea.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm"
      data-testid="memory-recovery-card"
    >
      {/* 标题区域 */}
      <div className="flex items-center gap-2 text-purple-300 mb-2">
        <span className="text-lg">💡</span>
        <span className="text-sm font-medium">记忆恢复</span>
      </div>

      {/* 时间提示 */}
      <p className="text-slate-300 text-sm mb-3">
        这个想法创建于 <span className="text-purple-400 font-medium">{timeAgo}</span>
      </p>

      {/* 来源信息展示 */}
      {idea.sources && idea.sources.length > 0 && (
        <div className="mb-3 space-y-2">
          {idea.sources.map((source, index) => (
            <SourcePreview key={index} source={source} compact />
          ))}
        </div>
      )}

      {/* 反馈按钮区域 */}
      {!feedbackGiven ? (
        <div className="mt-4 pt-3 border-t border-purple-500/20">
          <p className="text-slate-400 text-xs mb-2">这个想法帮到你了吗？</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleFeedback(true)}
              className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors border border-purple-500/30"
              data-testid="feedback-helpful"
              title="有帮助"
              aria-label="标记想法恢复有帮助"
            >
              👍 有帮助
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 transition-colors border border-slate-500/30"
              data-testid="feedback-not-helpful"
              title="没帮助"
              aria-label="标记想法恢复没帮助"
            >
              👎 没帮助
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-purple-500/20">
          <p className="text-purple-400 text-sm" data-testid="feedback-thanks">
            ✨ 感谢反馈！
          </p>
        </div>
      )}
    </motion.div>
  );
};
