import { lazy } from 'react';
import { useRoutes, Navigate, useLocation, useParams } from 'react-router-dom';
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
const TaskDetail = lazy(() =>
  import('@/features/tasks/TaskDetail').then((module) => ({ default: module.default }))
);
const CanvasDetailPage = lazy(() =>
  import('@/features/canvas/CanvasDetailPage').then((module) => ({
    default: module.CanvasDetailPage,
  }))
);
const CanvasListPage = lazy(() =>
  import('@/features/canvas/pages/CanvasListPage').then((module) => ({
    default: module.CanvasListPage,
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
const OAuthCallbackPage = lazy(() =>
  import('@/features/auth/pages/OAuthCallbackPage').then((module) => ({
    default: module.OAuthCallbackPage,
  }))
);

// Story 7.1: 公开页面组件 (无需登录)
const PublicIdeaPage = lazy(() =>
  import('@/pages/PublicIdeaPage').then((module) => ({ default: module.PublicIdeaPage }))
);
const PublicCanvasPage = lazy(() =>
  import('@/pages/PublicCanvasPage').then((module) => ({ default: module.PublicCanvasPage }))
);

// Story 8.1: 协作分享页面组件 (无需登录)
const SharedCanvasPage = lazy(() =>
  import('@/features/canvas/components/SharedCanvasView').then((module) => ({
    default: module.SharedCanvasView,
  }))
);

// Story 8.2: 邀请注册页面 (无需登录)
const InviteRegisterPage = lazy(() =>
  import('@/features/auth/pages/InviteRegisterPage').then((module) => ({
    default: module.InviteRegisterPage,
  }))
);

/**
 * 动态路由组件：根据 query 参数决定显示注册页面还是共享画布
 * ?register=true → InviteRegisterPage
 * 无参数或 ?register=false → SharedCanvasPage
 */
const SharedCanvasOrRegister: React.FC = () => {
  const location = useLocation();

  // 检查 URL query 参数
  const searchParams = new URLSearchParams(location.search);
  const shouldShowRegister = searchParams.get('register') === 'true';
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (shouldShowRegister) {
    return <InviteRegisterPage />;
  }

  return <SharedCanvasPage />;
};

export function AppRoutes() {
  const element = useRoutes([
    // Story 7.1: 公开分享路由 (无需登录)
    {
      path: '/public/idea/:token',
      element: <PublicIdeaPage />,
    },
    {
      path: '/public/canvas/:token',
      element: <PublicCanvasPage />,
    },
    // Story 8.1: 协作分享路由 (无需登录)
    // Story 8.2: 支持 ?register=true 显示注册页面
    {
      path: '/shared/canvases/:token',
      element: <SharedCanvasOrRegister />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/oauth/callback',
      element: <OAuthCallbackPage />,
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
          path: 'tasks/:id',
          element: <TaskDetail />,
        },
        {
          path: 'canvas',
          element: <CanvasListPage />,
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
