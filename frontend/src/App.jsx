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

  if (!user) {
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
