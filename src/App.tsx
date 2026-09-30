import { Suspense, lazy } from 'react';
import { useResQStore } from './store/useResQStore';
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary';
import { GlobalLayout } from './components/layout';

const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const SafeRoutePage = lazy(() =>
  import('./pages/SafeRoutePage').then((m) => ({ default: m.SafeRoutePage }))
);
const AlertsPage = lazy(() =>
  import('./pages/AlertsPage').then((m) => ({ default: m.AlertsPage }))
);
const ReportsPage = lazy(() =>
  import('./pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);

function RouteSkeletonFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="space-y-6 py-4"
    >
      <div className="resq-card h-48 animate-pulse bg-white" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="resq-card h-44 animate-pulse bg-white" />
        <div className="resq-card h-44 animate-pulse bg-white" />
        <div className="resq-card h-44 animate-pulse bg-white" />
      </div>
    </div>
  );
}

function AppContent() {
  const { activeTab } = useResQStore();

  return (
    <GlobalLayout>
      <Suspense fallback={<RouteSkeletonFallback />}>
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'route' && <SafeRoutePage />}
        {activeTab === 'alerts' && <AlertsPage />}
        {activeTab === 'reports' && <ReportsPage />}
      </Suspense>
    </GlobalLayout>
  );
}

export function App() {
  return (
    <GlobalErrorBoundary>
      <AppContent />
    </GlobalErrorBoundary>
  );
}

export default App;
