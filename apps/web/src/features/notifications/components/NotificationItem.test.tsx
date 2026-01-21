import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { NotificationItem } from './NotificationItem';

describe('NotificationItem', () => {
  const mockNotification = {
    id: '1',
    type: 'stale_reminder' as const,
    title: 'Test Title',
    message: 'Test Message',
    isRead: false,
    createdAt: new Date().toISOString(),
    data: null,
  };

  it('should render notification content', () => {
    render(<NotificationItem notification={mockNotification} onClick={vi.fn()} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should show stale_reminder tag for stale_reminder notifications', () => {
    render(<NotificationItem notification={mockNotification} onClick={vi.fn()} />);

    expect(screen.getByText('沉底提醒')).toBeInTheDocument();
  });

  it('should not show stale_reminder tag for system notifications', () => {
    const systemNotification = { ...mockNotification, type: 'system' as const };
    render(<NotificationItem notification={systemNotification} onClick={vi.fn()} />);

    expect(screen.queryByText('沉底提醒')).not.toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<NotificationItem notification={mockNotification} onClick={handleClick} />);

    fireEvent.click(screen.getByText('Test Title').closest('.cursor-pointer')!);
    expect(handleClick).toHaveBeenCalledWith('1');
  });

  it('should have unread dot and different style when isRead is false', () => {
    const { container } = render(
      <NotificationItem notification={mockNotification} onClick={vi.fn()} />
    );

    // Check if the unread dot (blue-500 rounded-full) exists
    expect(container.querySelector('.bg-blue-500')).toBeInTheDocument();
  });
});
