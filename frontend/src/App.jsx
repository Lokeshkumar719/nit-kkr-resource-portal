import React from 'react';
import { Routes, Route, Navigate, BrowserRouter, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { AppSkeleton, AdminAppSkeleton } from './components/ui/Skeleton.jsx';

import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Resources from './pages/Resources.jsx';
import Seniors from './pages/Seniors.jsx';
import Alumni from './pages/Alumni.jsx';
import Contribute from './pages/Contribute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Home from './pages/Home.jsx';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// --- Protected Route ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading AND no cached user — show skeleton
  if (loading && !user) {
    return (
      <Layout>
        {location.pathname.startsWith('/admin') ? <AdminAppSkeleton /> : <AppSkeleton />}
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Admins can access User routes
    if (!(user.role === 'ADMIN' && allowedRole === 'USER')) {
      return <Navigate to={user.role === 'ADMIN' ? "/admin/dashboard" : "/dashboard"} replace />;
    }
  }

  return <Layout>{children}</Layout>;
};

// --- Public Route (Redirects if already logged in) ---
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading AND no cached user — show skeleton
  if (loading && !user) {
    return (
      <Layout>
        {location.pathname.startsWith('/admin') ? <AdminAppSkeleton /> : <AppSkeleton />}
      </Layout>
    );
  }

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return children;
};

// --- App Component ---
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />

          {/* Default Route - Landing Page */}
          <Route path="/" element={<Home />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRole="USER"><Dashboard /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute allowedRole="USER"><Resources /></ProtectedRoute>} />
          <Route path="/seniors" element={<ProtectedRoute allowedRole="USER"><Seniors /></ProtectedRoute>} />
          <Route path="/alumni" element={<ProtectedRoute allowedRole="USER"><Alumni /></ProtectedRoute>} />
          <Route path="/contribute" element={<ProtectedRoute allowedRole="USER"><Contribute /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
