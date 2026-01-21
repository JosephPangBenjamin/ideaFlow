import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NotificationDropdown } from './NotificationDropdown';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

// Mock hooks
vi.mock('../hooks/useNotifications');
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe('NotificationDropdown Redirection', () => {
  const mockNavigate = vi.fn();

  const mockNotifications = [
    {
      id: '1',
      type: 'stale_reminder',
      title: '沉底点子提醒',
      message: '你有 5 个想法放了超过 7 天',
      isRead: false,
      createdAt: new Date().toISOString(),
      data: { staleCount: 5 },
    },
    {
      id: '2',
      type: 'system',
      title: '新想法任务',
      message: '你有一个新任务',
      isRead: false,
      createdAt: new Date().toISOString(),
      data: { ideaId: 'idea_123' },
    },
    {
      id: '3',
      type: 'system',
      title: '画布更新',
      message: '画布已被更新',
      isRead: false,
      createdAt: new Date().toISOString(),
      data: { canvasId: 'canvas_456' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useNotifications as any).mockReturnValue({
      notifications: mockNotifications,
      isLoading: false,
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
    });
  });

  it('should navigate to stale ideas page when clicking a stale_reminder notification', () => {
    render(<NotificationDropdown />);

    const staleItem = screen.getByText('沉底点子提醒');
    fireEvent.click(staleItem.closest('.cursor-pointer')!);

    expect(mockNavigate).toHaveBeenCalledWith('/ideas?isStale=true');
  });

  it('should navigate to specific idea page when clicking a system notification with ideaId', () => {
    render(<NotificationDropdown />);

    const ideaItem = screen.getByText('新想法任务');
    fireEvent.click(ideaItem.closest('.cursor-pointer')!);

    expect(mockNavigate).toHaveBeenCalledWith('/ideas/idea_123');
  });

  it('should navigate to specific canvas page when clicking a system notification with canvasId', () => {
    render(<NotificationDropdown />);

    const canvasItem = screen.getByText('画布更新');
    fireEvent.click(canvasItem.closest('.cursor-pointer')!);

    expect(mockNavigate).toHaveBeenCalledWith('/canvas/canvas_456');
  });
});
