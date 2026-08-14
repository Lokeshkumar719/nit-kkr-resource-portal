import React from 'react';
import { Routes, Route, Navigate, BrowserRouter, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { PageLoader } from './components/ui/Spinner.jsx';

import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Resources from './pages/Resources.jsx';
import Seniors from './pages/Seniors.jsx';
import Alumni from './pages/Alumni.jsx';
import Contribute from './pages/Contribute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// --- Protected Route ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
import { useState } from "react";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Contribute from "./pages/Contribute";
import ReportBug from "./pages/ReportBug";
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";

function App() {
  const { user, loading } = useAuth();

  const [page, setPage] = useState("dashboard");

  if (loading) {
    return <div className="app-loading">Loading your portal...</div>;
  }

  if (loading) return <PageLoader />;

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

  if (loading) return <PageLoader />;

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

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

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
    return <AuthLayout />;
  }

  return (
    <div>
      <Navbar setPage={setPage} />

      {page === "dashboard" && <Dashboard />}

      {page === "resources" && <Resources />}

      {page === "contribute" && <Contribute />}

      {page === "bug" && <ReportBug />}

      {page === "admin" && <AdminDashboard />}
    </div>
  );
}

function AuthLayout() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="auth-hero-content">
          <div className="brand-badge">NIT KKR Resource Portal</div>

          <h1 className="auth-title">Learn smarter with campus resources.</h1>

          <p className="auth-subtitle">
            Access curated notes, previous year resources, subject support, and
            contribution tools built for NIT Kurukshetra students.
          </p>

          <ul className="auth-features">
            <li>
              <span className="feature-dot" /> Verified student access
            </li>
            <li>
              <span className="feature-dot" /> Subject-wise resources
            </li>
            <li>
              <span className="feature-dot" /> Secure one-time email
              verification
            </li>
          </ul>
        </div>
      </section>

      <section className="auth-panel-wrap">
        <div className="auth-panel">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>

            <button
              type="button"
              className={`auth-tab ${activeTab === "verify" ? "active" : ""}`}
              onClick={() => setActiveTab("verify")}
            >
              Verify OTP
            </button>
          </div>

          {activeTab === "login" && <Login />}

          {activeTab === "register" && <Register setActiveTab={setActiveTab} />}

          {activeTab === "verify" && <VerifyOTP setActiveTab={setActiveTab} />}
        </div>
      </section>
    </div>
  );
}

export default App;
