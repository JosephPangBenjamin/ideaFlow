import { Navigate, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { authAtom } from '@/stores/authAtom';
import { Loading } from '@/components/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 *
 * Features:
 * - Redirects unauthenticated users to /login
 * - Preserves original location for redirect after login
 * - Renders children for authenticated users
 * - Handles hydration/loading state to prevent flickering
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAtomValue(authAtom);
  const location = useLocation();

  // While hydration is in progress, show loading state
  if (!isHydrated) {
    return <Loading />;
  }

  // If not authenticated, redirect to login page
  // Store the current location in state so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
