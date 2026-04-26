import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { SourcesList, SourceDetail } from './pages/Sources';
import { BuyersList, BuyerDetail } from './pages/Buyers';
import { TradesList, TradeDetail } from './pages/Trades';
import { ProjectsList, ProjectDetail } from './pages/Projects';
import Team from './pages/Team';

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0F1117] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#2E3349] border-t-[#D4860B] rounded-full animate-spin" /></div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/sources" element={<ProtectedRoute><Layout><SourcesList /></Layout></ProtectedRoute>} />
      <Route path="/sources/:id" element={<ProtectedRoute><Layout><SourceDetail /></Layout></ProtectedRoute>} />
      <Route path="/buyers" element={<ProtectedRoute><Layout><BuyersList /></Layout></ProtectedRoute>} />
      <Route path="/buyers/:id" element={<ProtectedRoute><Layout><BuyerDetail /></Layout></ProtectedRoute>} />
      <Route path="/trades" element={<ProtectedRoute><Layout><TradesList /></Layout></ProtectedRoute>} />
      <Route path="/trades/:id" element={<ProtectedRoute><Layout><TradeDetail /></Layout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Layout><ProjectsList /></Layout></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><Layout><ProjectDetail /></Layout></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute adminOnly><Layout><Team /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
