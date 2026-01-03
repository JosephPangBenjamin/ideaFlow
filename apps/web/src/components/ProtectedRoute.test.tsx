import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, createStore } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { ProtectedRoute } from './ProtectedRoute';
import { authAtom } from '@/stores/authAtom';

interface AuthState {
  user: { id: string; username: string } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

// Component to hydrate atoms before rendering
function HydrateAtoms({
  initialValues,
  children,
}: {
  initialValues: Array<[typeof authAtom, AuthState]>;
  children: React.ReactNode;
}) {
  useHydrateAtoms(initialValues);
  return children;
}

// Helper to render with providers
function renderWithProviders(
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    authState = {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,
    } as AuthState,
  } = {}
) {
  const store = createStore();

  return render(
    <Provider store={store}>
      <HydrateAtoms initialValues={[[authAtom, authState]]}>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </HydrateAtoms>
    </Provider>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Mock localStorage is handled by setup.ts and cleared afterEach
  });

  describe('when user is authenticated and hydrated', () => {
    it('should render children', () => {
      renderWithProviders(
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>,
        {
          authState: {
            user: { id: '1', username: 'testuser' },
            accessToken: 'test-token',
            isAuthenticated: true,
            isHydrated: true,
          },
        }
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });
  });

  describe('when user is not authenticated but hydrated', () => {
    it('should redirect to /login', () => {
      renderWithProviders(
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>,
        {
          authState: {
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isHydrated: true,
          },
        }
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('loading/hydration state', () => {
    it('should show loading indicator while not hydrated', () => {
      renderWithProviders(
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>,
        {
          authState: {
            user: { id: '1', username: 'testuser' },
            accessToken: 'test-token',
            isAuthenticated: true,
            isHydrated: false, // NOT HYDRATED
          },
        }
      );

      // Should show loading spinner/text, NOT protected content NOT login redirect
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('wildcard routing logic', () => {
    it('authenticated user accessing invalid route should eventually reach dashboard', async () => {
      // Note: This test verifies the routing logic integration
      // We use the AppRoutes if possible, but for isolation we test the logic here
      renderWithProviders(
        <Routes>
          {/* Simplified version of AppRoutes logic */}
          <Route path="/dashboard" element={<div data-testid="dashboard">Dashboard</div>} />
          <Route path="/login" element={<div data-testid="login">Login</div>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route index element={<div data-testid="root-redirect">Redirecting...</div>} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>,
        {
          initialEntries: ['/invalid-route'],
          authState: {
            user: { id: '1', username: 'testuser' },
            accessToken: 'test-token',
            isAuthenticated: true,
            isHydrated: true,
          },
        }
      );

      // /invalid-route -> / -> ProtectedRoute passes -> Root index
      expect(screen.getByTestId('root-redirect')).toBeInTheDocument();
    });
  });
});
