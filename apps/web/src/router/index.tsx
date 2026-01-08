import { lazy } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Lazy load feature components
const Dashboard = lazy(() =>
  import('@/features/dashboard/Dashboard').then((module) => ({ default: module.Dashboard }))
);
const Ideas = lazy(() =>
  import('@/features/ideas/Ideas').then((module) => ({ default: module.Ideas }))
);
const Tasks = lazy(() =>
  import('@/features/tasks/Tasks').then((module) => ({ default: module.Tasks }))
);
const Canvas = lazy(() =>
  import('@/features/canvas/Canvas').then((module) => ({ default: module.Canvas }))
);
const CanvasDetailPage = lazy(() =>
  import('@/features/canvas/CanvasDetailPage').then((module) => ({
    default: module.CanvasDetailPage,
  }))
);
const Settings = lazy(() =>
  import('@/features/settings/Settings').then((module) => ({ default: module.Settings }))
);
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((module) => ({ default: module.RegisterPage }))
);
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage }))
);

export function AppRoutes() {
  const element = useRoutes([
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    // Full-width canvas detail page (outside Layout)
    {
      path: '/canvas/:id',
      element: (
        <ProtectedRoute>
          <CanvasDetailPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'ideas',
          element: <Ideas />,
        },
        {
          path: 'tasks',
          element: <Tasks />,
        },
        {
          path: 'canvas',
          element: <Canvas />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
      ],
    },
    {
      // Wildcard route: redirect to root, ProtectedRoute will handle redirect to /login or /dashboard
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return element;
}
