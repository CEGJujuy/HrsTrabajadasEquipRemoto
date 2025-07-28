import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { RoleSelector } from './components/RoleSelector';
import { TimerPage } from './pages/TimerPage';

const queryClient = new QueryClient();

function AppContent() {
  const { profile, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <RoleSelector onUserSelect={signIn} />
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TimerPage />} />
        <Route path="/dashboard" element={<div>Dashboard (Coming Soon)</div>} />
        <Route path="/projects" element={<div>Projects (Coming Soon)</div>} />
        <Route path="/employees" element={<div>Employees (Coming Soon)</div>} />
        <Route path="/reports" element={<div>Reports (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
        <Toaster position="top-right" richColors />
      </Router>
    </QueryClientProvider>
  );
}

export default App;