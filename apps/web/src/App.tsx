import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';
import { useAtom } from 'jotai';
import '@arco-design/web-react/dist/css/arco.css';
import './index.css';
import { AppRoutes } from './router';
import { Loading } from './components/Loading';
import { authAtom, AuthState } from './stores/authAtom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const [, setAuth] = useAtom(authAtom);

  useEffect(() => {
    // Flag hydration as complete after first mount
    // Jotai's atomWithStorage is already synchronous,
    // but this ensures isHydrated becomes true for components waiting on it.
    setAuth((prev: AuthState) => ({ ...prev, isHydrated: true }));

    // Enable Arco Design dark theme globally
    document.body.setAttribute('arco-theme', 'dark');
    document.body.classList.add('dark');
  }, [setAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<Loading />}>
          <AppRoutes />
        </Suspense>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
