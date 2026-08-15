import { useState } from "react";

import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";

function Login() {
  const { checkAuth } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      await login(email, password);
      await checkAuth();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <div className="form-header">
        <h2>Welcome back</h2>
        <p>Sign in with your NIT KKR email and password.</p>
      </div>

      <div className="input-group">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          className="auth-input"
          type="email"
          placeholder="yourname@nitkkr.ac.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className="auth-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {message.text && (
        <div className={`auth-message ${message.type}`}>{message.text}</div>
      )}

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default Login;
