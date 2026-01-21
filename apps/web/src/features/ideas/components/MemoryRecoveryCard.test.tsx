import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRecoveryCard } from './MemoryRecoveryCard';
import { Idea } from '../types';

// Mock useAnalytics hook
const mockTrack = vi.fn();
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ track: mockTrack }),
}));

// Mock framer-motion 避免动画干扰测试
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('MemoryRecoveryCard', () => {
  const mockStaleIdea: Idea = {
    id: 'test-idea-1',
    content: 'Test idea content',
    userId: 'user-1',
    isStale: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14天前
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    sources: [{ type: 'link', url: 'https://example.com', meta: { title: 'Example Link' } }],
  };

  const mockNonStaleIdea: Idea = {
    id: 'test-idea-2',
    content: 'Non-stale idea',
    userId: 'user-1',
    isStale: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // AC1: 用户打开 7天+ 的想法时显示记忆恢复卡片
  it('should render MemoryRecoveryCard for stale idea', () => {
    render(<MemoryRecoveryCard idea={mockStaleIdea} />);

    // 检查卡片标题
    expect(screen.getByText('记忆恢复')).toBeInTheDocument();
    // 检查 test-id
    expect(screen.getByTestId('memory-recovery-card')).toBeInTheDocument();
  });

  // AC2: 卡片应显示相对时间
  it('should display relative time in Chinese', () => {
    render(<MemoryRecoveryCard idea={mockStaleIdea} />);

    // 应该包含"前"表示相对时间
    expect(screen.getByText(/前/)).toBeInTheDocument();
  });

  // AC2: 卡片应显示来源信息
  it('should display source preview when sources exist', () => {
    render(<MemoryRecoveryCard idea={mockStaleIdea} />);

    // 来源链接标题应该显示
    expect(screen.getByText('Example Link')).toBeInTheDocument();
  });

  // AC3: 显示反馈按钮
  it('should display feedback buttons initially', () => {
    render(<MemoryRecoveryCard idea={mockStaleIdea} />);

    expect(screen.getByTestId('feedback-helpful')).toBeInTheDocument();
    expect(screen.getByTestId('feedback-not-helpful')).toBeInTheDocument();
    expect(screen.getByText('👍 有帮助')).toBeInTheDocument();
    expect(screen.getByText('👎 没帮助')).toBeInTheDocument();
  });

  // AC3: 点击"有帮助"按钮后应调用埋点并显示感谢信息
  it('should track helpful feedback and show thanks message', async () => {
    render(<MemoryRecoveryCard idea={mockStaleIdea} />);

    const helpfulButton = screen.getByTestId('feedback-helpful');
    fireEvent.click(helpfulButton);

    // 验证埋点调用
    expect(mockTrack).toHaveBeenCalledWith(
      'memory_recovery_helpful',
      expect.objectContaining({
        ideaId: mockStaleIdea.id,
        helpful: true,
        daysStale: expect.any(Number),
      })
    );
    // 验证感谢信息显示
    await waitFor(() => {
      expect(screen.getByTestId('feedback-thanks')).toBeInTheDocument();
    });

    // 验证按钮消失
    expect(screen.queryByTestId('feedback-helpful')).not.toBeInTheDocument();
    expect(screen.queryByTestId('feedback-not-helpful')).not.toBeInTheDocument();
  });

  // AC3: 点击"没帮助"按钮后应调用埋点并显示感谢信息
  it('should track not helpful feedback and show thanks message', async () => {
    render(<MemoryRecoveryCard idea={mockStaleIdea} />);

    const notHelpfulButton = screen.getByTestId('feedback-not-helpful');
    fireEvent.click(notHelpfulButton);

    // 验证埋点调用
    expect(mockTrack).toHaveBeenCalledWith(
      'memory_recovery_helpful',
      expect.objectContaining({
        ideaId: mockStaleIdea.id,
        helpful: false,
        daysStale: expect.any(Number),
      })
    );

    // 验证感谢信息显示
    await waitFor(() => {
      expect(screen.getByTestId('feedback-thanks')).toBeInTheDocument();
    });
  });

  // 边界情况: 没有来源信息时不应显示来源区域
  it('should not display source section when no sources', () => {
    const ideaWithoutSources: Idea = {
      ...mockStaleIdea,
      sources: [],
    };
    render(<MemoryRecoveryCard idea={ideaWithoutSources} />);

    expect(screen.queryByText('Example Link')).not.toBeInTheDocument();
  });
});
