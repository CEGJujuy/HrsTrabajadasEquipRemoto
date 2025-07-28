import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { TimerPage } from './pages/TimerPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
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