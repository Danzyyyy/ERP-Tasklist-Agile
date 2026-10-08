import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { TasklistTreePage } from './pages/TasklistTreePage';
import { AgileBoardPage } from './pages/AgileBoardPage';
import { UserRole } from './types/task.types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'hierarchy' | 'kanban'>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('TECHNICAL_LEAD');

  // Initialize role and token from localStorage if available
  useEffect(() => {
    const savedToken = localStorage.getItem('erp_token');
    if (!savedToken) {
      localStorage.setItem('erp_token', 'mock_tl');
    }
  }, []);

  const handleRoleChange = (role: UserRole, token: string) => {
    setCurrentRole(role);
    localStorage.setItem('erp_token', token);
    // Invalidate queries so headers refetch immediately
    queryClient.invalidateQueries();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <DashboardPage currentRole={currentRole} onNavigate={setCurrentTab} />
        )}
        {currentTab === 'hierarchy' && (
          <TasklistTreePage currentRole={currentRole} />
        )}
        {currentTab === 'kanban' && (
          <AgileBoardPage currentRole={currentRole} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ERP PT. Anaheim Nimbus Universal &bull; Modul E-4 (Kelompok 4 / Kelas E)
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Arsitektur Monorepo: Laravel 11 REST API + React 18 SPA + UUID v7
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
