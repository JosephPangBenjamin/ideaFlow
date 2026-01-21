import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NotificationBell } from './NotificationBell';
import { useNotifications } from '../hooks/useNotifications';
import { Provider } from 'jotai';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock hook
vi.mock('../hooks/useNotifications');

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );

  it('should not show badge when unreadCount is 0', () => {
    (useNotifications as any).mockReturnValue({
      unreadCount: 0,
      notifications: [],
      isLoading: false,
      fetchNotifications: vi.fn(),
    });

    render(<NotificationBell />, { wrapper });

    // Arco Badge might still render but with count 0 or hidden
    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });

  it('should show count when unreadCount > 0', () => {
    (useNotifications as any).mockReturnValue({
      unreadCount: 5,
      notifications: [],
      isLoading: false,
      fetchNotifications: vi.fn(),
    });

    render(<NotificationBell />, { wrapper });

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should show 99+ when unreadCount > 99', () => {
    (useNotifications as any).mockReturnValue({
      unreadCount: 150,
      notifications: [],
      isLoading: false,
      fetchNotifications: vi.fn(),
    });

    render(<NotificationBell />, { wrapper });

    // Default maxCount in our implementation was 99
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});
