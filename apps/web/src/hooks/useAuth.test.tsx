import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { authService } from '@/services/auth.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Provider } from 'jotai';

// Mock dependencies
vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('jotai/utils', async () => {
  const { atom } = await import('jotai');
  return {
    atomWithStorage: (_key: string, initialValue: any) => atom(initialValue),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Provider });

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

it('should logout locally even if API fails', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper: Provider });
  // Mock API failure
  (authService.logout as any).mockRejectedValueOnce(new Error('Logout failed'));

  await act(async () => {
    await result.current.logout();
  });

  // Should still clear state and navigate
  expect(authService.logout).toHaveBeenCalled();
  expect(result.current.user).toBeNull();
  expect(result.current.accessToken).toBeNull();
  expect(result.current.isAuthenticated).toBeFalsy();
  expect(mockNavigate).toHaveBeenCalledWith('/login');
});
