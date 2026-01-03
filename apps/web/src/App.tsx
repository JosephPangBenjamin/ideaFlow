import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import '@arco-design/web-react/dist/css/arco.css';
import './index.css';
import { AppRoutes } from './router';
import { Loading } from './components/Loading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
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
